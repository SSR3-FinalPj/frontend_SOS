/**
 * 애플리케이션 전역 SSE 연결을 관리하는 Provider 컴포넌트
 */

import React from 'react';
import { useSSEConnection } from '../../hooks/use_sse_connection.js';
import { useAccessTokenMemory } from '../../hooks/useAccessTokenMemory.js';
import { use_content_launch } from '../../hooks/use_content_launch.jsx';
import { getVideoResultId } from '../../lib/api.js';

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
        
        // 테스트용 함수들
        window.testGetLatestVideo = async () => {
          try {
            console.log('🧪 [테스트] 완성된 영상 목록 조회 중...');
            const videoResults = await getVideoResultId();
            
            if (!videoResults || videoResults.length === 0) {
              console.log('❌ 완성된 영상이 없습니다.');
              return null;
            }
            
            const latestVideo = videoResults[0];
            console.log('✅ 가장 최신 완성된 영상:', {
              resultId: latestVideo.resultId,
              createdAt: latestVideo.createdAt,
              총개수: videoResults.length
            });
            
            return latestVideo;
          } catch (error) {
            console.error('❌ 완성된 영상 조회 실패:', error);
            return null;
          }
        };
        
        window.testVideoPreview = async () => {
          try {
            const latestVideo = await window.testGetLatestVideo();
            if (!latestVideo) {
              console.log('❌ 테스트할 영상이 없습니다. 영상을 먼저 생성해주세요.');
              return;
            }
            
            console.log('🧪 [테스트] ContentPreviewModal 테스트 모드로 열기...');
            console.log('분석: UI의 "샘플 영상 테스트" 버튼을 클릭해주세요.');
            console.log('또는 수동으로 handle_open_test_modal() 함수를 호출해주세요.');
          } catch (error) {
            console.error('❌ 영상 미리보기 테스트 시작 실패:', error);
          }
        };
        
        console.log('🧪 Enhanced 개발자 도구 함수 등록 완료:');
        console.log('  === 기본 도구 ===');
        console.log('  - window.testVideoCompletion() : 수동으로 영상 완성 처리 테스트');  
        console.log('  - window.debugVideoStore() : 현재 스토어 상태 출력');
        console.log('  - window.testVideoAPI() : API 호출 테스트');
        console.log('  - window.manualFallbackCheck() : 수동 폴백 체크');
        console.log('  === Enhanced 진단 도구 ===');
        console.log('  - window.debugSmartPolling() : 스마트 폴링 상태 디버깅');
        console.log('  - window.forcePollingCheck() : 스마트 폴링 강제 실행');
        console.log('  - window.toggleSmartPolling() : 스마트 폴링 토글');
        console.log('  - window.generateDiagnosticReport() : 종합 진단 보고서');
        console.log('  - window.simulateVideoReady() : VIDEO_READY 이벤트 시뮬레이션');
        console.log('  - window.debugMatchingStatus() : 매칭 상태 상세 분석');
        console.log('  === 사용자 도구 ===');
        console.log('  - window.manualRefreshVideos() : 수동 새로고침');
        console.log('  - window.emergencyRecovery() : 응급 복구');
        console.log('  === 테스트 도구 ===');
        console.log('  - window.testGetLatestVideo() : 최신 완성된 영상 조회');
        console.log('  - window.testVideoPreview() : 영상 미리보기 테스트 가이드');
      }
    }
  }, [token]);

  // 이 컴포넌트는 UI를 렌더링하지 않고, 자식 컴포넌트만 렌더링합니다.
  return <>{children}</>;
};

export default SSEProvider;