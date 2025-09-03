import {
  getAccessToken, setAccessToken, clearAccessToken
} from '@/common/api/token';

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

  // Automatically set Content-Type for POST/PUT if not already set
  const method = init.method ? init.method.toUpperCase() : 'GET';
  if ((method === 'POST' || method === 'PUT') && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(input, { ...init, headers, credentials: "include" });

  // 401 또는 403 발생 → 통합 토큰 갱신 함수 호출
  if (response.status === 401 || response.status === 403) {
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

/* ------------------ Platform 및 채널 정보 조회 ------------------ */
export async function getGoogleStatus() {
  try {
    const res = await apiFetch("/api/google/status", { method: "GET" });
    if (!res.ok) {
      console.error("Failed to fetch Google status:", res.status);
      return { connected: false, linked: false };
    }
    const data = await res.json();
    return { ...data, connected: data.connected ?? data.linked ?? false };
  } catch (error) {
    console.error("Error fetching Google status:", error);
    return { connected: false, linked: false };
  }
}

export async function getRedditStatus() {
  try {
    const res = await apiFetch("/api/reddit/status", { method: "GET" });
    if (!res.ok) {
      console.error("Failed to fetch Reddit status:", res.status);
      return { connected: false };
    }
    const data = await res.json();
    return { connected: data.connected ?? data.linked ?? false };
  } catch (error) {
    console.error("Error fetching Reddit status:", error);
    return { connected: false };
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

/* ------------------ 로그아웃 ------------------ */
export async function logout() {
  try {
    const res = await apiFetch('/api/auth/logout', {
      method: 'POST',
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Logout failed: ${res.status} - ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

/* ------------------ Analytics API 연동 ------------------ */
/**
 * 유튜브 업로드 범위별 데이터 조회 (신규 API)
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @param {string} channelId - 유튜브 채널 ID
 * @returns {Promise} 총계 및 영상 목록 데이터
 */
export async function getYouTubeUploadsByRange(startDate, endDate, channelId) {
  if (!startDate || !endDate || !channelId) {
    throw new Error('startDate, endDate, and channelId are required.');
  }
  const params = new URLSearchParams({
    startDate,
    endDate,
    channelId,
  });
  const url = `/api/youtube/uploadRange?${params.toString()}`;
  
  const res = await apiFetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(`YouTube 업로드 데이터 조회 실패: ${res.status} - ${errorData.message}`);
  }
  return await res.json();
}

/**
 * 특정 영상의 트래픽 소스 요약 조회
 * @param {string} videoId - 유튜브 영상 ID
 * @returns {Promise} 트래픽 소스 데이터
 */
export async function get_traffic_source_summary(videoId) {
  if (!videoId) {
    throw new Error('Video ID가 필요합니다.');
  }

  const url = `/api/youtube/traffic-source-summary/${videoId}`;

  const res = await apiFetch(url, {
    method: 'POST'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(`트래픽 소스 조회 실패: ${res.status} - ${errorData.message}`);
  }
  
  const responseData = await res.json();
  
  return responseData;
}
/* ------------------ Reddit 대시보드 데이터 조회 ------------------ */
/**
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @param {string} [region] - 지역 필터
 * @param {string} [channelId] - Reddit 채널 ID
 * @returns {Promise} 집계 통계 및 일별 데이터
 */
export async function getRedditDashboardData({ startDate, endDate, region, channelId }) {
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required.");
  }

  const params = new URLSearchParams({ startDate, endDate });
  if (region) params.append("region", region);
  if (channelId) params.append("channel_id", channelId);

  const res = await apiFetch(`/api/dashboard/reddit/range?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Reddit 대시보드 데이터 조회 실패: ${res.status}`);
  }

  return await res.json();
}

/* ------------------ Reddit 채널 정보 조회 ------------------ */
/**
 * 현재 Reddit 채널 기본 정보를 가져옴
 * @returns {Promise<{channelId: string, channelTitle: string}>}
 */
export async function getRedditChannelInfo() {
  const res = await apiFetch("/api/reddit/channelId", { method: "GET" });

  if (!res.ok) {
    throw new Error(`Reddit 채널 정보 조회 실패: ${res.status}`);
  }

  return await res.json();
}

/* ------------------ Reddit 채널 게시글 목록 조회 ------------------ */
/**
 * @param {string} channelName - Reddit 채널 이름
 * @returns {Promise} 게시글 목록
 */
export async function getRedditChannelPosts(channelName) {
  if (!channelName) {
    throw new Error("Channel name is required.");
  }

  const res = await apiFetch(`/api/reddit/channel/${channelName}/posts`);

  if (!res.ok) {
    throw new Error(`Reddit 채널 게시글 조회 실패: ${res.status}`);
  }

  return await res.json();
}

/* ------------------ Reddit 업로드/통계 조회 ------------------ */
/**
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @param {string} channelId - Reddit 채널 ID
 * @returns {Promise} 총계 및 포스트 목록
 */
export async function getRedditUploadsByRange(startDate, endDate, channelId) {
  if (!startDate || !endDate || !channelId) {
    throw new Error("startDate, endDate, and channelId are required.");
  }

  const params = new URLSearchParams({ startDate, endDate, channelId });

  const res = await apiFetch(`/api/reddit/uploadRange?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Reddit 업로드 데이터 조회 실패: ${res.status}`);
  }

  return await res.json();
}


/* ------------------ Reddit 댓글 분석 API ------------------ */
/**
 * 특정 Reddit 게시글의 댓글 분석 결과 조회
 * @param {string} postId - Reddit 게시글 ID
 * @returns {Promise<{topComments: Array, atmosphere: string}>}
 */
export async function getRedditCommentAnalysis(postId) {
  if (!postId) {
    throw new Error("postId is required");
  }

  // ⚠️ 현재는 videoId로 보내야 함
  // TODO: 백엔드가 수정되면 { postId } 로 변경 필요
  const res = await apiFetch("/api/reddit/commentAnalystic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId: postId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "알 수 없는 오류가 발생했습니다." }));
    throw new Error(`Reddit 댓글 분석 실패: ${res.status} - ${errorData.message}`);
  }

  return await res.json();
}


/* ------------------ Reddit 특정 게시글 상세 조회 ------------------ */
/**
 * 특정 Reddit 게시글 상세 정보를 가져오는 함수
 * @param {string} postId - Reddit 게시글 ID
 * @returns {Promise<Object>} 게시글 상세 데이터
 */
export async function getRedditContentById(postId) {
  if (!postId) {
    throw new Error("postId is required.");
  }

  const res = await apiFetch(`/api/reddit/contents/${postId}`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "알 수 없는 오류가 발생했습니다." }));
    throw new Error(`Reddit 게시글 상세 조회 실패: ${res.status} - ${errorData.message}`);
  }

  return await res.json();
}




/* ------------------ 영상 데이터 조회 (SSE 사전 로딩용) ------------------ */
/**
 * 완료된 영상의 실제 데이터를 조회하는 함수
 * SSE video_ready 이벤트 수신 시 사전 로딩에 사용
 * @returns {Promise} 영상 결과 데이터 (JobResultDto 배열)
 * 
 * 응답 구조 개선 (백엔드 FixedJobResultService 적용):
 * List<JobResultDto>에서 각 항목은 jobId 필드를 포함합니다.
 * {
 *   resultId: number,
 *   jobId: number,       // ✅ YouTube 업로드에 필요한 작업 ID
 *   status: string,
 *   resultType: string,
 *   resultKey: string,
 *   promptText: string,
 *   createdAt: string
 * }
 */
export async function getVideoResultId() {
  const res = await apiFetch('/api/dashboard/result_id', {
    method: 'GET'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(`영상 데이터 조회 실패: ${res.status} - ${errorData.message}`);
  }

  return await res.json();
}

/* ------------------ 완성된 영상 결과 배열 처리 (SSE 연동용) ------------------ */
/**
 * 완성된 영상 결과 목록에서 가장 최신 영상을 찾는 함수
 * SSE video_ready 이벤트 수신 시 실시간 업데이트에 사용
 * @returns {Promise} 최신 완성 영상 데이터 또는 null
 * 
 * 예상 응답 구조 (JobResultDto):
 * {
 *   resultId: 123,
 *   jobId: 456,          // ✅ 백엔드 개선으로 추가된 필드
 *   status: "COMPLETED",
 *   resultType: "video",
 *   resultKey: "video/example_00001_.mp4",
 *   promptText: "영상 생성 요청",
 *   createdAt: "2024-01-01T12:00:00"
 * }
 */
export async function get_latest_completed_video() {
  try {
    const videoResults = await getVideoResultId(); // List<JobResultDto> 반환
    
    if (!videoResults || !Array.isArray(videoResults) || videoResults.length === 0) {
      console.log('[API] 완성된 영상 결과가 없음');
      return null;
    }

    // 가장 최신 결과를 createdAt 기준으로 찾기
    const latestVideo = videoResults.reduce((latest, current) => {
      const latestTime = new Date(latest.createdAt).getTime();
      const currentTime = new Date(current.createdAt).getTime();
      return currentTime > latestTime ? current : latest;
    });

    console.log('[API] 가장 최신 완성 영상:', latestVideo);
    return latestVideo;
    
  } catch (error) {
    console.error('[API] 최신 완성 영상 조회 실패:', error);
    throw error;
  }
}

/**
 * 특정 시간 이후에 완성된 영상들을 찾는 함수  
 * @param {string} afterTimestamp - 이 시간 이후의 영상들을 찾음 (ISO string)
 * @returns {Promise} 해당 시간 이후 완성된 영상 배열
 */
export async function get_videos_completed_after(afterTimestamp) {
  try {
    const videoResults = await getVideoResultId();
    
    if (!videoResults || !Array.isArray(videoResults) || videoResults.length === 0) {
      return [];
    }

    const afterTime = new Date(afterTimestamp).getTime();
    const newCompletedVideos = videoResults.filter(video => {
      const videoTime = new Date(video.createdAt).getTime();
      return videoTime > afterTime;
    });

    console.log(`[API] ${afterTimestamp} 이후 완성된 영상 ${newCompletedVideos.length}개 발견`);
    return newCompletedVideos;
    
  } catch (error) {
    console.error('[API] 시간 기준 영상 조회 실패:', error);
    throw error;
  }
}

/**
 * 특정 영상의 댓글 분석 결과 조회
 * @param {string} videoId - 유튜브 영상 ID
 * @returns {Promise} 댓글 분석 데이터 (top3, atmosphere)
 */
export async function getCommentAnalysis(videoId) {
  if (!videoId) {
    throw new Error('Video ID가 필요합니다.');
  }

  const url = '/api/youtube/commentAnalystic';

  const res = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(`댓글 분석 조회 실패: ${res.status} - ${errorData.message}`);
  }

  const responseData = await res.json();

  return responseData;
}

/* ------------------ 영상 스트리밍 API ------------------ */
/**
 * 비디오 스트리밍 URL을 가져오는 함수
 * @param {number} [resultId] - 영상 결과 ID (생략 시 테스트용 기본값 사용)
 * @returns {Promise} 비디오 스트리밍 URL 데이터
 */
export async function getVideoStreamUrl(resultId) {
  // 토큰 상태 사전 체크
  const token = getAccessToken();
  if (!token) {
    throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
  }

  // resultId 검증 - 하드코딩된 fallback 제거
  if (!resultId || (typeof resultId !== 'number' && typeof resultId !== 'string')) {
    throw new Error('요청에 영상 ID가 포함되지 않았습니다.');
  }

  const actualResultId = resultId;

  const res = await apiFetch('/api/videos/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resultId: actualResultId }),
  });

  if (!res.ok) {
    // 상태 코드별 구체적인 에러 메시지
    if (res.status === 401) {
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    if (res.status === 403) {
      throw new Error('해당 영상에 접근할 권한이 없습니다.');
    }
    if (res.status === 404) {
      throw new Error('요청하신 영상을 찾을 수 없습니다.');
    }
    
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(`서버 오류 (${res.status}): ${errorData.message || '비디오 스트리밍 URL 조회에 실패했습니다.'}`);
  }

  return await res.json();
}

/**
 * 비디오 다운로드 URL을 가져오는 함수
 * @param {number|string} resultId - 영상 결과 ID (필수)
 * @returns {Promise} 비디오 다운로드 URL 데이터
 */
export async function getVideoDownloadUrl(resultId) {
  // 토큰 상태 사전 체크
  const token = getAccessToken();
  if (!token) {
    throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
  }

  // resultId 검증
  if (!resultId || (typeof resultId !== 'number' && typeof resultId !== 'string')) {
    throw new Error('다운로드할 영상 ID가 필요합니다.');
  }

  const actualResultId = resultId;

  const res = await apiFetch('/api/videos/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resultId: actualResultId }),
  });

  if (!res.ok) {
    // 상태 코드별 구체적인 에러 메시지
    if (res.status === 401) {
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    if (res.status === 403) {
      throw new Error('해당 영상을 다운로드할 권한이 없습니다.');
    }
    if (res.status === 404) {
      throw new Error('다운로드하려는 영상을 찾을 수 없습니다.');
    }
    
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(`다운로드 URL 조회 실패 (${res.status}): ${errorData.message || '서버 오류가 발생했습니다.'}`);
  }

  return await res.json();
}

/* ------------------ S3 이미지 업로드 API ------------------ */
/**
 * S3 Presigned URL 요청
 * @param {string} contentType - 업로드할 파일의 Content-Type
 * @returns {Promise} { url, key, contentType } 포함된 응답 데이터
 */
export async function getS3PresignedUrl(contentType) {
  if (!contentType) {
    throw new Error('파일의 Content-Type이 필요합니다.');
  }

  const res = await apiFetch('/api/images/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType })
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Presigned URL 요청 실패: ${res.status} ${errorText}`);
  }

  return await res.json();
}

/**
 * S3에 파일 직접 업로드
 * @param {string} presignedUrl - S3 Presigned URL
 * @param {File} file - 업로드할 파일 객체
 * @param {string} contentType - 파일의 Content-Type
 * @returns {Promise} 업로드 결과
 */
export async function uploadFileToS3(presignedUrl, file, contentType) {
  if (!presignedUrl || !file || !contentType) {
    throw new Error('업로드에 필요한 매개변수가 누락되었습니다.');
  }

  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`S3 업로드 실패: ${res.status} ${errorText}`);
  }

  return { success: true, status: res.status };
}

/**
 * 백엔드에 업로드 완료 알림
 * @param {string} s3Key - S3 객체 키
 * @param {string} locationCode - 위치 코드
 * @param {string} promptText - 프롬프트 텍스트
 * @param {string} platform - 플랫폼 정보 ('YOUTUBE' 또는 'REDDIT')
 * @returns {Promise} 확인 응답 데이터
 */
export async function confirmImageUpload(s3Key, locationCode, promptText = "", platform = "YOUTUBE") {
  if (!s3Key || !locationCode) {
    throw new Error('S3 키와 위치 코드가 필요합니다.');
  }

  const res = await apiFetch('/api/images/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: s3Key,
      locationCode: locationCode,
      prompt_text: promptText,
      platform: platform // ✅ PostgreSQL NOT NULL 제약조건 해결을 위한 platform 필드 추가
    })
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`업로드 완료 알림 실패: ${res.status} ${errorText}`);
  }

  return await res.json().catch(() => ({}));
}

/**
 * S3 이미지 업로드 전체 프로세스 (통합 함수)
 * @param {File} file - 업로드할 파일
 * @param {string} locationCode - 위치 코드
 * @param {string} promptText - 프롬프트 텍스트
 * @param {string} platform - 플랫폼 정보 ('YOUTUBE' 또는 'REDDIT')
 * @returns {Promise} 전체 업로드 프로세스 결과
 */
export async function uploadImageToS3Complete(file, locationCode, promptText = "", platform = "YOUTUBE") {
  try {
    // 1단계: Presigned URL 요청
    const presignData = await getS3PresignedUrl(file.type);
    const { url, key, contentType } = presignData;

    // 2단계: S3에 파일 업로드
    await uploadFileToS3(url, file, contentType);

    // 3단계: 백엔드에 업로드 완료 알림 (PostgreSQL NOT NULL 제약조건 해결을 위한 platform 전달)
    const confirmResult = await confirmImageUpload(key, locationCode, promptText, platform);

    return {
      success: true,
      s3Key: key,
      jobId: confirmResult.jobId, // ✅ 백엔드에서 받은 jobId 추출
      confirmResult: confirmResult
    };
  } catch (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }
}

/* ------------------ YouTube 업로드 API ------------------ */
/**
 * YouTube에 비디오를 업로드하는 함수
 * @param {string} resultId - 결과 ID
 * @param {Object} videoDetails - 비디오 상세 정보
 * @param {string} videoDetails.title - 비디오 제목
 * @param {string} videoDetails.description - 비디오 설명
 * @param {string|Array} videoDetails.tags - 태그 (문자열 또는 배열)
 * @param {string} videoDetails.privacyStatus - 공개 상태 ('private', 'unlisted', 'public')
 * @param {string} videoDetails.categoryId - 카테고리 ID
 * @param {boolean} videoDetails.madeForKids - 아동용 여부
 * @returns {Promise<Object>} 업로드 결과
 */
export async function uploadToYouTube(resultId, videoDetails) {
  try {
    // 태그를 배열로 변환 (문자열인 경우 쉼표로 분리)
    let processedTags = [];
    if (videoDetails.tags) {
      if (typeof videoDetails.tags === 'string') {
        processedTags = videoDetails.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      } else if (Array.isArray(videoDetails.tags)) {
        processedTags = videoDetails.tags;
      }
    }

    // API 요청 바디 구성
    const requestBody = {
      title: videoDetails.title || '',
      description: videoDetails.description || '',
      tags: processedTags,
      privacyStatus: videoDetails.privacyStatus || 'private',
      categoryId: videoDetails.categoryId || '22', // 기본값: People & Blogs
      madeForKids: Boolean(videoDetails.madeForKids)
    };

    console.log('YouTube upload request:', {
      resultId,
      requestBody
    });

    // YouTube 업로드 API 호출
    const response = await apiFetch(`/api/youtube/upload/${resultId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube upload failed:', response.status, errorText);
      throw new Error(`YouTube upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('YouTube upload success:', result);
    
    return result;
  } catch (error) {
    console.error('YouTube upload error:', error);
    throw error;
  }
}