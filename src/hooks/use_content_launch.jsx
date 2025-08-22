/**
 * 콘텐츠 론칭 상태 관리 커스텀 훅
 * localStorage 기반 '생성 중' 영상 관리 포함
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 콘텐츠 론칭 관련 상태와 액션을 제공하는 Zustand 스토어
 * @returns {Object} 콘텐츠 론칭 상태와 액션 함수들
 */
export const use_content_launch = create(
  persist(
    (set, get) => ({
      // 기존 상태
      open_folders: ['2024-12-13'],
      uploading_items: [],
      
      // 새로운 상태 - localStorage에 저장될 '생성 중' 영상들
      pending_videos: [],
      
      // 폴더 데이터 (API + localStorage 병합 결과)
      folders: [],

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
        set((state) => ({
          uploading_items: state.uploading_items.filter(id => id !== item_id)
        }));
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
          const api_folders = [
            {
              date: '2024-12-13',
              display_date: '2024년 12월 13일',
              item_count: 5,
              items: [
                {
                  id: 'video_1',
                  title: '서울 명동 AI 영상',
                  status: 'COMPLETED',
                  created_at: '2024-12-13T10:30:00Z'
                }
              ]
            }
          ];
          
          const pending_videos = get().pending_videos;
          
          // '생성 중' 영상들을 폴더 형태로 구성
          const pending_folder = pending_videos.length > 0 ? {
            date: 'pending',
            display_date: '생성 중인 영상',
            is_pending: true,
            item_count: pending_videos.length,
            items: pending_videos
          } : null;
          
          // '생성 중' 폴더를 최상단에 배치
          const merged_folders = pending_folder 
            ? [pending_folder, ...api_folders]
            : api_folders;
          
          set({ folders: merged_folders });
        } catch (error) {
          console.error('폴더 목록 가져오기 실패:', error);
        }
      },
      
      /**
       * 새로운 '생성 중' 영상을 추가하는 함수
       * @param {Object} video_data - 영상 데이터 객체
       */
      add_pending_video: (video_data) => {
        const new_pending_video = {
          temp_id: `temp-${Date.now()}`,
          title: video_data.title || '새로운 AI 영상',
          status: 'PROCESSING',
          start_time: new Date().toISOString(),
          image_url: video_data.image_url,
          ...video_data
        };
        
        set((state) => ({
          pending_videos: [new_pending_video, ...state.pending_videos]
        }));
        
        // 상태 업데이트 후 폴더 목록 갱신
        get().fetch_folders();
      },
      
      /**
       * 완료된 '생성 중' 영상을 제거하는 함수
       * @param {string} temp_id - 임시 ID
       */
      remove_pending_video: (temp_id) => {
        set((state) => ({
          pending_videos: state.pending_videos.filter(video => video.temp_id !== temp_id)
        }));
        
        // 상태 업데이트 후 폴더 목록 갱신
        get().fetch_folders();
      }
    }),
    {
      name: 'content-launch-storage',
      partialize: (state) => ({ pending_videos: state.pending_videos })
    }
  )
);