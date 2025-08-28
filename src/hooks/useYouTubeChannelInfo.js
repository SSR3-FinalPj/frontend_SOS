
import { useEffect, useState, useCallback } from 'react';
import { getYouTubeChannelId } from '../lib/api.js';
import { useYouTubeStore } from '../stores/youtube_store.js';
import { usePlatformStore } from '../stores/platform_store.js';

export const useYouTubeChannelInfo = () => {
  const { setChannelInfo } = useYouTubeStore();
  const { platforms } = usePlatformStore();
  const [loading, setLoading] = useState(false);

  const fetchChannelInfo = useCallback(async () => {
    if (platforms.google.connected || platforms.google.linked) {
      setLoading(true);
      try {
        const channelInfo = await getYouTubeChannelId();
        if (channelInfo) {
          setChannelInfo(channelInfo);
        } else {
          setChannelInfo({ channelId: null, channelTitle: null });
        }
      } catch (error) {
        console.error("Error fetching YouTube channel info:", error);
        setChannelInfo({ channelId: null, channelTitle: null });
      } finally {
        setLoading(false);
      }
    }
  }, [platforms.google.connected, platforms.google.linked, setChannelInfo]);

  useEffect(() => {
    fetchChannelInfo();
  }, [fetchChannelInfo]);

  return { loading, refetch: fetchChannelInfo };
};
