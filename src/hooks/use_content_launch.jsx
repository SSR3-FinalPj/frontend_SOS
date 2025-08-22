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
      open_folders: [],
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
          image_url: video_data.image_url,
          creation_date: creation_date,
          ...video_data
        };
        
        // 현재 folders 상태에서 creation_date와 일치하는 폴더 찾기
        const current_folders = get().folders;
        const existing_folder_index = current_folders.findIndex(folder => folder.date === creation_date);
        
        if (existing_folder_index !== -1) {
          // 기존 폴더가 있는 경우: 해당 폴더의 items 맨 앞에 추가
          const updated_folders = [...current_folders];
          updated_folders[existing_folder_index] = {
            ...updated_folders[existing_folder_index],
            items: [new_pending_video, ...updated_folders[existing_folder_index].items],
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
        
        // pending_videos 상태도 업데이트 (localStorage 저장용)
        set((state) => ({
          pending_videos: [new_pending_video, ...state.pending_videos]
        }));
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