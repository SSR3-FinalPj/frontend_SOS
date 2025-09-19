/**
 * 날짜 처리 유틸리티 함수들
 * 프로젝트 전체에서 일관된 날짜 형식을 제공하기 위한 통합 유틸리티
 */

/**
 * 날짜를 yy-mm-dd hh:mm 형식으로 포맷팅하는 함수
 * @param {string|Date} dateString - ISO 문자열 또는 Date 객체
 * @returns {string} yy-mm-dd hh:mm 형식의 날짜 문자열
 */
export function formatDateTime(dateString) {
  try {
    const date = new Date(dateString);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return formatDateTime(new Date()); // 현재 시간으로 대체
    }
    
    // yy-mm-dd hh:mm 형식으로 포맷팅
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    return formatDateTime(new Date()); // 현재 시간으로 대체
  }
}

/**
 * UTC 타임스탬프를 KST '오전/오후 HH:MM' 형식으로 변환
 * @param {string|Date} utcTimestamp - UTC 타임스탬프
 * @returns {string} KST 시간 문자열 (예: "오후 02:30")
 */
export function formatToKST(utcTimestamp) {
  try {
    const date = new Date(utcTimestamp);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return formatToKST(new Date()); // 현재 시간으로 대체
    }
    
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return formatToKST(new Date()); // 현재 시간으로 대체
  }
}

/**
 * 생성 시간을 HH:MM 형식으로 포맷팅하는 함수
 * @param {string|Date} creationTime - 생성 시간
 * @returns {string} HH:MM 형식의 시간 문자열
 */
export function formatCreationTime(creationTime) {
  try {
    if (!creationTime) return '';
    
    const date = new Date(creationTime);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return formatCreationTime(new Date()); // 현재 시간으로 대체
    }
    
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    return formatCreationTime(new Date()); // 현재 시간으로 대체
  }
}

/**
 * 날짜 객체가 유효한지 확인하는 헬퍼 함수
 * @param {string|Date} dateInput - 확인할 날짜 입력값
 * @returns {boolean} 유효한 날짜인지 여부
 */
export function isValidDate(dateInput) {
  try {
    const date = new Date(dateInput);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
}

/**
 * 현재 시간을 ISO 문자열로 반환하는 헬퍼 함수
 * @returns {string} ISO 형식의 현재 시간 문자열
 */
export function getCurrentISOString() {
  return new Date().toISOString();
}

/**
 * 두 날짜 간의 차이를 분 단위로 계산하는 함수
 * @param {string|Date} startDate - 시작 날짜
 * @param {string|Date} endDate - 종료 날짜 (기본값: 현재 시간)
 * @returns {number} 분 단위 차이
 */
export function getMinutesDifference(startDate, endDate = new Date()) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  } catch (error) {
    return 0;
  }
}

/**
 * 상대적 시간 표시 (예: "5분 전", "2시간 전")
 * @param {string|Date} dateInput - 비교할 날짜
 * @returns {string} 상대적 시간 문자열
 */
export function getRelativeTime(dateInput) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return '알 수 없음';
    }
    
    const now = new Date();
    const diffInMinutes = getMinutesDifference(date, now);
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}주 전`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}개월 전`;
    
  } catch (error) {
    return '알 수 없음';
  }
}
