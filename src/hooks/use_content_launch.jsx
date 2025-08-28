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

      // 🔄 Enhanced Smart Polling 상태 관리
      smart_polling_active: false,        // 스마트 폴링 활성화 상태
      smart_polling_interval: 5000,       // 현재 폴링 주기 (ms) - 5초 시작
      smart_polling_attempts: 0,          // 연속 실패 횟수
      smart_polling_timeout_id: null,     // setTimeout ID

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
          
          // ✨ 수정된 부분: 'created_at' 속성을 추가합니다.
          // 폴링 시스템이 이 값을 기준으로 비디오를 찾습니다.
          created_at: new Date().toISOString(), 
          
          start_time: new Date().toISOString(),
          creationTime: new Date().toISOString(), // 'creationTime'은 오타일 수 있으나 일단 유지합니다.
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
        
        // 🚀 새로운 PROCESSING 영상 추가 시 스마트 폴링 자동 시작
        const { smart_polling_active } = get();
        if (!smart_polling_active) {
          console.log(`[🚀 Auto Start] 새 PROCESSING 영상 추가됨 - 스마트 폴링 시작: ${new_pending_video.title}`);
          get().start_smart_polling();
        } else {
          console.log(`[🚀 Auto Start] 스마트 폴링 이미 활성화 중 - 새 영상 추가: ${new_pending_video.title}`);
        }
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
        console.log(`[🎬 SSE 처리] ===== handle_video_completion 함수 시작 =====`);
        
        // 중복 업데이트 방지
        if (get().sse_update_in_progress) {
          console.log('[🎬 SSE 처리] ⏸️ 이미 업데이트 진행 중 - 건너뜀');
          return;
        }

        console.log(`[🎬 SSE 처리] 📋 상태 업데이트 시작 - 진행 상태 true로 설정`);
        set({ 
          sse_update_in_progress: true, 
          sse_update_error: null,
          last_sse_update_time: new Date().toISOString()
        });

        try {
          console.log(`[🎬 SSE 처리] 🔍 API 호출 준비 - get_latest_completed_video()`);
          
          // API로 가장 최신 완성된 영상 조회 (List<JobResultDto>에서 최신 추출)
          const latestCompletedVideo = await get_latest_completed_video();
          console.log(`[🎬 SSE 처리] 📊 API 호출 완료, 결과:`, latestCompletedVideo);
          
          if (!latestCompletedVideo) {
            console.warn(`[🎬 SSE 처리] ⚠️ 완성된 영상이 없습니다 - 함수 종료`);
            return;
          }
          
          console.log(`[🎬 SSE 처리] ✅ 최신 완성 영상 발견:`, {
            resultId: latestCompletedVideo.resultId,
            createdAt: latestCompletedVideo.createdAt,
            fullData: latestCompletedVideo
          });
          
          // 이미 처리된 영상인지 확인 (중복 처리 방지)
          const { folders } = get();
          console.log(`[🎬 SSE 처리] 🔍 중복 처리 확인 - 현재 폴더 수: ${folders.length}`);
          
          const alreadyExists = folders.some(folder => 
            folder.items.some(item => item.resultId === latestCompletedVideo.resultId)
          );
          
          if (alreadyExists) {
            console.log(`[🎬 SSE 처리] ⚠️ 이미 처리된 영상입니다: ${latestCompletedVideo.resultId} - 함수 종료`);
            return;
          }
          
          console.log(`[🎬 SSE 처리] ✅ 새로운 영상 확인됨 - 처리 계속`);
          
          // pending_videos에서 PROCESSING 상태인 첫 번째 영상 찾기
          const { pending_videos } = get();
          console.log(`[🎬 SSE 처리] 🔍 PROCESSING 영상 찾기 - 대기 중인 영상 수: ${pending_videos.length}`);
          console.log(`[🎬 SSE 처리] 📋 현재 pending_videos:`, pending_videos.map(v => ({
            temp_id: v.temp_id,
            status: v.status,
            title: v.title
          })));
          
          const processingVideo = pending_videos.find(video => video.status === 'PROCESSING');
          
          if (processingVideo) {
            console.log(`[🎬 SSE 처리] 🎯 PROCESSING 영상 발견! 교체 시작:`, {
              temp_id: processingVideo.temp_id,
              title: processingVideo.title,
              target_resultId: latestCompletedVideo.resultId
            });
            
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
            
            console.log(`[🎬 SSE 처리] 🎉 영상 완성 처리 성공!`, {
              originalTempId: processingVideo.temp_id,
              newResultId: latestCompletedVideo.resultId,
              title: processingVideo.title
            });
            
            // 완성 후 남은 PROCESSING 영상이 있는지 확인
            const remainingProcessingVideos = get().pending_videos.filter(v => v.status === 'PROCESSING');
            if (remainingProcessingVideos.length === 0) {
              console.log(`[🎬 SSE 처리] 🏁 모든 영상 완성됨 - 스마트 폴링 중지`);
              get().stop_smart_polling();
            } else {
              console.log(`[🎬 SSE 처리] 🔄 남은 PROCESSING 영상: ${remainingProcessingVideos.length}개 - 스마트 폴링 계속`);
              // 성공적인 완성 시 폴링 주기 초기화
              set({ 
                smart_polling_interval: 5000,
                smart_polling_attempts: 0 
              });
            }
          } else {
            console.warn(`[🎬 SSE 처리] ⚠️ PROCESSING 상태인 영상을 찾을 수 없습니다 - 전체 폴더 갱신`);
            
            // PROCESSING 영상이 없는 경우 전체 폴더 목록 갱신
            get().fetch_folders();
          }
          
        } catch (error) {
          console.error(`[🎬 SSE 처리] ❌ 완성된 영상 처리 실패:`, error);
          
          set({ sse_update_error: error.message });
          
          // 실패 시 전체 폴더 목록 갱신
          get().fetch_folders();
        } finally {
          console.log(`[🎬 SSE 처리] 🔄 처리 완료 - 진행 상태 false로 설정`);
          set({ sse_update_in_progress: false });
        }
      },

      /**
       * 🧪 개발자 도구에서 수동 테스트용 함수
       */
      test_handle_video_completion: async () => {
        console.log(`[🧪 테스트] 수동으로 handle_video_completion 호출`);
        await get().handle_video_completion();
      },

      /**
       * 🧪 현재 스토어 상태 출력 (디버깅용)
       */
      debug_store_state: () => {
        const state = get();
        console.log(`[🧪 디버그] 현재 스토어 상태:`, {
          pending_videos_count: state.pending_videos.length,
          pending_videos: state.pending_videos,
          folders_count: state.folders.length,
          folders: state.folders,
          sse_update_in_progress: state.sse_update_in_progress,
          sse_update_error: state.sse_update_error,
          last_sse_update_time: state.last_sse_update_time
        });
        return state;
      },

      /**
       * 🔄 Enhanced Polling: 지능형 exponential backoff 폴링 시스템 
       */
      check_for_missed_completions: async () => {
        const { pending_videos } = get();
        const processingVideos = pending_videos.filter(video => video.status === 'PROCESSING');
        
        console.log(`[🔄 Enhanced Polling] 완성 영상 확인 시작 - PROCESSING 영상 수: ${processingVideos.length}`);
        
        if (processingVideos.length === 0) {
          console.log(`[🔄 Enhanced Polling] PROCESSING 영상이 없어 스마트 폴링 비활성화`);
          get().stop_smart_polling(); // 스마트 폴링 중지
          return;
        }
        
        try {
          console.log('[🔄 Enhanced Polling] 📊 완성된 영상 목록 확인 중...');

          // 1. 유효한 타임스탬프만 안전하게 추출합니다.
          const validTimestamps = processingVideos
            .map(v => new Date(v.created_at).getTime())
            .filter(t => !isNaN(t)); // NaN 값을 제거하여 유효한 시간만 남깁니다.

          // 2. 처리할 영상이 있는지 확인합니다.
          if (validTimestamps.length === 0) {
            console.log('[🔄 Enhanced Polling] 유효한 타임스탬프를 가진 PROCESSING 영상이 없어 확인을 건너뜁니다.');
            // 처리할 영상이 없으므로, 불필요하게 폴링 주기를 늘리지 않고 여기서 실행을 중단합니다.
            return;
          }

          // 3. 유효한 타임스탬프 중에서 가장 오래된 시간을 찾습니다.
          const oldestProcessingTime = Math.min(...validTimestamps);
          const checkAfterTime = new Date(oldestProcessingTime - 60000).toISOString(); // 1분 여유

          console.log(`[🔄 Enhanced Polling] 검색 기준 시간: ${checkAfterTime}`);

          const newCompletedVideos = await get_videos_completed_after(checkAfterTime);

          if (newCompletedVideos.length > 0) {
            console.log(`[🔄 Enhanced Polling] 🎉 ${newCompletedVideos.length}개의 완성된 영상 발견!`);
            console.log(`[🔄 Enhanced Polling] 발견된 영상들:`, newCompletedVideos);

            // 완성된 영상 즉시 처리
            await get().handle_video_completion();

            // 성공 시 폴링 주기 초기화
            set({
              smart_polling_interval: 5000,
              smart_polling_attempts: 0
            });
          } else {
            console.log(`[🔄 Enhanced Polling] 아직 완성된 영상 없음 - 폴링 주기 증가`);
            // 실패 시 exponential backoff 적용
            get().increase_polling_interval();
          }
        } catch (error) {
          console.error('[🔄 Enhanced Polling] ❌ 완성 영상 확인 실패:', error);
          get().increase_polling_interval(); // 에러 시에도 주기 증가
        }
      },

      /**
       * 🚀 Smart Polling 관리: Exponential backoff 적용
       */
      start_smart_polling: () => {
        const state = get();
        if (state.smart_polling_active) {
          console.log(`[🚀 Smart Polling] 이미 활성화됨 - 건너뜀`);
          return;
        }

        console.log(`[🚀 Smart Polling] 시작 - 초기 주기: ${state.smart_polling_interval}ms`);
        set({ smart_polling_active: true });
        
        get().schedule_next_polling();
      },

      stop_smart_polling: () => {
        const { smart_polling_timeout_id } = get();
        if (smart_polling_timeout_id) {
          clearTimeout(smart_polling_timeout_id);
        }
        
        set({ 
          smart_polling_active: false,
          smart_polling_timeout_id: null,
          smart_polling_interval: 5000, // 초기값으로 리셋
          smart_polling_attempts: 0
        });
        
        console.log(`[🚀 Smart Polling] 중지됨`);
      },

      schedule_next_polling: () => {
        const { smart_polling_active, smart_polling_interval } = get();
        if (!smart_polling_active) return;

        const timeout_id = setTimeout(() => {
          console.log(`[⏰ Smart Polling] 폴링 실행 - 주기: ${smart_polling_interval}ms`);
          get().check_for_missed_completions();
          get().schedule_next_polling(); // 다음 폴링 예약
        }, smart_polling_interval);

        set({ smart_polling_timeout_id: timeout_id });
      },

      increase_polling_interval: () => {
        const { smart_polling_interval, smart_polling_attempts } = get();
        const new_attempts = smart_polling_attempts + 1;
        
        // Exponential backoff: 5s → 10s → 15s → 30s → 30s (최대)
        let new_interval = smart_polling_interval;
        if (new_attempts <= 1) new_interval = 10000; // 10초
        else if (new_attempts <= 2) new_interval = 15000; // 15초
        else new_interval = 30000; // 30초 (최대)

        set({ 
          smart_polling_interval: new_interval,
          smart_polling_attempts: new_attempts 
        });

        console.log(`[⏰ Smart Polling] 폴링 주기 증가: ${new_interval}ms (시도 횟수: ${new_attempts})`);
      },

      /**
       * 🚀 페이지 로드 시 초기 체크 및 하이브리드 폴링 시스템 활성화
       */
      initialize_fallback_system: () => {
        console.log(`[🚀 초기화] 하이브리드 폴링 시스템 활성화 시작`);
        
        // 즉시 한 번 체크하고 스마트 폴링 시작
        setTimeout(() => {
          console.log(`[🚀 초기화] 초기 완성 영상 체크 및 스마트 폴링 시작`);
          const { pending_videos } = get();
          const processingCount = pending_videos.filter(v => v.status === 'PROCESSING').length;
          
          if (processingCount > 0) {
            console.log(`[🚀 초기화] PROCESSING 영상 ${processingCount}개 감지 - 스마트 폴링 활성화`);
            get().start_smart_polling(); // 스마트 폴링 시작
          } else {
            console.log(`[🚀 초기화] PROCESSING 영상 없음 - 스마트 폴링 비활성화`);
          }
        }, 2000); // 2초 후 실행 (앱 초기화 완료 대기)
        
        // 60초마다 백업 체크 (스마트 폴링과 별개)
        const backupInterval = setInterval(() => {
          const { pending_videos, smart_polling_active } = get();
          const processingCount = pending_videos.filter(v => v.status === 'PROCESSING').length;
          
          if (processingCount > 0) {
            if (!smart_polling_active) {
              console.log(`[🔧 백업 체크] 스마트 폴링이 비활성화되어 있지만 PROCESSING 영상 발견 - 재시작`);
              get().start_smart_polling();
            } else {
              console.log(`[🔧 백업 체크] 스마트 폴링 정상 동작 중 (${processingCount}개 처리 중)`);
            }
          } else if (smart_polling_active) {
            console.log(`[🔧 백업 체크] PROCESSING 영상 없음 - 스마트 폴링 중지`);
            get().stop_smart_polling();
          }
        }, 60000); // 1분마다
        
        // 전역 접근을 위해 window에 등록
        if (typeof window !== 'undefined') {
          window.videoCompletionBackupInterval = backupInterval;
          console.log(`[🚀 초기화] 하이브리드 폴링 시스템 등록 완료`);
        }
      },

      /**
       * 🧪 개발자 도구: Enhanced Diagnostic Functions
       */
      test_api_call: async () => {
        console.log(`[🧪 API 테스트] get_latest_completed_video() 직접 호출`);
        try {
          const result = await get_latest_completed_video();
          console.log(`[🧪 API 테스트] ✅ 결과:`, result);
          return result;
        } catch (error) {
          console.error(`[🧪 API 테스트] ❌ 실패:`, error);
          throw error;
        }
      },

      /**
       * 🔍 스마트 폴링 상태 디버깅
       */
      debug_smart_polling: () => {
        const state = get();
        console.log(`[🔍 Smart Polling Debug] ===== 스마트 폴링 상태 =====`, {
          smart_polling_active: state.smart_polling_active,
          smart_polling_interval: state.smart_polling_interval,
          smart_polling_attempts: state.smart_polling_attempts,
          smart_polling_timeout_id: state.smart_polling_timeout_id,
          processing_videos_count: state.pending_videos.filter(v => v.status === 'PROCESSING').length,
          processing_videos: state.pending_videos.filter(v => v.status === 'PROCESSING').map(v => ({
            temp_id: v.temp_id,
            title: v.title,
            created_at: v.created_at
          }))
        });
        return state;
      },

      /**
       * 🎯 수동으로 스마트 폴링 강제 실행
       */
      force_smart_polling_check: async () => {
        console.log(`[🎯 Force Check] 스마트 폴링 강제 실행`);
        await get().check_for_missed_completions();
      },

      /**
       * 🔄 스마트 폴링 수동 토글
       */
      toggle_smart_polling: () => {
        const { smart_polling_active } = get();
        if (smart_polling_active) {
          console.log(`[🔄 Toggle] 스마트 폴링 중지`);
          get().stop_smart_polling();
        } else {
          console.log(`[🔄 Toggle] 스마트 폴링 시작`);
          get().start_smart_polling();
        }
      },

      /**
       * 📊 종합 진단 보고서
       */
      generate_diagnostic_report: () => {
        const state = get();
        const processingVideos = state.pending_videos.filter(v => v.status === 'PROCESSING');
        
        const report = {
          timestamp: new Date().toISOString(),
          system_status: {
            smart_polling_active: state.smart_polling_active,
            smart_polling_interval: state.smart_polling_interval,
            smart_polling_attempts: state.smart_polling_attempts,
            sse_update_in_progress: state.sse_update_in_progress,
            sse_update_error: state.sse_update_error,
            last_sse_update_time: state.last_sse_update_time
          },
          video_counts: {
            total_pending_videos: state.pending_videos.length,
            processing_videos: processingVideos.length,
            total_folders: state.folders.length,
            total_folder_items: state.folders.reduce((sum, folder) => sum + folder.item_count, 0)
          },
          processing_videos: processingVideos.map(v => ({
            temp_id: v.temp_id,
            title: v.title,
            created_at: v.created_at,
            duration_minutes: Math.round((new Date() - new Date(v.created_at)) / (1000 * 60))
          })),
          recommendations: []
        };

        // 자동 추천 생성
        if (processingVideos.length > 0 && !state.smart_polling_active) {
          report.recommendations.push("⚠️ PROCESSING 영상이 있지만 스마트 폴링이 비활성화되어 있습니다. window.toggleSmartPolling() 실행을 권장합니다.");
        }
        
        if (state.smart_polling_attempts > 5) {
          report.recommendations.push("🔄 폴링 시도 횟수가 많습니다. 백엔드 상태를 확인해보세요.");
        }
        
        if (processingVideos.length === 0 && state.smart_polling_active) {
          report.recommendations.push("✅ PROCESSING 영상이 없으므로 스마트 폴링이 자동으로 중지될 예정입니다.");
        }

        console.log(`[📊 Diagnostic Report] ===== 종합 진단 보고서 =====`, report);
        return report;
      },

      /**
       * 🧪 가짜 VIDEO_READY 이벤트 시뮬레이션 (테스트용)
       */
      simulate_video_ready_event: () => {
        console.log(`[🧪 Simulation] 가짜 VIDEO_READY 이벤트 시뮬레이션 시작`);
        try {
          get().handle_video_completion();
          console.log(`[🧪 Simulation] ✅ 시뮬레이션 완료`);
        } catch (error) {
          console.error(`[🧪 Simulation] ❌ 시뮬레이션 실패:`, error);
        }
      },

      /**
       * 🔄 수동 새로고침 - 사용자용 백업 옵션
       */
      manual_refresh_videos: async () => {
        console.log(`[🔄 Manual Refresh] 수동 새로고침 시작`);
        
        try {
          // 1. 스마트 폴링 강제 체크
          await get().force_smart_polling_check();
          
          // 2. 전체 폴더 목록 갱신 (백업용)
          await get().fetch_folders();
          
          console.log(`[🔄 Manual Refresh] ✅ 수동 새로고침 완료`);
          
          // 사용자에게 피드백 (선택적)
          return {
            success: true,
            message: "영상 목록이 새로고침되었습니다.",
            timestamp: new Date().toISOString()
          };
          
        } catch (error) {
          console.error(`[🔄 Manual Refresh] ❌ 수동 새로고침 실패:`, error);
          
          return {
            success: false,
            message: "새로고침 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            error: error.message,
            timestamp: new Date().toISOString()
          };
        }
      },

      /**
       * ⚡ 응급 복구 - 모든 시스템 재시작
       */
      emergency_recovery: async () => {
        console.log(`[⚡ Emergency] 응급 복구 시작 - 모든 시스템 재시작`);
        
        try {
          // 1. 스마트 폴링 중지
          get().stop_smart_polling();
          
          // 2. 잠깐 대기
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 3. 전체 폴더 재로드
          await get().fetch_folders();
          
          // 4. PROCESSING 영상 체크 및 스마트 폴링 재시작
          const { pending_videos } = get();
          const processingCount = pending_videos.filter(v => v.status === 'PROCESSING').length;
          
          if (processingCount > 0) {
            console.log(`[⚡ Emergency] PROCESSING 영상 ${processingCount}개 발견 - 스마트 폴링 재시작`);
            get().start_smart_polling();
          }
          
          console.log(`[⚡ Emergency] ✅ 응급 복구 완료`);
          
          return {
            success: true,
            message: "시스템이 성공적으로 복구되었습니다.",
            processing_videos_found: processingCount,
            timestamp: new Date().toISOString()
          };
          
        } catch (error) {
          console.error(`[⚡ Emergency] ❌ 응급 복구 실패:`, error);
          
          return {
            success: false,
            message: "응급 복구 중 오류가 발생했습니다.",
            error: error.message,
            timestamp: new Date().toISOString()
          };
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