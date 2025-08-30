/**
 * 웹소켓 서비스 설정
 * 웹소켓 연결을 위한 설정 및 유틸리티 함수들
 */

// 웹소켓 서버 URL (환경변수 또는 기본값 사용)
export const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080/ws';

// 웹소켓 연결 옵션 기본값
export const DEFAULT_WEBSOCKET_OPTIONS = {
  reconnect_interval: 3000, // 3초
  max_reconnect_attempts: 5,
  heartbeat_interval: 30000, // 30초
};

/**
 * 웹소켓 메시지 타입 상수
 */
export const MESSAGE_TYPES = {
  VIDEO_COMPLETED: 'video_completed',
  VIDEO_LIST_UPDATED: 'video_list_updated',
  NOTIFICATION: 'notification',
  HEARTBEAT: 'heartbeat',
  AUTH: 'auth',
};

/**
 * 웹소켓 메시지 생성 헬퍼
 * @param {string} type - 메시지 타입
 * @param {Object} payload - 메시지 데이터
 * @returns {string} JSON 문자열
 */
export const create_websocket_message = (type, payload = {}) => {
  return JSON.stringify({
    type,
    payload,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 인증 메시지 생성
 * @param {string} token - 인증 토큰
 * @returns {string} 인증 메시지
 */
export const create_auth_message = (token) => {
  return create_websocket_message(MESSAGE_TYPES.AUTH, { token });
};

/**
 * 하트비트 메시지 생성
 * @returns {string} 하트비트 메시지
 */
export const create_heartbeat_message = () => {
  return create_websocket_message(MESSAGE_TYPES.HEARTBEAT, { ping: true });
};

/**
 * 웹소켓 URL 생성 (쿼리 파라미터 포함)
 * @param {Object} params - URL 파라미터
 * @returns {string} 완성된 웹소켓 URL
 */
export const build_websocket_url = (params = {}) => {
  const url = new URL(WEBSOCKET_URL);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.toString();
};