import {
  setAccessToken,
  clearAccessToken,
  getAccessToken
} from '@/common/api/token';
import { refreshAccessToken } from '@/common/api/api'; // Import the new refreshAccessToken from api.js

// export async function tryRefreshOnBoot() {
//   const autoLoginEnabled = getRememberMe();
//   if (!autoLoginEnabled && !getSessionLoggedIn()) return false; // 자동 로그인 비활성화 또는 세션 로그인 아님
export async function tryRefreshOnBoot() {
  if (getAccessToken()) {
    
    return true; // 이미 메모리에 있으면 skip
  }
  try {
    
    await refreshAccessToken(); // api.js의 통합 갱신 함수 호출
    
    return true;
  } catch (e) {
    clearAccessToken(); // 갱신 실패 시 액세스 토큰 제거
    return false;
  }
}

export async function logoutApi() {
  try {
    // 서버에 로그아웃 요청을 보내 HttpOnly 쿠키를 삭제하도록 합니다.
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include'});
  } catch (error) {
    // 실패하더라도 클라이언트 측 토큰은 삭제합니다.
  }
  clearAccessToken();
}

export async function loginApi(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json(); // { accessToken }
  if (!data.accessToken) {
    throw new Error('Access token not found in login response'); // Changed message for clarity
  }

  setAccessToken(data.accessToken);
  // Refresh token is set as an HttpOnly cookie by the server

  return data;
}
