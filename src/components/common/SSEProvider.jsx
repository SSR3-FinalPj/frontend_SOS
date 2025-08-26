/**
 * 애플리케이션 전역 SSE 연결을 관리하는 Provider 컴포넌트
 */

import React from 'react';
import { useSSEConnection } from '../../hooks/use_sse_connection.js';
import { useAccessTokenMemory } from '../../hooks/useAccessTokenMemory.js';

/**
 * SSE 연결을 전역적으로 관리하는 Provider 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @returns {JSX.Element} SSEProvider 컴포넌트
 */
const SSEProvider = ({ children }) => {
  const token = useAccessTokenMemory();

  // 토큰이 있을 때만 SSE 연결을 활성화
  const sseState = useSSEConnection({
    token,
    enabled: !!token,
    baseUrl: '', // 현재 도메인 사용
    paramName: 'sse_token'
  });

  // 개발 환경에서 SSE 상태 로깅 (선택적)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SSE State:', {
        connected: sseState.is_connected,
        endpoint: sseState.endpoint,
        last_event: sseState.last_event,
        error: sseState.connection_error
      });
    }
  }, [sseState.is_connected, sseState.last_event, sseState.connection_error]);

  // 이 컴포넌트는 UI를 렌더링하지 않고, 자식 컴포넌트만 렌더링합니다.
  return <>{children}</>;
};

export default SSEProvider;