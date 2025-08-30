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
  useSSEConnection({
    token,
    enabled: !!token,
    baseUrl: '', // 현재 도메인 사용
    paramName: 'sse_token'
  });

  // 🚀 폴백 시스템 및 개발자 도구 초기화
  React.useEffect(() => {
    if (token) {
      
      const { 
        initialize_fallback_system, 
        test_handle_video_completion, 
        debug_store_state, 
        test_api_call,
        check_for_missed_completions,
        debug_smart_polling,
        force_smart_polling_check,
        toggle_smart_polling,
        generate_diagnostic_report,
        simulate_video_ready_event,
        manual_refresh_videos,
        emergency_recovery,
        debug_matching_status
      } = use_content_launch.getState();
      
      // 하이브리드 폴링 시스템 활성화
      initialize_fallback_system();
      
      // 🧪 Enhanced 개발자 도구용 전역 함수 등록
      if (typeof window !== 'undefined') {
        // 기존 함수들
        window.testVideoCompletion = test_handle_video_completion;
        window.debugVideoStore = debug_store_state;
        window.testVideoAPI = test_api_call;
        window.manualFallbackCheck = check_for_missed_completions;
        
        // 새로운 Enhanced 진단 도구들
        window.debugSmartPolling = debug_smart_polling;
        window.forcePollingCheck = force_smart_polling_check;
        window.toggleSmartPolling = toggle_smart_polling;
        window.generateDiagnosticReport = generate_diagnostic_report;
        window.simulateVideoReady = simulate_video_ready_event;
        window.manualRefreshVideos = manual_refresh_videos;
        window.emergencyRecovery = emergency_recovery;
        window.debugMatchingStatus = debug_matching_status;
      }
    }
  }, [token]);

  // 이 컴포넌트는 UI를 렌더링하지 않고, 자식 컴포넌트만 렌더링합니다.
  return <>{children}</>;
};

export default SSEProvider;