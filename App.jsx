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

  const [bootDone, setBootDone] = useState(false);
  usePlatformInitializer(bootDone);
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
