const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export function saveTokens(tokens) {
  if (tokens?.accessToken) localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  if (tokens?.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || '';
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || '';
}