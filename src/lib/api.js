import {
  getAccessToken, setAccessToken, clearAccessToken
} from './token.js';

let isRefreshing = false;
let waitQueue = []; // { resolve, reject }

/* ------------------ 토큰 갱신 ------------------ */
async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => waitQueue.push({ resolve, reject }));
  }
  isRefreshing = true;
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

    const { accessToken } = await res.json();
    setAccessToken(accessToken);

    waitQueue.forEach(p => p.resolve(accessToken));
    waitQueue = [];
    return accessToken;
  } catch (e) {
    waitQueue.forEach(p => p.reject(e));
    waitQueue = [];
    clearAccessToken();
    throw e;
  } finally {
    isRefreshing = false;
  }
}

/* ------------------ 공통 API Fetch ------------------ */
export async function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const at = getAccessToken();
  if (at) headers.set('Authorization', `Bearer ${at}`);

  let res = await fetch(input, { ...init, headers, credentials: "include" });
  if (res.status !== 401) return res;

  // 401 발생 → 리프레시 시도 후 1회 재시도
  try {
    const newAT = await refreshAccessToken();
    const retryHeaders = new Headers(init.headers || {});
    if (newAT) retryHeaders.set('Authorization', `Bearer ${newAT}`);
    return await fetch(input, { ...init, headers: retryHeaders, credentials: "include" });
  } catch {
    return res; // 리프레시 실패 → 로그인 필요
  }
}

/* ------------------ 대시보드 데이터 조회 ------------------ */
/**
 * @param {'daily' | 'range' | 'total'} type - 조회 유형
 * @param {object} [options]
 * @param {string} [options.date] - 단일 날짜 (YYYY-MM-DD)
 * @param {string} [options.startDate] - 시작일 (YYYY-MM-DD)
 * @param {string} [options.endDate] - 종료일 (YYYY-MM-DD)
 * @param {string} [options.region] - 지역 필터
 * @param {string} [options.channelId] - 채널 ID
 */
export async function getDashboardData({ type = 'total', ...options }) {
  let url = '/api/dashboard/youtube';
  const params = new URLSearchParams();

  switch (type) {
    case 'daily':
      if (!options.date) throw new Error('Date is required for daily fetch');
      params.append('date', options.date);
      break;

    case 'range':
      if (!options.startDate || !options.endDate) {
        throw new Error('Start date and end date are required for range fetch');
      }
      url += '/range';
      params.append('startDate', options.startDate);
      params.append('endDate', options.endDate);
      break;

    case 'total':
      url += '/total';
      break;

    default:
      throw new Error(`Invalid dashboard data type: ${type}`);
  }

  if (options.region) params.append('region', options.region);
  if (options.channelId) params.append('channel_id', options.channelId);

  const res = await apiFetch(`${url}?${params.toString()}`);

  // ✅ 상태 코드별 처리
  if (res.status === 400) {
    throw new Error("잘못된 요청입니다. 날짜 형식을 확인하세요 (YYYY-MM-DD).");
  }
  if (!res.ok) {
    throw new Error(`대시보드 데이터 조회 실패: ${res.status}`);
  }

  const rawData = await res.json();

  // ✅ 타입별로 안전하게 래핑해서 반환
  switch (type) {
    case 'daily':
      return { youtube: { type: 'daily', data: rawData } }; // DashboardDayStats

    case 'range':
      return { youtube: { type: 'range', data: rawData } }; // DashboardRangeStats

    case 'total':
      return { youtube: { type: 'total', data: rawData } }; // DashboardTotalStats

    default:
      return { youtube: rawData };
  }
}
