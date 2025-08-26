import { create } from 'zustand';

export const usePageStore = create((set, get) => ({
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),
  isDarkMode: false,
  setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
  language: 'ko',
  setLanguage: (lang) => set({ language: lang }),
  
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

  // ▼▼▼▼▼ 블러 효과 관리 상태 추가 ▼▼▼▼▼
  blurIntensity: (() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('contentboost-blur-intensity') || 'auto';
    }
    return 'auto';
  })(),
  screenSize: 'desktop',
  isLargeScreen: false,
  performanceMode: (() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('contentboost-performance-mode') || 'false');
    }
    return false;
  })(),

  // 블러 강도 설정
  setBlurIntensity: (intensity) => {
    set({ blurIntensity: intensity });
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentboost-blur-intensity', intensity);
    }
  },

  // 화면 크기 설정
  setScreenSize: (size) => {
    const isLarge = size === 'desktop' && window.innerWidth >= 1280;
    set({ screenSize: size, isLargeScreen: isLarge });
  },

  // 성능 모드 토글
  setPerformanceMode: (enabled) => {
    set({ performanceMode: enabled });
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentboost-performance-mode', JSON.stringify(enabled));
    }
  },

  // 블러 클래스 생성 헬퍼 함수
  getBlurClass: (baseIntensity = 'md') => {
    const state = get();
    
    // 성능 모드가 활성화된 경우 최소한의 블러만 적용
    if (state.performanceMode) {
      return 'backdrop-blur-sm';
    }

    // 블러 매핑 테이블
    const blurMapping = {
      low: {
        xs: 'backdrop-blur-none',
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-sm',
        lg: 'backdrop-blur-md',
        xl: 'backdrop-blur-md',
        '2xl': 'backdrop-blur-lg',
        '3xl': 'backdrop-blur-lg'
      },
      medium: {
        xs: 'backdrop-blur-sm',
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-md',
        xl: 'backdrop-blur-lg',
        '2xl': 'backdrop-blur-xl',
        '3xl': 'backdrop-blur-xl'
      },
      high: {
        xs: 'backdrop-blur-sm',
        sm: 'backdrop-blur-md',
        md: 'backdrop-blur-lg',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
        '2xl': 'backdrop-blur-2xl',
        '3xl': 'backdrop-blur-3xl'
      },
      auto: {
        xs: 'backdrop-blur-sm',
        sm: 'backdrop-blur-sm',
        md: state.isLargeScreen ? 'backdrop-blur-sm' : 'backdrop-blur-md',
        lg: state.isLargeScreen ? 'backdrop-blur-md' : 'backdrop-blur-lg',
        xl: state.isLargeScreen ? 'backdrop-blur-md' : 'backdrop-blur-xl',
        '2xl': state.isLargeScreen ? 'backdrop-blur-lg' : 'backdrop-blur-2xl',
        '3xl': state.isLargeScreen ? 'backdrop-blur-xl' : 'backdrop-blur-3xl'
      }
    };

    const mapping = blurMapping[state.blurIntensity] || blurMapping.auto;
    return mapping[baseIntensity] || mapping.md;
  },
  // ▲▲▲▲▲ 블러 효과 관리 상태 끝 ▲▲▲▲▲
}));
