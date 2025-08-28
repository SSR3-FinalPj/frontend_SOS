import { create } from 'zustand';

export const usePageStore = create((set) => ({
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),
  isDarkMode: false,
  setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
  
  // ▼▼▼▼▼ 플랫폼 연동 상태 관리 코드 추가 ▼▼▼▼▼
  platformConnectionStatus: {
    youtube: true, // 예시: 유튜브는 연동된 상태로 가정
    reddit: false, // 예시: 레딧은 연동되지 않은 상태로 가정
  },
  setPlatformConnectionStatus: (platform, isConnected) => 
    set((state) => ({
      platformConnectionStatus: {
        ...state.platformConnectionStatus,
        [platform]: isConnected,
      },
    })),
  // ▲▲▲▲▲ 여기까지 추가 ▲▲▲▲▲
}));
