
import { useEffect, useState, useCallback } from 'react';
import { usePlatformStore } from '../stores/platform_store';
import { getGoogleStatus, getRedditStatus } from '../lib/api';

export const usePlatformInitializer = () => {
  const { setPlatformStatus } = usePlatformStore();
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [setPlatformStatus]);

  useEffect(() => {
    initializePlatforms();
  }, [initializePlatforms]);

  return { loading };
};
