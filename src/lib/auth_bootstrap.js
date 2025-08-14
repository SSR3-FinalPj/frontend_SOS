import { getRefreshToken, setAccessToken, clearAccessToken, clearRefreshToken, saveRefreshToken, getRememberMe, getSessionLoggedIn } from './token.js';

export async function tryRefreshOnBoot() {
  const autoLoginEnabled = localStorage.getItem('autoLoginEnabled') === 'true';
  if (!autoLoginEnabled) return false; // 자동 로그인 비활성화
  
  if (!getSessionLoggedIn() && !getRememberMe()) return false;    // 세션 로그인 상태가 아니고 자동 로그인도 비활성화된 경우
  const rt = getRefreshToken();
  if (!rt) return false;


  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt })
    });

    // 리프레시 실패 시 false 반환
    if (!res.ok) throw new Error('boot refresh failed');

    const { accessToken, refreshToken } = await res.json();

    setAccessToken(accessToken);
    if (refreshToken) saveRefreshToken(refreshToken);
    return true; // 로그인 유지 OK
  } catch (err) {
    clearAccessToken();
    clearRefreshToken();
    return false; // 로그인 만료
  }
}