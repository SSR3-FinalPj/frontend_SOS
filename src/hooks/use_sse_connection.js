/**
 * SSE (Server-Sent Events) 연결 관리 커스텀 훅
 * 백엔드로부터 실시간 알림을 수신하는 기능을 제공
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotificationStore } from '../stores/notification_store.js';

/**
 * SSE 연결을 관리하는 커스텀 훅
 * @param {string} endpoint - SSE 엔드포인트 URL (기본값: '/api/sse/notifications')
 * @param {boolean} enabled - SSE 연결 활성화 여부 (기본값: true)
 * @returns {Object} SSE 연결 상태와 제어 함수들
 */
export const useSSEConnection = (endpoint = '/api/sse/notifications', enabled = true) => {
  // 연결 상태 관리
  const [is_connected, set_is_connected] = useState(false); // 테스트시에 false로 변경
  const [connection_error, set_connection_error] = useState(null);
  const [reconnect_attempts, set_reconnect_attempts] = useState(0);
  
  // EventSource 참조
  const event_source_ref = useRef(null);
  const reconnect_timeout_ref = useRef(null);
  
  // 알림 스토어 연동
  const { add_sse_notification, set_connection_status } = useNotificationStore();
  
  // 재연결 설정
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000; // 3초
  
  // SSE 연결 생성 함수
  const connect = useCallback(() => {
    if (!enabled || event_source_ref.current) {
      return;
    }
    
    try {
      const event_source = new EventSource(endpoint);
      event_source_ref.current = event_source;
      
      // 연결 성공
      event_source.onopen = () => {
        set_is_connected(true);
        set_connection_error(null);
        set_reconnect_attempts(0);
        set_connection_status(true);
        console.log('SSE 연결 성공:', endpoint);
      };
      
      // 메시지 수신 - 영상 생성 완료 이벤트
      event_source.addEventListener('video_generation_complete', (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // 백엔드에서 { message, tm } 형태로 전송
          if (data.message && data.tm) {
            add_sse_notification({
              type: 'video_completed',
              message: data.message,
              timestamp: data.tm,
            });
          }
        } catch (error) {
          console.error('SSE 메시지 파싱 오류:', error);
        }
      });
      
      // 일반 메시지 수신 (fallback)
      event_source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.message && data.tm) {
            add_sse_notification({
              type: 'general',
              message: data.message,
              timestamp: data.tm,
            });
          }
        } catch (error) {
          console.error('SSE 메시지 파싱 오류:', error);
        }
      };
      
      // 연결 오류 처리
      event_source.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        set_is_connected(false);
        set_connection_status(false);
        set_connection_error('연결이 끊어졌습니다.');
        
        // 자동 재연결 시도
        if (reconnect_attempts < MAX_RECONNECT_ATTEMPTS) {
          console.log(`SSE 재연결 시도 ${reconnect_attempts + 1}/${MAX_RECONNECT_ATTEMPTS}`);
          
          reconnect_timeout_ref.current = setTimeout(() => {
            set_reconnect_attempts(prev => prev + 1);
            disconnect();
            connect();
          }, RECONNECT_DELAY);
        } else {
          set_connection_error('연결에 실패했습니다. 페이지를 새로고침해주세요.');
        }
      };
      
    } catch (error) {
      console.error('SSE 연결 생성 실패:', error);
      set_connection_error('연결 생성에 실패했습니다.');
    }
  }, [endpoint, enabled, add_sse_notification, set_connection_status, reconnect_attempts]);
  
  // SSE 연결 해제 함수
  const disconnect = useCallback(() => {
    if (event_source_ref.current) {
      event_source_ref.current.close();
      event_source_ref.current = null;
    }
    
    if (reconnect_timeout_ref.current) {
      clearTimeout(reconnect_timeout_ref.current);
      reconnect_timeout_ref.current = null;
    }
    
    set_is_connected(false);
    set_connection_status(false);
    set_connection_error(null);
    console.log('SSE 연결 해제');
  }, [set_connection_status]);
  
  // 수동 재연결 함수
  const reconnect = useCallback(() => {
    set_reconnect_attempts(0);
    set_connection_error(null);
    disconnect();
    connect();
  }, [disconnect, connect]);
  
  // 컴포넌트 마운트 시 연결, 언마운트 시 해제
  useEffect(() => {
    if (enabled) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);
  
  return {
    // 상태
    is_connected,
    connection_error,
    reconnect_attempts,
    
    // 제어 함수
    connect,
    disconnect,
    reconnect,
  };
};