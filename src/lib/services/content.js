import { apiFetch } from '../api.js';

export async function fetchMyContents() {
  const res = await apiFetch('/api/contents/mine');
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized'); // 리프레시 실패 케이스
    throw new Error('Failed');
  }
  return res.json();
}