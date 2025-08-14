import {
  getAccessToken, setAccessToken, clearAccessToken
} from './token.js';

let isRefreshing = false;
let waitQueue = []; // { resolve, reject }

async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => waitQueue.push({ resolve, reject }));
  }
  isRefreshing = true;
  try {
    // 쿠키 인증 방식에서는 브라우저가 자동으로 쿠키를 전송하므로,
    // 요청 본문에 리프레시 토큰을 담을 필요가 없습니다.
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      // credentials: 'include' 옵션은 apiFetch 호출 시 자동으로 포함됩니다.
    });
    if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

    const { accessToken } = await res.json();
    setAccessToken(accessToken);
    // 새로운 리프레시 토큰은 서버에서 HttpOnly 쿠키로 설정해 줄 것이므로,
    // 클라이언트에서 별도로 저장할 필요가 없습니다.

    waitQueue.forEach(p => p.resolve(accessToken));
    waitQueue = [];
    return accessToken;
  } catch (e) {
    waitQueue.forEach(p => p.reject(e));
    waitQueue = [];
    clearAccessToken();
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