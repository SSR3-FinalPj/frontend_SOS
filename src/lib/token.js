let accessTokenInMemory = null;

const REFRESH_KEY = 'refreshToken'; // 바디 전략이라 어쩔 수 없이 저장 (XSS 대비: CSP/정화 필수)

export function setAccessToken(token) {
  accessTokenInMemory = token || null;
}
export function getAccessToken() {
  return accessTokenInMemory;
}
export function clearAccessToken() {
  accessTokenInMemory = null;
}

export function saveRefreshToken(refreshToken) {
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || null;
}
export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_KEY);
}