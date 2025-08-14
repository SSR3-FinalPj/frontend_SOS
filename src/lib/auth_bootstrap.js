import { setAccessToken, clearAccessToken, getRememberMe, getSessionLoggedIn } from './token.js';

export async function tryRefreshOnBoot() {
  const autoLoginEnabled = getRememberMe();
  if (!autoLoginEnabled && !getSessionLoggedIn()) return false; // 자동 로그인 비활성화 또는 세션 로그인 아님

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
    });

    if (!res.ok) throw new Error('boot refresh failed');

    const { accessToken } = await res.json();

    setAccessToken(accessToken);
    return true; // 로그인 유지 OK
  } catch (err) {
    clearAccessToken();
    return false; // 로그인 만료
  }
}

export async function logoutApi() {
  try {
    // 서버에 로그아웃 요청을 보내 HttpOnly 쿠키를 삭제하도록 합니다.
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout failed:', error);
    // 실패하더라도 클라이언트 측 토큰은 삭제합니다.
  }
  clearAccessToken();
}

export async function loginApi(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json(); // { accessToken }
  if (!data.accessToken) {
    throw new Error('Token not found in response');
  }

  setAccessToken(data.accessToken);
  // Refresh token is set as an HttpOnly cookie by the server

  return data;
}