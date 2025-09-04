
import { useEffect, useCallback } from 'react';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { useYouTubeStore } from '@/domain/youtube/logic/store';
import { getGoogleStatus, getRedditStatus } from '@/common/api/api';

export const usePlatformInitializer = () => {
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
      console.error("Error initializing platforms:", error);
      
      // Also clear on error to be safe.
      localStorage.removeItem('channelId');
      setChannelInfo({ channelId: null, channelTitle: null });

      // On error, still set loading to false to unblock UI
      setPlatformStatus('google', { connected: false, linked: false, loading: false });
      setPlatformStatus('reddit', { connected: false, linked: false, loading: false });
    }
  }, [setPlatformStatus, setChannelInfo]);

  useEffect(() => {
    initializePlatforms();
  }, [initializePlatforms]);

  // This hook no longer returns a loading state, as it's now managed in the store.
};
