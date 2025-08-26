import { useEffect, useState, useCallback } from 'react';
import { getGoogleStatus, getYouTubeChannelId } from '../lib/api.js';
import { useYouTubeStore } from '../stores/youtube_store.js';

export const useAuthAndChannelInfoInitializer = () => {
  const { setChannelInfo } = useYouTubeStore();
  const [loading, setLoading] = useState(true);

  const initializeAuthAndChannelInfo = useCallback(async () => {
    try {
      // 1. Google 연결 상태 확인
      const googleStatusData = await getGoogleStatus(); // Use new function
      if (!googleStatusData.connected && !googleStatusData.linked) { // Check connected/linked status
        console.log("Google not connected. Clearing channel info.");
        setChannelInfo({ channelId: null, channelTitle: null });
        setLoading(false); // Ensure loading is false if not connected
        return;
      }

      // 2. Google이 연결되어 있다면 채널 정보 가져오기 시도
      const channelInfo = await getYouTubeChannelId(); // Use new function
      if (channelInfo) { // Check if channelInfo is not null
        setChannelInfo(channelInfo); // { channelId, channelTitle }
        console.log("Channel info initialized:", channelInfo);
      } else {
        console.error("Failed to fetch YouTube channel info or not available.");
        setChannelInfo({ channelId: null, channelTitle: null });
      }
    } catch (error) {
      console.error("Error initializing auth and channel info:", error);
      setChannelInfo({ channelId: null, channelTitle: null });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setChannelInfo]);

  useEffect(() => {
    initializeAuthAndChannelInfo();
  }, [initializeAuthAndChannelInfo]); // setChannelInfo는 안정적인 함수이므로 의존성 배열에 포함해도 무방

  return { loading, refetch: initializeAuthAndChannelInfo };
};