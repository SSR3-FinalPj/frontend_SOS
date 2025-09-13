import { useEffect } from 'react';
import { usePageStore } from '@/common/stores/page-store';

/**
 * 다크모드 상태 관리 및 DOM 적용 커스텀 훅
 * @returns {object} - { is_dark_mode, set_is_dark_mode }
 */
export function use_dark_mode() {
  const { isDarkMode: is_dark_mode, setIsDarkMode: set_is_dark_mode } = usePageStore();

  // 다크모드 상태에 따라 DOM 클래스 적용
  useEffect(() => {
    const root = document.documentElement;
    if (is_dark_mode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [is_dark_mode]);

  return {
    is_dark_mode,
    set_is_dark_mode
  };
}