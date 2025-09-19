import { useEffect, useState, useCallback } from 'react';
import { getRedditChannelInfo } from '@/common/api/api';
import { useRedditStore } from '@/domain/reddit/logic/store';
import { usePlatformStore } from '@/domain/platform/logic/store';

export const useRedditChannelInfo = () => {
  const { setChannelInfo } = useRedditStore();
  const { platforms } = usePlatformStore();
  const [loading, setLoading] = useState(false);

  // 채널 정보 가져오기
  const fetchChannelInfo = useCallback(async () => {
    if (platforms.reddit.connected) {
      setLoading(true);
      try {
        const channelInfo = await getRedditChannelInfo();
        if (channelInfo) {
          setChannelInfo(channelInfo);
        } else {
          // 채널 정보가 없으면 초기화
          setChannelInfo({ channelId: null, channelTitle: null });
        }
      } catch (error) {
        setChannelInfo({ channelId: null, channelTitle: null });
      } finally {
        setLoading(false);
      }
    } else {
      // 연결이 끊긴 경우 정보 초기화
      localStorage.removeItem('channelId');
      setChannelInfo({ channelId: null, channelTitle: null });
    }
  }, [platforms.reddit.connected, setChannelInfo]);

  // 최초 실행 + 플랫폼 상태 변화 시 재실행
  useEffect(() => {
    fetchChannelInfo();
  }, [fetchChannelInfo]);

  // refetch 노출
  return { loading, refetch: fetchChannelInfo };
};
