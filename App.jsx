import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ alias(@) 사용
import { tryRefreshOnBoot } from '@/lib/auth_bootstrap';
import { usePageStore } from '@/stores/page_store';
import { useAuthAndChannelInfoInitializer } from '@/hooks/use_auth_and_channel_info';
import Router from '@/Router';
import ConnectYouTubeButton from '@/components/ui/ConnectYouTubeButton';
import CookieConsentBanner from '@/components/common/CookieConsentBanner';

export default function App() {
  const { isDarkMode, setIsDarkMode, language, setLanguage } = usePageStore();
  const { loading: authLoading } = useAuthAndChannelInfoInitializer();
  const [bootDone, setBootDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 부트스트랩: 세션 복원
  useEffect(() => {
    (async () => {
      const ok = await tryRefreshOnBoot();

      if (ok) { // User is authenticated
        if (location.pathname === '/login') {
          navigate('/dashboard'); // If they try to go to login page, redirect to dashboard
        }
      } else { // User is not authenticated
        // If trying to access a protected page, redirect to landing page
        const protectedPaths = ['/dashboard', '/contents', '/contentlaunch', '/analytics', '/settings'];
        if (protectedPaths.some(path => location.pathname.startsWith(path))) {
          navigate('/');
        }
      }
      setBootDone(true);
    })();
  }, [navigate, location.pathname]);

  // 다크 모드/언어 초기화
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

  // 다크 모드 적용
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('contentboost-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);



  if (!bootDone || authLoading) {
    return <div />; // 로딩 화면
  }

  return (
    <>
      <Router />
      <CookieConsentBanner />
    </>
  );
}
