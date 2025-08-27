import {
  getAccessToken, setAccessToken, clearAccessToken
} from './token.js';

//  토큰 갱신 상태 관리 변수
let currentRefreshPromise = null; // 현재 진행 중인 토큰 갱신 Promise

/* ------------------ 토큰 갱신 ------------------ */
// 모든 토큰 갱신 요청을 이 함수로 통합하여 경쟁 상태를 방지합니다.
export async function refreshAccessToken() {
  // 이미 진행 중인 갱신 요청이 있다면 해당 Promise를 반환
  if (currentRefreshPromise) {
    //console.log(' Token refresh already in progress, returning existing promise.');
    return currentRefreshPromise;
  }

  // 새로운 갱신 Promise 생성 및 저장
  currentRefreshPromise = (async () => {
    try {
      //console.log(' Attempting to refresh token...');
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        //console.error(` Refresh failed: ${res.status} - ${errorText}`);
        clearAccessToken(); // 갱신 실패 시 액세스 토큰 제거
        throw new Error(`Refresh failed: ${res.status} - ${errorText}`);
      }

      const { accessToken } = await res.json();
      setAccessToken(accessToken);
      //console.log(' Token refreshed successfully.');
      return accessToken;
    } catch (e) {
      //console.error(' Token refresh failed:', e.message);
      clearAccessToken(); // 갱신 실패 시 액세스 토큰 제거
      throw e; // 에러를 다시 throw하여 호출자에게 전달
    } finally {
      currentRefreshPromise = null; // 갱신 완료(성공/실패) 후 Promise 초기화
    }
  })();

  return currentRefreshPromise;
}

/* ------------------ 공통 API Fetch ------------------ */
export async function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const at = getAccessToken();
  if (at) headers.set('Authorization', `Bearer ${at}`);

  let response = await fetch(input, { ...init, headers, credentials: "include" });

  // 401 발생 → 통합 토큰 갱신 함수 호출
  if (response.status === 401) {
    //console.log('401 detected, attempting token refresh...');
    try {
      const newAccessToken = await refreshAccessToken(); // 갱신된 토큰으로 재시도
      const retryHeaders = new Headers(init.headers || {});
      if (newAccessToken) {
        retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);
      }
      //console.log('Retrying API request with new token...');
      // 재시도 시에는 원래 요청의 input과 init을 그대로 사용
      response = await fetch(input, { ...init, headers: retryHeaders, credentials: 'include' });
      return response;
    } catch (refreshError) {
      //console.error('Token refresh failed in apiFetch:', refreshError.message);
      // 갱신 실패 시 원래 401 응답 반환 (로그인 페이지로 리다이렉트됨)
      return response;
    }
  }

  return response;
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

/* ------------------ 유튜브 채널 영상 목록 조회 ------------------ */
/**
 * @param {string} channelId - 조회할 유튜브 채널의 ID (필수)
 * @param {object} [options]
 * @param {'latest' | 'oldest'} [options.sortBy] - 정렬 순서
 * @param {number} [options.page] - 페이지 번호
 * @param {number} [options.limit] - 페이지당 아이템 수
 */
export async function getYouTubeVideosByChannelId(channelId, { sortBy = 'latest', page = 1, limit = 6 } = {}) {
  if (!channelId) {
    return Promise.reject(new Error('YouTube 채널 ID가 필요합니다.'));
  }
  
  const params = new URLSearchParams({ sortBy, page, limit });
  const url = `/api/youtube/channel/${channelId}/videos?${params.toString()}`;
  
  const res = await apiFetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(`YouTube 영상 목록 조회 실패: ${res.status} - ${errorData.message}`);
  }
  return await res.json();
}

/* ------------------ Google 및 YouTube 채널 정보 조회 ------------------ */
export async function getGoogleStatus() {
  try {
    const res = await apiFetch("/api/google/status", { method: "GET" });
    if (!res.ok) {
      console.error("Failed to fetch Google status:", res.status);
      return { connected: false, linked: false };
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching Google status:", error);
    return { connected: false, linked: false };
  }
}

export async function getYouTubeChannelId() {
  try {
    const res = await apiFetch("/api/youtube/channelId", { method: "GET" });
    if (!res.ok) {
      console.error("Failed to fetch YouTube channel info:", res.status);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching YouTube channel info:", error);
    return null;
  }
}

/* ------------------ Analytics API 연동 ------------------ */
/**
 * 유튜브 범위별 요약 데이터 조회
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @returns {Promise} API 응답 데이터
 */
export async function get_youtube_range_summary(startDate, endDate) {
  return getDashboardData({
    type: 'range',
    startDate,
    endDate
  });
}