import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotificationStore } from '@/features/real-time-notifications/logic/notification-store';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';

/**
 * @param {Object} opts
 * @param {string} opts.token            // 필수: access token
 * @param {string} [opts.baseUrl='']     // 예: '' or 'https://api.example.com'
 * @param {boolean} [opts.enabled=true]
 * @param {string} [opts.paramName='sse_token'] // yml의 sse.auth.query-param
 */
export const useSSEConnection = ({
  token,
  baseUrl = '',
  enabled = true,
  paramName = 'sse_token',
} = {}) => {
  const [is_connected, set_is_connected] = useState(false);
  const [connection_error, set_connection_error] = useState(null);
  const [reconnect_attempts, set_reconnect_attempts] = useState(0);
  const [last_event, set_last_event] = useState(null);
  const [last_data, set_last_data] = useState(null);

  const event_source_ref = useRef(null);
  const reconnect_timeout_ref = useRef(null);
  const last_token_ref = useRef(token); // 토큰 변경 감지

  const { add_sse_notification, set_connection_status } = useNotificationStore();

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  // ✅ endpoint 계산 (자기 자신 참조 금지)
  const endpoint = (() => {
    const base = baseUrl ? baseUrl.replace(/\/$/, '') : '';
    return `${base}/api/notify/stream?${paramName}=${encodeURIComponent(token || '')}`;
  })();

  const handlePayload = useCallback((raw, eventType = 'video-ready') => {
    /* debug removed */
      raw: raw,
      eventType: eventType,
      rawLength: raw?.length
    });

    try {
      const data = JSON.parse(raw);
      
      
      const ts = data.timestamp ?? data.tm;
      const messageType = data.type; // 백엔드에서 추가된 type 필드
      
      
      if (data.message && ts) {
        
        
        // 이벤트 타입별 메시지 및 알림 타입 설정
        let displayMessage;
        let notificationType;
        
        if (eventType === 'video-ready') {
          displayMessage = '영상이 생성되었습니다!';
          notificationType = 'video_completed';
        } else if (eventType === 'youtube-upload-completed') {
          displayMessage = 'YouTube 업로드가 완료되었습니다!';
          notificationType = 'youtube_completed';
        } else if (eventType === 'reddit-upload-completed') {
          displayMessage = 'Reddit 게시가 완료되었습니다!';
          notificationType = 'reddit_completed';
        } else {
          displayMessage = data.message;
          notificationType = 'general';
        }

        // SSE 이벤트 데이터를 notification_store로 전달 (스토어 간 연동 포함)
        add_sse_notification({
          type: notificationType,
          message: displayMessage,
          timestamp: ts,
          video_id: data.video_id,
          temp_id: data.temp_id,
          videoId: data.videoId, // YouTube용
          videoUrl: data.videoUrl, // YouTube용
          postUrl: data.postUrl, // Reddit용
          data: data, // 전체 데이터도 함께 전달
        });
        
        

        // VIDEO_READY 이벤트 시 실시간 UI 업데이트 처리
        if (data.message === 'VIDEO_READY' || eventType === 'video-ready') {
          
            message: data.message,
            timestamp: data.timestamp,
            type: messageType,
            fullData: data
          });
          
          // 백엔드에서 전송하는 실제 SSE 데이터 구조: SimpleMsg(message, type, timestamp)
          
          
          try {
            const { handle_video_completion } = use_content_launch.getState();
            
            
            handle_video_completion().catch(error => {
              console.error('[SSE] ❌ 영상 완성 처리 실패:', error);
            });
          } catch (storeError) {
            console.error('[SSE] ❌ 스토어 접근 실패:', storeError);
          }
        }

        set_last_event(eventType);
        set_last_data(raw);
      } else {
        
          hasMessage: !!data.message,
          message: data.message,
          hasTimestamp: !!ts,
          timestamp: ts,
          type: messageType
        });
      }
    } catch (parseError) {
      
        error: parseError.message,
        raw: raw
      });
      // init/ping 같은 non-JSON은 무시
    }
  }, [add_sse_notification]);

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
  }, [set_connection_status]);

  const connect = useCallback(() => {
    if (!enabled) return;
    if (!token) {
      set_connection_error('토큰이 없습니다.');
      return;
    }
    if (event_source_ref.current) return;

    try {
      
      const es = new EventSource(endpoint);            // ✅ 실제 생성
      event_source_ref.current = es;

      es.onopen = () => {
        set_is_connected(true);
        set_connection_error(null);
        set_reconnect_attempts(0);
        set_connection_status(true);
        
      };

      // ping 이벤트도 상태에 반영(콘솔/화면에서 확인)
      es.addEventListener('ping', (e) => {
        
        set_last_event('ping');
        set_last_data(String(e.data));
      });

      es.addEventListener('video-ready', (event) => handlePayload(event.data, 'video-ready'));

      es.addEventListener('youtube-upload-completed', (event) => handlePayload(event.data, 'youtube-upload-completed'));

      es.addEventListener('reddit-upload-completed', (event) => handlePayload(event.data, 'reddit-upload-completed'));

      es.addEventListener('init', (e) => {
        set_last_event('init');
        set_last_data(String(e.data ?? 'ok'));
      });

      es.onmessage = (event) => handlePayload(event.data, 'message');

      es.onerror = (error) => {
        console.warn('SSE error:', error);
        set_is_connected(false);
        set_connection_status(false);
        set_connection_error('연결이 끊어졌습니다.');

        if (reconnect_attempts < MAX_RECONNECT_ATTEMPTS) {
          reconnect_timeout_ref.current = setTimeout(() => {
            set_reconnect_attempts((prev) => prev + 1);
            disconnect();
            connect();
          }, RECONNECT_DELAY);
        } else {
          set_connection_error('연결에 실패했습니다. 다시 로그인하거나 새로고침해 주세요.');
        }
      };
    } catch (e) {
      console.error('SSE create failed:', e);
      set_connection_error('연결 생성에 실패했습니다.');
    }
  }, [enabled, token, endpoint, handlePayload, reconnect_attempts, disconnect, set_connection_status]);

  const reconnect = useCallback(() => {
    set_reconnect_attempts(0);
    set_connection_error(null);
    disconnect();
    connect();
  }, [disconnect, connect]);

  // 마운트/언마운트
  useEffect(() => {
    if (enabled) connect();
    return () => disconnect();
  }, [enabled, connect, disconnect]);

  useEffect(() => {
    if (!enabled) return;
    if (last_token_ref.current !== token) {
      last_token_ref.current = token;
      if (event_source_ref.current) {
        
        reconnect();
      }
    }
  }, [token, enabled, reconnect]);

  return {
    endpoint,
    last_event,
    last_data,
    is_connected,
    connection_error,
    reconnect_attempts,
    connect,
    disconnect,
    reconnect,
  };
};
