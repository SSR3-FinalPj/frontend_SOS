/**
 * 애플리케이션 전역 SSE 연결을 관리하는 Provider 컴포넌트
 */

import React from 'react';
import { useSSEConnection } from '../../hooks/use_sse_connection.js';
import { useAccessTokenMemory } from '../../hooks/useAccessTokenMemory.js';
import { use_content_launch } from '../../hooks/use_content_launch.jsx';

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

  // 🚀 폴백 시스템 및 개발자 도구 초기화
  React.useEffect(() => {
    if (token) {
      console.log('[🚀 SSEProvider] 토큰 확인됨 - 시스템 초기화 시작');
      
      const { 
        initialize_fallback_system, 
        test_handle_video_completion, 
        debug_store_state, 
        test_api_call,
        check_for_missed_completions
      } = use_content_launch.getState();
      
      // 폴백 시스템 활성화
      initialize_fallback_system();
      
      // 개발자 도구용 전역 함수 등록
      if (typeof window !== 'undefined') {
        window.testVideoCompletion = test_handle_video_completion;
        window.debugVideoStore = debug_store_state;
        window.testVideoAPI = test_api_call;
        window.manualFallbackCheck = check_for_missed_completions;
        
        console.log('🧪 개발자 도구 함수 등록 완료:');
        console.log('  - window.testVideoCompletion() : 수동으로 영상 완성 처리 테스트');  
        console.log('  - window.debugVideoStore() : 현재 스토어 상태 출력');
        console.log('  - window.testVideoAPI() : API 호출 테스트');
        console.log('  - window.manualFallbackCheck() : 수동 폴백 체크');
      }
    }
  }, [token]);

  // 이 컴포넌트는 UI를 렌더링하지 않고, 자식 컴포넌트만 렌더링합니다.
  return <>{children}</>;
};

export default SSEProvider;