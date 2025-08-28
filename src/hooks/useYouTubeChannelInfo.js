import { useEffect, useState, useCallback } from 'react';
import { getYouTubeChannelId } from '../lib/api.js';
import { useYouTubeStore } from '../stores/youtube_store.js';
import { usePlatformStore } from '../stores/platform_store.js';

export const useYouTubeChannelInfo = () => {
  const { setChannelInfo } = useYouTubeStore();
  const { platforms } = usePlatformStore();
  const [loading, setLoading] = useState(false);

  // 채널 정보 가져오기
  const fetchChannelInfo = useCallback(async () => {
    if (!platforms.google.connected && !platforms.google.linked) return;

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
  }, [platforms.google.connected, platforms.google.linked, setChannelInfo]);

  // 최초 실행 + 플랫폼 상태 변화 시 재실행
  useEffect(() => {
    fetchChannelInfo();
  }, [fetchChannelInfo]);

  // refetch 노출
  return { loading, refetch: fetchChannelInfo };
};
