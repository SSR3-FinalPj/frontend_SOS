import {
  getAccessToken, setAccessToken, clearAccessToken,
  getRefreshToken, clearRefreshToken
} from './token.js';

let isRefreshing = false;
let waitQueue = []; // { resolve, reject }

async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => waitQueue.push({ resolve, reject }));
  }
  isRefreshing = true;
  try {
    const rt = getRefreshToken();
    if (!rt) throw new Error('No refresh token');

    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt })
    });
    if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

    const { accessToken, refreshToken } = await res.json();
    setAccessToken(accessToken);
    // 백엔드가 refreshToken도 로테이션해 준다면 갱신
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    waitQueue.forEach(p => p.resolve(accessToken));
    waitQueue = [];
    return accessToken;
  } catch (e) {
    waitQueue.forEach(p => p.reject(e));
    waitQueue = [];
    clearAccessToken();
    clearRefreshToken();
    throw e;
  } finally {
    isRefreshing = false;
  }
}

/**
 * 보호 API는 전부 이 함수로 호출하세요.
 * - Authorization 자동 첨부
 * - 401 발생 시 자동 리프레시 + 원요청 1회 재시도
 */
export async function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const at = getAccessToken();
  if (at) headers.set('Authorization', `Bearer ${at}`);

  let res = await fetch(input, { ...init, headers });

  if (res.status !== 401) return res;

  // 401 → 리프레시 시도 → 성공 시 1회 재시도
  try {
    const newAT = await refreshAccessToken();
    const retryHeaders = new Headers(init.headers || {});
    if (newAT) retryHeaders.set('Authorization', `Bearer ${newAT}`);
    return await fetch(input, { ...init, headers: retryHeaders });
  } catch {
    // 리프레시 실패 → 호출부에서 로그인 화면으로 유도
    return res;
  }
}