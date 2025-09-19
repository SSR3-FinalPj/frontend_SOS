
import { useEffect, useCallback } from 'react';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { useYouTubeStore } from '@/domain/youtube/logic/store';
import { getGoogleStatus, getRedditStatus } from '@/common/api/api';

export const usePlatformInitializer = (authStatus) => {
  const { setPlatformStatus } = usePlatformStore();
  const { setChannelInfo } = useYouTubeStore();

  const initializePlatforms = useCallback(async () => {
    try {
      const [googleStatus, redditStatus] = await Promise.all([
        getGoogleStatus(),
        getRedditStatus(),
      ]);

      // If google is not connected, immediately clear any stale channel info.
      if (!googleStatus.connected) {
        localStorage.removeItem('channelId');
        setChannelInfo({ channelId: null, channelTitle: null });
      }

      setPlatformStatus('google', googleStatus);
      setPlatformStatus('reddit', redditStatus);
    } catch (error) {
      // Also clear on error to be safe.
      localStorage.removeItem('channelId');
      setChannelInfo({ channelId: null, channelTitle: null });

      // On error, still set loading to false to unblock UI
      setPlatformStatus('google', { connected: false, linked: false, loading: false });
      setPlatformStatus('reddit', { connected: false, linked: false, loading: false });
    }
  }, [setPlatformStatus, setChannelInfo]);

  useEffect(() => {
    // 부팅이 완료되고, 인증된 상태일 때만 플랫폼 초기화를 진행합니다.
    if (authStatus.bootDone && authStatus.isAuthenticated) {
      initializePlatforms();
    } else if (authStatus.bootDone && !authStatus.isAuthenticated) {
      // 부팅은 완료되었지만 비인증 상태라면, 로딩 상태를 false로 확실히 변경해줍니다.
      setPlatformStatus('google', { connected: false, linked: false, loading: false });
      setPlatformStatus('reddit', { connected: false, linked: false, loading: false });
    }
  }, [authStatus, initializePlatforms, setPlatformStatus]);

  // This hook no longer returns a loading state, as it's now managed in the store.
};
