import { getRefreshToken, setAccessToken, clearAccessToken, clearRefreshToken } from './token.js';

export async function tryRefreshOnBoot() {
  const rt = getRefreshToken();
  if (!rt) return false;

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt })
    });
    if (!res.ok) throw new Error('boot refresh failed');

    const { accessToken, refreshToken } = await res.json();
    setAccessToken(accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    return true; // 로그인 유지 OK
  } catch {
    clearAccessToken();
    clearRefreshToken();
    return false; // 로그인 만료
  }
}