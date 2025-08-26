import { useEffect } from 'react';
import { usePageStore } from '../stores/page_store.js';

/**
 * 블러 효과 관리 커스텀 훅
 * 화면 크기를 자동으로 감지하고 블러 강도를 동적으로 조절합니다.
 * @returns {Object} 블러 관련 상태와 함수들
 */
export const useBlurEffect = () => {
  const {
    blurIntensity,
    screenSize,
    isLargeScreen,
    performanceMode,
    setScreenSize,
    setBlurIntensity,
    setPerformanceMode,
    getBlurClass
  } = usePageStore();

  // 화면 크기 감지 및 자동 조정
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      let size = 'mobile';
      
      if (width >= 1024) {
        size = 'desktop';
      } else if (width >= 768) {
        size = 'tablet';
      }
      
      setScreenSize(size);
    };

    // 초기 화면 크기 설정
    updateScreenSize();

    // 리사이즈 이벤트 리스너 등록
    const throttledResize = throttle(updateScreenSize, 250);
    window.addEventListener('resize', throttledResize);

    return () => {
      window.removeEventListener('resize', throttledResize);
    };
  }, [setScreenSize]);

  // prefers-reduced-motion 감지 및 성능 모드 자동 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (prefersReducedMotion.matches && !performanceMode) {
        setPerformanceMode(true);
      }

      const handleChange = (e) => {
        if (e.matches && !performanceMode) {
          setPerformanceMode(true);
        }
      };

      prefersReducedMotion.addEventListener('change', handleChange);
      
      return () => {
        prefersReducedMotion.removeEventListener('change', handleChange);
      };
    }
  }, [performanceMode, setPerformanceMode]);

  // 저사양 기기 감지 (옵셔널)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      // 하드웨어 동시성 수가 낮거나 메모리가 적은 경우 성능 모드 제안
      const cores = navigator.hardwareConcurrency || 4;
      const memory = navigator.deviceMemory || 4;
      
      if ((cores <= 2 || memory <= 2) && blurIntensity === 'auto') {
        // 자동으로 low 모드로 설정하지 않고, 사용자가 선택할 수 있도록 함
        console.info('저사양 기기가 감지되었습니다. 설정에서 성능 모드를 활성화하면 더 나은 경험을 제공할 수 있습니다.');
      }
    }
  }, [blurIntensity]);

  /**
   * 블러 클래스를 가져오는 함수 (store의 getBlurClass를 래핑)
   * @param {string} baseIntensity - 기본 블러 강도 (xs, sm, md, lg, xl, 2xl, 3xl)
   * @returns {string} Tailwind CSS 블러 클래스
   */
  const getBlur = (baseIntensity = 'md') => {
    return getBlurClass(baseIntensity);
  };

  /**
   * 반응형 블러 클래스를 생성하는 함수
   * 화면 크기별로 다른 블러 강도를 적용할 때 사용
   * @param {Object} responsiveConfig - 화면 크기별 설정
   * @returns {string} 반응형 Tailwind CSS 클래스
   */
  const getResponsiveBlur = (responsiveConfig = {}) => {
    const {
      mobile = 'md',
      tablet = 'lg', 
      desktop = 'xl'
    } = responsiveConfig;

    const mobileClass = getBlurClass(mobile);
    const tabletClass = getBlurClass(tablet);
    const desktopClass = getBlurClass(desktop);

    // Tailwind의 반응형 클래스 조합
    return `${mobileClass} md:${tabletClass} lg:${desktopClass}`;
  };

  return {
    // 상태
    blurIntensity,
    screenSize,
    isLargeScreen,
    performanceMode,
    
    // 함수
    setBlurIntensity,
    setPerformanceMode,
    getBlur,
    getResponsiveBlur,
    
    // 편의 함수들
    isAutoMode: blurIntensity === 'auto',
    isPerformanceMode: performanceMode,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop'
  };
};

/**
 * 쓰로틀링 유틸리티 함수
 * @param {Function} func - 실행할 함수
 * @param {number} limit - 제한 시간 (ms)
 * @returns {Function} 쓰로틀링된 함수
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export default useBlurEffect;