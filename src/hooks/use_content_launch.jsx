/**
 * 콘텐츠 론칭 상태 관리 커스텀 훅
 * localStorage 기반 '생성 중' 영상 관리 포함
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch, get_latest_completed_video, get_videos_completed_after } from '../lib/api.js';

/**
 * 콘텐츠 론칭 관련 상태와 액션을 제공하는 Zustand 스토어
 * @returns {Object} 콘텐츠 론칭 상태와 액션 함수들
 */
export const use_content_launch = create(
  persist(
    (set, get) => ({
      // 기존 상태
      open_folders: [],
      uploading_items: [],
      
      // 새로운 상태 - localStorage에 저장될 '생성 중' 영상들
      pending_videos: [],
      
      // 폴더 데이터 (API + localStorage 병합 결과)
      folders: [],

      // 영상 선택 상태
      selected_video_id: null,
      selected_video_data: null,

      // SSE 기반 실시간 업데이트 상태 관리
      sse_update_in_progress: false,
      last_sse_update_time: null,
      sse_update_error: null,

      /**
       * 폴더 열기/닫기 토글
       * @param {string} date - 날짜 문자열
       */
      toggle_folder: (date) => {
        set((state) => ({
          open_folders: state.open_folders.includes(date)
            ? state.open_folders.filter(d => d !== date)
            : [...state.open_folders, date]
        }));
      },

      /**
       * 아이템 업로드 시작
       * @param {string} item_id - 아이템 ID
       */
      start_upload: (item_id) => {
        set((state) => ({
          uploading_items: [...state.uploading_items, item_id]
        }));
      },

      /**
       * 아이템 업로드 완료
       * @param {string} item_id - 아이템 ID
       */
      finish_upload: (item_id) => {
        console.log(`업로드 완료 처리 시작: ${item_id}`);
        
        // 업로드 중 목록에서 제거
        set((state) => ({
          uploading_items: state.uploading_items.filter(id => id !== item_id)
        }));
        
        // 해당 영상의 상태를 uploaded로 변경
        set((state) => ({
          pending_videos: state.pending_videos.map(video => {
            const video_id = video.video_id || video.temp_id || video.id;
            return video_id === item_id 
              ? { ...video, status: 'uploaded' }
              : video;
          })
        }));
        
        // 상태 업데이트 후 폴더 목록 갱신
        get().fetch_folders();
        
        console.log(`업로드 완료 처리 완료: ${item_id} → uploaded`);
      },

      /**
       * 업로드 시뮬레이션
       * @param {string} item_id - 아이템 ID
       * @param {number} delay - 지연 시간 (기본값: 3000ms)
       */
      simulate_upload: async (item_id, delay = 3000) => {
        const { start_upload, finish_upload } = get();
        start_upload(item_id);
        await new Promise(resolve => setTimeout(resolve, delay));
        finish_upload(item_id);
      },

      /**
       * API와 localStorage 데이터를 병합하여 폴더 목록을 가져오는 함수
       */
      fetch_folders: async () => {
        try {
          // TODO: 실제 API 호출로 교체
          // 현재는 빈 배열로 초기화 (목업 데이터 제거됨)
          const api_folders = [];
          
          const pending_videos = get().pending_videos;
          
          // pending_videos를 날짜별로 그룹화
          const grouped_by_date = {};
          pending_videos.forEach(video => {
            const date = video.creation_date;
            if (!grouped_by_date[date]) {
              grouped_by_date[date] = [];
            }
            grouped_by_date[date].push(video);
          });
          
          // 날짜별 폴더 생성
          const pending_folders = Object.keys(grouped_by_date).map(date => ({
            date: date,
            display_date: new Date(date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            item_count: grouped_by_date[date].length,
            items: grouped_by_date[date],
            is_pending: true
          }));
          
          // 날짜순 정렬 (최신 날짜가 위로)
          pending_folders.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // API 폴더와 pending 폴더 병합
          const merged_folders = [...pending_folders, ...api_folders];
          
          set({ folders: merged_folders });
        } catch (error) {
          console.error('폴더 목록 가져오기 실패:', error);
        }
      },
      
      /**
       * 새로운 '생성 중' 영상을 추가하는 함수
       * @param {Object} video_data - 영상 데이터 객체
       * @param {string} creation_date - 생성 날짜 (YYYY-MM-DD 형식)
       */
      add_pending_video: (video_data, creation_date) => {
        const new_pending_video = {
          temp_id: `temp-${Date.now()}`,
          title: video_data.title || '새로운 AI 영상',
          status: 'PROCESSING',
          start_time: new Date().toISOString(),
          creationTime: new Date().toISOString(),
          image_url: video_data.image_url,
          creation_date: creation_date,
          ...video_data
        };
        
        // 현재 folders 상태에서 creation_date와 일치하는 폴더 찾기
        const current_folders = get().folders;
        const existing_folder_index = current_folders.findIndex(folder => folder.date === creation_date);
        
        if (existing_folder_index !== -1) {
          // 기존 폴더가 있는 경우: 해당 폴더의 items 맨 뒤에 추가 (시간순 정렬)
          const updated_folders = [...current_folders];
          updated_folders[existing_folder_index] = {
            ...updated_folders[existing_folder_index],
            items: [...updated_folders[existing_folder_index].items, new_pending_video],
            item_count: updated_folders[existing_folder_index].item_count + 1
          };
          set({ folders: updated_folders });
        } else {
          // 새로운 폴더 생성: 현재 날짜로 폴더를 만들고 전체 폴더 목록 맨 앞에 추가
          const new_folder = {
            date: creation_date,
            display_date: new Date(creation_date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            item_count: 1,
            items: [new_pending_video]
          };
          
          set((state) => ({
            folders: [new_folder, ...state.folders]
          }));
        }
        
        // pending_videos 상태도 업데이트 (localStorage 저장용) - 시간순 정렬
        set((state) => ({
          pending_videos: [...state.pending_videos, new_pending_video]
        }));
        
        // SSE 기반으로 전환됨 - 폴링 불필요
      },
      
      /**
       * 우선순위 재생성: 진행 중인 영상들을 교체하는 함수
       * @param {Object} newVideoData - 새 영상 데이터 객체
       * @param {string} creationDate - 생성 날짜 (YYYY-MM-DD 형식)
       */
      replace_processing_video: (newVideoData, creationDate) => {
        // 1. 새로운 영상 데이터 생성 (add_pending_video와 동일한 구조)
        const new_pending_video = {
          temp_id: `temp-${Date.now()}`,
          title: newVideoData.title || '새로운 AI 영상',
          status: 'PROCESSING',
          start_time: new Date().toISOString(),
          creationTime: new Date().toISOString(),
          image_url: newVideoData.image_url,
          creation_date: creationDate,
          ...newVideoData
        };
        
        // 2. folders에서 PROCESSING 상태인 항목들 제거하고 새 영상 추가
        const current_folders = get().folders;
        const updated_folders = current_folders.map(folder => {
          // 각 폴더에서 PROCESSING 상태 항목들 제거
          const filtered_items = folder.items.filter(item => item.status !== 'PROCESSING');
          
          // 해당 생성 날짜 폴더인 경우 새 영상 추가
          if (folder.date === creationDate) {
            return {
              ...folder,
              items: [...filtered_items, new_pending_video],
              item_count: filtered_items.length + 1
            };
          } else {
            return {
              ...folder,
              items: filtered_items,
              item_count: filtered_items.length
            };
          }
        });
        
        // 3. 해당 날짜 폴더가 없는 경우 새로 생성
        const existing_folder = updated_folders.find(folder => folder.date === creationDate);
        if (!existing_folder) {
          const new_folder = {
            date: creationDate,
            display_date: new Date(creationDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            item_count: 1,
            items: [new_pending_video]
          };
          
          updated_folders.unshift(new_folder); // 맨 앞에 추가
        }
        
        // 4. 전체 상태 업데이트
        set((state) => ({
          folders: updated_folders,
          pending_videos: [...state.pending_videos.filter(video => video.status !== 'PROCESSING'), new_pending_video]
        }));
        
        // 5. 폴더 목록 재갱신
        get().fetch_folders();
      },
      
      /**
       * '생성 중' 영상을 '업로드 대기' 상태로 전환하는 함수
       * @param {string} temp_id - 임시 ID
       */
      transition_to_ready: async (temp_id) => {
        console.log(`영상 ${temp_id}를 업로드 대기 상태로 전환 중...`);
        
        // 1. 상태 업데이트
        set((state) => ({
          pending_videos: state.pending_videos.map(video => 
            video.temp_id === temp_id 
              ? { ...video, status: 'ready' }
              : video
          )
        }));
        
        // 2. 백엔드에 완료 알림 및 다음 영상 요청
        try {
          await get().notify_completion_and_request_next(temp_id);
        } catch (error) {
          console.error('백엔드 완료 알림 실패:', error);
        }
        
        // 3. 상태 업데이트 후 폴더 목록 갱신
        get().fetch_folders();
        
        // SSE 기반으로 전환됨 - 폴링 불필요
        
        console.log(`영상 ${temp_id} 상태 변경 완료: ready`);
      },
      
      /**
       * '업로드 대기' 영상을 '완료' 상태로 전환하는 함수
       * @param {string} temp_id - 임시 ID
       */
      transition_to_uploaded: (temp_id) => {
        console.log(`영상 ${temp_id}를 완료 상태로 전환 중...`);
        
        set((state) => ({
          pending_videos: state.pending_videos.map(video => 
            video.temp_id === temp_id 
              ? { ...video, status: 'uploaded' }
              : video
          )
        }));
        
        // 상태 업데이트 후 폴더 목록 갱신
        get().fetch_folders();
        
        // SSE 기반으로 전환됨 - 폴링 불필요
        
        console.log(`영상 ${temp_id} 상태 변경 완료: uploaded`);
      },
      
      /**
       * 백엔드에 완료 알림 및 다음 영상 자동 생성 요청
       * @param {string} temp_id - 완료된 영상의 임시 ID
       */
      notify_completion_and_request_next: async (temp_id) => {
        try {
          // 완료된 영상 정보 가져오기
          const completed_video = get().pending_videos.find(video => video.temp_id === temp_id);
          if (!completed_video) {
            throw new Error(`완료된 영상을 찾을 수 없음: ${temp_id}`);
          }
          
          console.log('백엔드에 완료 알림 전송 중...', completed_video);
          
          // 백엔드에 완료 알림
          const completion_response = await apiFetch('/api/videos/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              video_id: temp_id,
              status: 'completed',
              metadata: {
                location_id: completed_video.location_id,
                location_name: completed_video.location_name
              }
            })
          });
          
          if (!completion_response.ok) {
            throw new Error(`완료 알림 실패: ${completion_response.status}`);
          }
          
          // 마지막 요청 정보 가져오기
          const last_request_data = localStorage.getItem('last_video_request');
          if (!last_request_data) {
            console.log('마지막 요청 정보가 없어 자동 생성 건너뜀');
            return;
          }
          
          const last_request = JSON.parse(last_request_data);
          console.log('마지막 요청 정보로 다음 영상 자동 생성 중...', last_request);
          
          // 다음 영상 자동 생성 (모의 로직 - 실제로는 백엔드에서 처리)
          await get().auto_generate_next_video(last_request);
          
        } catch (error) {
          console.error('완료 알림 및 자동 생성 실패:', error);
          console.log('백엔드 미연동으로 인한 오류입니다. 모의 자동 생성 로직을 실행합니다.');
          // 백엔드 연동 실패 시 모의 로직으로 대체
          await get().mock_auto_generate_next_video();
        }
      },
      
      /**
       * 자동 영상 생성 (실제 로직)
       * @param {Object} last_request - 마지막 요청 정보
       */
      auto_generate_next_video: async (last_request) => {
        try {
          // 백엔드에 새 영상 생성 요청
          const create_response = await apiFetch('/api/videos/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location_id: last_request.location.poi_id,
              location_name: last_request.location.name,
              user_request: last_request.prompt,
              auto_generated: true
            })
          });
          
          if (!create_response.ok) {
            throw new Error(`자동 생성 요청 실패: ${create_response.status}`);
          }
          
          const result = await create_response.json();
          console.log('백엔드에서 자동 영상 생성 시작:', result);
          
        } catch (error) {
          console.error('자동 영상 생성 실패:', error);
          throw error;
        }
      },
      
      /**
       * 모의 자동 영상 생성 (테스트용)
       */
      mock_auto_generate_next_video: async () => {
        try {
          const last_request_data = localStorage.getItem('last_video_request');
          if (!last_request_data) {
            console.log('마지막 요청 정보가 없어 모의 자동 생성 건너뜀');
            return;
          }
          
          const last_request = JSON.parse(last_request_data);
          console.log('모의 자동 영상 생성 시작...', last_request);
          
          // 1초 후 새 영상 추가 (백엔드 처리 시뮬레이션)
          setTimeout(() => {
            const creation_date = new Date().toISOString().split('T')[0];
            const video_data = {
              title: `${last_request.location.name} AI 영상 (자동생성)`,
              location_id: last_request.location.poi_id,
              location_name: last_request.location.name,
              image_url: last_request.image_url || null, // base64 이미지 URL 사용
              user_request: last_request.prompt,
              auto_generated: true
            };
            
            get().add_pending_video(video_data, creation_date);
            console.log('모의 자동 영상 생성 완료');
          }, 1000);
          
        } catch (error) {
          console.error('모의 자동 영상 생성 실패:', error);
        }
      },
      
      /**
       * 기존 temp_id를 가진 영상에 백엔드 video_id 할당
       * @param {string} temp_id - 기존 임시 ID
       * @param {string} video_id - 백엔드에서 제공한 실제 영상 ID
       */
      update_video_id: (temp_id, video_id) => {
        console.log(`영상 ID 업데이트 시작: ${temp_id} → ${video_id}`);
        
        set((state) => ({
          pending_videos: state.pending_videos.map(video => 
            video.temp_id === temp_id 
              ? { ...video, video_id: video_id }
              : video
          )
        }));
        
        // 상태 업데이트 후 폴더 목록 갱신
        get().fetch_folders();
        
        console.log(`영상 ID 업데이트 완료: ${temp_id} → ${video_id}`);
      },


      /**
       * SSE video_ready 이벤트 수신 시 실시간으로 완성된 영상 데이터를 업데이트하는 함수
       * 백엔드 실제 API 구조(/api/dashboard/result_id)에 맞춘 로직
       */
      handle_video_completion: async () => {
        // 중복 업데이트 방지
        if (get().sse_update_in_progress) {
          console.log('[SSE 업데이트] 이미 업데이트 진행 중 - 건너뜀');
          return;
        }

        set({ 
          sse_update_in_progress: true, 
          sse_update_error: null,
          last_sse_update_time: new Date().toISOString()
        });

        try {
          console.log(`[SSE 업데이트] 완성된 영상 확인 시작`);
          
          // API로 가장 최신 완성된 영상 조회 (List<JobResultDto>에서 최신 추출)
          const latestCompletedVideo = await get_latest_completed_video();
          
          if (!latestCompletedVideo) {
            console.warn(`[SSE 업데이트] 완성된 영상이 없습니다`);
            return;
          }
          
          console.log(`[SSE 업데이트] 최신 완성 영상:`, latestCompletedVideo);
          
          // 이미 처리된 영상인지 확인 (중복 처리 방지)
          const { folders } = get();
          const alreadyExists = folders.some(folder => 
            folder.items.some(item => item.resultId === latestCompletedVideo.resultId)
          );
          
          if (alreadyExists) {
            console.log(`[SSE 업데이트] 이미 처리된 영상입니다: ${latestCompletedVideo.resultId}`);
            return;
          }
          
          // pending_videos에서 PROCESSING 상태인 첫 번째 영상 찾기
          const { pending_videos } = get();
          const processingVideo = pending_videos.find(video => video.status === 'PROCESSING');
          
          if (processingVideo) {
            console.log(`[SSE 업데이트] PROCESSING 영상을 완성 영상으로 교체: ${processingVideo.temp_id}`);
            
            // pending_videos에서 해당 영상 제거
            set((state) => ({
              pending_videos: state.pending_videos.filter(video => video.temp_id !== processingVideo.temp_id)
            }));
            
            // JobResultDto 구조를 UI 표시용 객체로 변환
            const creationDate = latestCompletedVideo.createdAt ? 
              new Date(latestCompletedVideo.createdAt).toISOString().split('T')[0] : 
              new Date().toISOString().split('T')[0];
            
            // 백엔드 JobResultDto 기반 완성된 영상 객체 생성
            const completedVideo = {
              id: latestCompletedVideo.resultId,
              video_id: latestCompletedVideo.resultId,
              resultId: latestCompletedVideo.resultId,
              title: processingVideo.title || '완성된 AI 영상', // 원래 제목 유지
              status: 'completed',
              creation_date: creationDate,
              createdAt: latestCompletedVideo.createdAt,
              completion_time: new Date().toISOString(),
              original_temp_id: processingVideo.temp_id,
              // 원래 영상 정보 유지
              location_name: processingVideo.location_name,
              location_id: processingVideo.location_id,
              image_url: processingVideo.image_url,
              user_request: processingVideo.user_request
            };
            
            // 해당 날짜 폴더에 영상 추가 또는 새 폴더 생성
            get().add_completed_video_to_folder(completedVideo, creationDate);
            
            console.log(`[SSE 업데이트] 영상 완성 처리 완료: ${processingVideo.temp_id} → ${latestCompletedVideo.resultId}`);
          } else {
            console.warn(`[SSE 업데이트] PROCESSING 상태인 영상을 찾을 수 없습니다 - 전체 폴더 갱신`);
            
            // PROCESSING 영상이 없는 경우 전체 폴더 목록 갱신
            get().fetch_folders();
          }
          
        } catch (error) {
          console.error(`[SSE 업데이트] 완성된 영상 처리 실패:`, error);
          
          set({ sse_update_error: error.message });
          
          // 실패 시 전체 폴더 목록 갱신
          get().fetch_folders();
        } finally {
          set({ sse_update_in_progress: false });
        }
      },

      /**
       * 폴백 메커니즘: SSE 이벤트가 누락되었을 때 수동으로 완성된 영상 확인
       */
      check_for_missed_completions: async () => {
        const { pending_videos, last_sse_update_time } = get();
        const processingVideos = pending_videos.filter(video => video.status === 'PROCESSING');
        
        if (processingVideos.length === 0) {
          return; // PROCESSING 영상이 없으면 체크 불필요
        }
        
        try {
          console.log('[폴백] 누락된 완성 영상 확인 중...');
          
          // 마지막 SSE 업데이트 시간 이후 완성된 영상들 찾기
          const checkAfterTime = last_sse_update_time || 
            new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5분 전
          
          const newCompletedVideos = await get_videos_completed_after(checkAfterTime);
          
          if (newCompletedVideos.length > 0) {
            console.log(`[폴백] ${newCompletedVideos.length}개의 누락된 완성 영상 발견`);
            
            // 가장 최신 완성 영상으로 업데이트
            await get().handle_video_completion();
          }
          
        } catch (error) {
          console.error('[폴백] 누락된 완성 영상 확인 실패:', error);
        }
      },

      /**
       * 완성된 영상을 해당 날짜 폴더에 추가하는 헬퍼 함수
       * @param {Object} completedVideo - 완성된 영상 객체  
       * @param {string} creationDate - 생성 날짜 (YYYY-MM-DD)
       */
      add_completed_video_to_folder: (completedVideo, creationDate) => {
        const { folders } = get();
        const existingFolderIndex = folders.findIndex(folder => folder.date === creationDate);
        
        if (existingFolderIndex !== -1) {
          // 기존 폴더에 추가
          const updatedFolders = [...folders];
          updatedFolders[existingFolderIndex] = {
            ...updatedFolders[existingFolderIndex],
            items: [...updatedFolders[existingFolderIndex].items, completedVideo],
            item_count: updatedFolders[existingFolderIndex].item_count + 1,
            is_pending: false // 완성된 영상이 포함되므로 pending 아님
          };
          set({ folders: updatedFolders });
        } else {
          // 새 폴더 생성
          const newFolder = {
            date: creationDate,
            display_date: new Date(creationDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            item_count: 1,
            items: [completedVideo],
            is_pending: false
          };
          
          // 날짜순으로 정렬하여 적절한 위치에 삽입
          const sortedFolders = [...folders, newFolder].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          
          set({ folders: sortedFolders });
        }
      },

      /**
       * 영상 선택 함수
       * @param {Object} video - 선택할 영상 객체
       */
      select_video: (video) => {
        const video_id = video.video_id || video.temp_id || video.id;
        const current_selected = get().selected_video_id;
        
        // 이미 선택된 영상을 다시 클릭하면 선택 해제
        if (current_selected === video_id) {
          set({
            selected_video_id: null,
            selected_video_data: null
          });
          console.log(`영상 선택 해제: ${video_id}`);
        } else {
          // 새로운 영상 선택
          set({
            selected_video_id: video_id,
            selected_video_data: video
          });
          console.log(`영상 선택: ${video_id}`, video);
        }
      },

      /**
       * 영상 선택 해제 함수
       */
      clear_selection: () => {
        set({
          selected_video_id: null,
          selected_video_data: null
        });
        console.log('영상 선택 해제됨');
      },

    }),
    {
      name: 'content-launch-storage',
      partialize: (state) => ({ 
        pending_videos: state.pending_videos
        // SSE 관련 상태는 localStorage에 저장하지 않음 (휘발성 상태)
      })
    }
  )
);