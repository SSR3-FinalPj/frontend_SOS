
import { useEffect, useCallback } from 'react';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { getGoogleStatus, getRedditStatus } from '@/common/api/api';

export const usePlatformInitializer = () => {
  const { setPlatformStatus } = usePlatformStore();

  const initializePlatforms = useCallback(async () => {
    try {
      const [googleStatus, redditStatus] = await Promise.all([
        getGoogleStatus(),
        getRedditStatus(),
      ]);
      setPlatformStatus('google', googleStatus);
      setPlatformStatus('reddit', redditStatus);
    } catch (error) {
      console.error("Error initializing platforms:", error);
      // On error, still set loading to false to unblock UI
      setPlatformStatus('google', { connected: false, linked: false, loading: false });
      setPlatformStatus('reddit', { connected: false, linked: false, loading: false });
    }
  }, [setPlatformStatus]);

  useEffect(() => {
    initializePlatforms();
  }, [initializePlatforms]);

  // This hook no longer returns a loading state, as it's now managed in the store.
};
