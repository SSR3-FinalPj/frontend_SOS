import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tryRefreshOnBoot } from './src/lib/auth_bootstrap.js';
import { usePageStore } from './src/stores/page_store.js';
import Router from './src/Router.jsx';

export default function App() {
  const { isDarkMode, setIsDarkMode, language, setLanguage } = usePageStore();
  const [bootDone, setBootDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const ok = await tryRefreshOnBoot();
      
      // 현재 로그인 페이지가 아닌 경우에만 리다이렉션
      if (location.pathname !== '/login') {
        if (ok) {
          // 인증 성공: 현재 경로가 루트(/)면 대시보드로, 아니면 현재 경로 유지
          if (location.pathname === '/') {
            navigate('/dashboard');
          }
        } else if (process.env.NODE_ENV !== 'development') {
          // 인증 실패: 개발 환경이 아닐 때만 루트 페이지로 리다이렉션
          navigate('/');
        }
      }
      setBootDone(true);
    })();
  }, [navigate, location.pathname]);

  // Initialize dark mode and language from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('contentboost-dark-mode');
    const savedLanguage = localStorage.getItem('contentboost-language');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [setIsDarkMode, setLanguage]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('contentboost-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('contentboost-language', language);
  }, [language]);

  if (!bootDone) {
    return <div />;
  }

  return <Router />;
}