import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


import { tryRefreshOnBoot } from '@/common/lib/auth-bootstrap';
import { usePageStore } from '@/common/stores/page-store';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { usePlatformInitializer } from '@/domain/platform/logic/use-platform-initializer';
import Router from '@/Router'; 
import CookieConsentBanner from '@/common/ui/CookieConsentBanner';
import SSEProvider from '@/common/ui/SSEProvider';

export default function App() {
  const { isDarkMode, setIsDarkMode } = usePageStore();
  const { platforms } = usePlatformStore();
  usePlatformInitializer();

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

    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, [setIsDarkMode]);

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



  if (!bootDone || platforms.google.loading || platforms.reddit.loading) {
    return <div />; // 로딩 화면
  }

  return (
    <SSEProvider>
      <Router />
      <CookieConsentBanner />
    </SSEProvider>
  );
}
