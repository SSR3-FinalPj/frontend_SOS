/**
 * 웹소켓 연결 관리 커스텀 훅
 * 실시간 알림을 위한 웹소켓 연결 및 메시지 처리
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNotificationStore } from '../stores/notification_store.js';

/**
 * 웹소켓 훅
 * @param {string} url - 웹소켓 서버 URL
 * @param {Object} options - 웹소켓 옵션
 * @returns {Object} 웹소켓 상태 및 함수들
 */
export const useWebSocket = (url, options = {}) => {
  const ws_ref = useRef(null);
  const reconnect_timeout_ref = useRef(null);
  const is_manually_closed_ref = useRef(false);
  
  const {
    set_connection_status,
    handle_video_completed,
    handle_video_list_updated,
    add_notification,
  } = useNotificationStore();
  
  const {
    reconnect_interval = 3000,
    max_reconnect_attempts = 5,
    on_message,
    on_open,
    on_close,
    on_error,
  } = options;
  
  const reconnect_attempts_ref = useRef(0);
  
  // 웹소켓 메시지 처리
  const handle_message = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      
      // 알림 타입별 처리
      switch (data.type) {
        case 'video_completed':
          handle_video_completed(data.payload);
          break;
        case 'video_list_updated':
          handle_video_list_updated(data.payload);
          break;
        case 'notification':
          add_notification(data.payload);
          break;
        default:
          console.log('알 수 없는 웹소켓 메시지 타입:', data.type);
      }
      
      // 사용자 정의 메시지 핸들러 실행
      if (on_message) {
        on_message(event, data);
      }
    } catch (error) {
      console.error('웹소켓 메시지 파싱 오류:', error);
    }
  }, [handle_video_completed, handle_video_list_updated, add_notification, on_message]);
  
  // 웹소켓 연결
  const connect = useCallback(() => {
    if (ws_ref.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    try {
      ws_ref.current = new WebSocket(url);
      
      ws_ref.current.onopen = (event) => {
        console.log('웹소켓 연결됨');
        set_connection_status(true);
        reconnect_attempts_ref.current = 0;
        
        if (on_open) {
          on_open(event);
        }
      };
      
      ws_ref.current.onmessage = handle_message;
      
      ws_ref.current.onclose = (event) => {
        console.log('웹소켓 연결 종료');
        set_connection_status(false);
        
        if (on_close) {
          on_close(event);
        }
        
        // 수동으로 닫지 않았고 재연결 시도가 최대 횟수를 넘지 않았을 때만 재연결
        if (!is_manually_closed_ref.current && reconnect_attempts_ref.current < max_reconnect_attempts) {
          reconnect_attempts_ref.current += 1;
          console.log(`웹소켓 재연결 시도 ${reconnect_attempts_ref.current}/${max_reconnect_attempts}`);
          
          reconnect_timeout_ref.current = setTimeout(() => {
            connect();
          }, reconnect_interval);
        }
      };
      
      ws_ref.current.onerror = (event) => {
        console.error('웹소켓 오류:', event);
        
        if (on_error) {
          on_error(event);
        }
      };
      
    } catch (error) {
      console.error('웹소켓 연결 실패:', error);
      set_connection_status(false);
    }
  }, [url, handle_message, set_connection_status, on_open, on_close, on_error, reconnect_interval, max_reconnect_attempts]);
  
  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    is_manually_closed_ref.current = true;
    
    if (reconnect_timeout_ref.current) {
      clearTimeout(reconnect_timeout_ref.current);
      reconnect_timeout_ref.current = null;
    }
    
    if (ws_ref.current) {
      ws_ref.current.close();
      ws_ref.current = null;
    }
    
    set_connection_status(false);
  }, [set_connection_status]);
  
  // 메시지 전송
  const send_message = useCallback((data) => {
    if (ws_ref.current?.readyState === WebSocket.OPEN) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        ws_ref.current.send(message);
        return true;
      } catch (error) {
        console.error('메시지 전송 실패:', error);
        return false;
      }
    } else {
      console.warn('웹소켓이 연결되지 않았습니다.');
      return false;
    }
  }, []);
  
  // 컴포넌트 마운트 시 연결
  useEffect(() => {
    connect();
    
    // 온라인/오프라인 이벤트 처리
    const handle_online = () => {
      console.log('온라인 상태 복구, 웹소켓 재연결 시도');
      is_manually_closed_ref.current = false;
      reconnect_attempts_ref.current = 0;
      connect();
    };
    
    const handle_offline = () => {
      console.log('오프라인 상태 감지');
      set_connection_status(false);
    };
    
    window.addEventListener('online', handle_online);
    window.addEventListener('offline', handle_offline);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener('online', handle_online);
      window.removeEventListener('offline', handle_offline);
      disconnect();
    };
  }, [connect, disconnect, set_connection_status]);
  
  return {
    connect,
    disconnect,
    send_message,
    is_connected: ws_ref.current?.readyState === WebSocket.OPEN,
  };
};