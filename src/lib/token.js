let accessTokenInMemory = null;

const REFRESH_KEY = 'refreshToken'; // 바디 전략이라 어쩔 수 없이 저장 (XSS 대비: CSP/정화 필수)
const REMEBER_KEY = 'autoLoginEnabled'; // 자동 로그인 여부
const SESSION_KEY = 'sessionLoggedIn'; // 로그인 상태 진행 중(필요시 사용)
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

// 자동 로그인 여부
export function setAutoLoginEnabled(enabled) {
  localStorage.setItem(REMEBER_KEY, enabled ? 'true' : 'false');
}

export function getRememberMe(){
  return localStorage.getItem(REMEBER_KEY) === 'true';
}

export function clearRememberMe() {
  localStorage.removeItem(REMEBER_KEY);
}

// 세션 로그인 상태
export function setSessionLoggedIn(on) {
  if (on) sessionStorage.setItem(SESSION_KEY, 'true');
  else sessionStorage.removeItem(SESSION_KEY);
}
export function getSessionLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function clearSessionLoggedIn() {
  sessionStorage.removeItem(SESSION_KEY);
} 