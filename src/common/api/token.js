let accessTokenInMemory = null;
const listeners = new Set();

export function setAccessToken(token) {
  accessTokenInMemory = token || null;
  
  listeners.forEach(l => l(accessTokenInMemory));  
}

export function getAccessToken() {
  return accessTokenInMemory;
}

export function clearAccessToken() {
  setAccessToken(null);                           
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
