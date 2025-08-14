import { useEffect } from 'react';
import { usePageStore } from '../stores/page_store.js';

/**
 * 다크모드 상태 관리 및 DOM 적용 커스텀 훅
 * @returns {object} - { is_dark_mode, set_is_dark_mode }
 */
export function use_dark_mode() {
  const { isDarkMode: is_dark_mode, setIsDarkMode: set_is_dark_mode } = usePageStore();

  // localStorage에서 다크모드 설정 로드
  useEffect(() => {
    const saved_dark_mode = localStorage.getItem('contentboost-dark-mode');
    
    if (saved_dark_mode !== null) {
      set_is_dark_mode(JSON.parse(saved_dark_mode));
    }
  }, [set_is_dark_mode]);

  // 다크모드 상태에 따라 DOM 클래스 및 localStorage 업데이트
  useEffect(() => {
    const root = document.documentElement;
    if (is_dark_mode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('contentboost-dark-mode', JSON.stringify(is_dark_mode));
  }, [is_dark_mode]);

  return {
    is_dark_mode,
    set_is_dark_mode
  };
}