import { useSyncExternalStore } from 'react';
import { getAccessToken, subscribe } from '../common/api/token.js';

export function useAccessTokenMemory() {
  // 클라이언트/SSR 모두 안전: 서버 스냅샷도 getAccessToken 재사용
  return useSyncExternalStore(subscribe, getAccessToken, getAccessToken);
}