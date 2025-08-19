let accessTokenInMemory = null;

export function setAccessToken(token) {
  accessTokenInMemory = token || null;
}
export function getAccessToken() {
  return accessTokenInMemory;
}
export function clearAccessToken() {
  accessTokenInMemory = null;
}