let accessTokenInMemory = null;

export function setAccessToken(token) {
  accessTokenInMemory = token || null;
  console.log("Current Access Token:", accessTokenInMemory);
}
export function getAccessToken() {
  return accessTokenInMemory;
}
export function clearAccessToken() {
  accessTokenInMemory = null;
}