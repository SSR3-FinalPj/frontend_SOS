/**
 * 콘텐츠 론칭 상태 관리 커스텀 훅
 * localStorage 기반 '생성 중' 영상 관리 포함
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch, getVideoResultId } from '../lib/api.js';

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

      // 폴링 상태 관리
      is_polling: false,
      polling_interval_id: null,
      last_polling_time: null,
      polling_error_count: 0,
      
      // API 호출 중복 방지
      active_api_calls: new Set(), // 현재 진행 중인 API 호출 추적

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
        
        // 새로운 PROCESSING 영상 추가 시 폴링 자동 시작
        setTimeout(() => get().manage_polling(), 100);
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
        
        // 6. 폴링 상태 자동 관리
        setTimeout(() => get().manage_polling(), 100);
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
        
        // 4. 상태 변경 후 폴링 자동 관리
        setTimeout(() => get().manage_polling(), 100);
        
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
        
        // 상태 변경 후 폴링 자동 관리
        setTimeout(() => get().manage_polling(), 100);
        
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
       * 폴링 상태 초기화 (앱 시작 또는 리셋 시 사용)
       */
      reset_polling: () => {
        const { polling_interval_id } = get();
        
        if (polling_interval_id) {
          clearInterval(polling_interval_id);
        }
        
        set({
          is_polling: false,
          polling_interval_id: null,
          last_polling_time: null,
          polling_error_count: 0
        });
        
        console.log('[폴링] 상태 초기화 완료');
      },

      /**
       * SSE video_ready 이벤트 수신 시 영상 데이터를 사전 로딩하는 함수
       * @param {string} temp_id - 임시 ID (또는 식별자)
       */
      fetch_and_update_video_by_id: async (temp_id) => {
        try {
          console.log(`[사전로딩] 영상 데이터 조회 시작: ${temp_id}`);
          
          // API를 통해 실제 영상 데이터 조회
          const videoData = await getVideoResultId();
          console.log(`[사전로딩] API 응답:`, videoData);
          
          if (videoData?.resultId && videoData?.createdAt) {
            // pending_videos에서 해당 영상 찾아서 업데이트
            set((state) => ({
              pending_videos: state.pending_videos.map(video => {
                // temp_id 또는 video_id가 일치하는 영상 찾기
                const video_id = video.temp_id || video.video_id;
                if (video_id === temp_id) {
                  return {
                    ...video,
                    resultId: videoData.resultId,
                    createdAt: videoData.createdAt,
                    status: 'completed',
                    video_id: videoData.resultId, // 실제 영상 ID로 업데이트
                    completion_time: new Date().toISOString()
                  };
                }
                return video;
              })
            }));
            
            // 폴더 목록 갱신
            get().fetch_folders();
            
            // 상태 변경 후 폴링 자동 관리
            setTimeout(() => get().manage_polling(), 100);
            
            console.log(`[사전로딩] 영상 데이터 업데이트 완료: ${temp_id} → ${videoData.resultId}`);
          } else {
            console.warn(`[사전로딩] 응답 데이터가 부족합니다:`, videoData);
          }
          
        } catch (error) {
          console.error(`[사전로딩] 영상 데이터 조회 실패: ${temp_id}`, error);
          
          // 실패 시에도 상태는 업데이트 (사용자 경험을 위해)
          set((state) => ({
            pending_videos: state.pending_videos.map(video => {
              const video_id = video.temp_id || video.video_id;
              return video_id === temp_id 
                ? { ...video, status: 'ready', error: error.message }
                : video;
            })
          }));
          
          get().fetch_folders();
          
          // 실패 시에도 폴링 상태 관리
          setTimeout(() => get().manage_polling(), 100);
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

      /**
       * PROCESSING 상태 영상이 있는지 확인하는 함수
       * @returns {boolean} PROCESSING 영상 존재 여부
       */
      has_processing_videos: () => {
        const { pending_videos } = get();
        return pending_videos.some(video => video.status === 'PROCESSING');
      },

      /**
       * 폴링을 통한 영상 완료 체크 함수
       */
      check_video_completion: async () => {
        const api_call_key = 'check_video_completion';
        
        // 중복 API 호출 방지
        if (get().active_api_calls.has(api_call_key)) {
          console.log('[폴링] API 호출 중복 방지 - 이미 진행 중');
          return;
        }
        
        try {
          // API 호출 시작 표시
          set((state) => {
            const new_active_calls = new Set(state.active_api_calls);
            new_active_calls.add(api_call_key);
            return { active_api_calls: new_active_calls };
          });
          
          console.log('[폴링] 영상 완료 상태 체크 중...');
          
          // 현재 PROCESSING 상태인 영상들 찾기
          const { pending_videos } = get();
          const processing_videos = pending_videos.filter(video => video.status === 'PROCESSING');
          
          if (processing_videos.length === 0) {
            console.log('[폴링] PROCESSING 영상이 없어 폴링 중지');
            get().stop_polling();
            return;
          }

          // API 호출로 완료된 영상 확인
          const video_data = await getVideoResultId();
          console.log('[폴링] API 응답:', video_data);
          
          if (video_data?.resultId && video_data?.createdAt) {
            // 첫 번째 PROCESSING 영상을 완료 상태로 업데이트
            const first_processing_video = processing_videos[0];
            console.log(`[폴링] 영상 완료 감지: ${first_processing_video.temp_id} → ${video_data.resultId}`);
            
            // 즉시 사전 로딩 실행
            await get().fetch_and_update_video_by_id(first_processing_video.temp_id);
            
            // 에러 카운트 초기화
            set({ polling_error_count: 0 });
            
          } else {
            console.log('[폴링] 아직 완료되지 않음');
          }
          
          set({ last_polling_time: new Date().toISOString() });
          
        } catch (error) {
          console.error('[폴링] 영상 완료 체크 실패:', error);
          
          // 에러 카운트 증가
          const { polling_error_count } = get();
          const new_error_count = polling_error_count + 1;
          
          set({ polling_error_count: new_error_count });
          
          // 연속 5회 실패 시 폴링 중지
          if (new_error_count >= 5) {
            console.error('[폴링] 연속 5회 실패로 폴링 중지');
            get().stop_polling();
          }
        } finally {
          // API 호출 완료 표시
          set((state) => {
            const new_active_calls = new Set(state.active_api_calls);
            new_active_calls.delete(api_call_key);
            return { active_api_calls: new_active_calls };
          });
        }
      },

      /**
       * 스마트 폴링 시작 함수
       */
      start_polling: () => {
        const { is_polling, has_processing_videos } = get();
        
        // 이미 폴링 중이거나 PROCESSING 영상이 없으면 시작하지 않음
        if (is_polling || !has_processing_videos()) {
          console.log('[폴링] 시작 조건 미충족:', { is_polling, has_processing: has_processing_videos() });
          return;
        }

        console.log('[폴링] 스마트 폴링 시작 (5초 간격)');
        
        // 즉시 한 번 체크
        get().check_video_completion();
        
        // 5초마다 반복 실행
        const interval_id = setInterval(() => {
          get().check_video_completion();
        }, 5000);
        
        set({
          is_polling: true,
          polling_interval_id: interval_id,
          polling_error_count: 0,
          last_polling_time: new Date().toISOString()
        });
      },

      /**
       * 폴링 중지 함수
       */
      stop_polling: () => {
        const { polling_interval_id } = get();
        
        if (polling_interval_id) {
          clearInterval(polling_interval_id);
          console.log('[폴링] 폴링 중지됨');
        }
        
        set({
          is_polling: false,
          polling_interval_id: null
        });
      },

      /**
       * 폴링 상태 자동 관리 (PROCESSING 영상 상태에 따라)
       */
      manage_polling: () => {
        const { has_processing_videos, is_polling } = get();
        
        if (has_processing_videos() && !is_polling) {
          console.log('[폴링] PROCESSING 영상 감지 → 폴링 시작');
          get().start_polling();
        } else if (!has_processing_videos() && is_polling) {
          console.log('[폴링] PROCESSING 영상 없음 → 폴링 중지');
          get().stop_polling();
        }
      }
    }),
    {
      name: 'content-launch-storage',
      partialize: (state) => ({ 
        pending_videos: state.pending_videos 
        // 폴링 상태는 localStorage에 저장하지 않음 (휘발성 상태)
      })
    }
  )
);