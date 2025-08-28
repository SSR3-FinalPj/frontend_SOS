import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotificationStore } from '../stores/notification_store.js';
import { use_content_launch } from './use_content_launch.jsx';

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
    console.log(`[SSE 디버그] handlePayload 호출됨:`, {
      raw: raw,
      eventType: eventType,
      rawLength: raw?.length
    });

    try {
      const data = JSON.parse(raw);
      console.log(`[SSE 디버그] JSON 파싱 성공:`, data);
      
      const ts = data.timestamp ?? data.tm;
      console.log(`[SSE 디버그] 타임스탬프 확인:`, { ts, hasMessage: !!data.message });
      
      if (data.message && ts) {
        console.log(`[SSE 디버그] 메시지와 타임스탬프 모두 존재 - 처리 시작`);
        
        // VIDEO_READY 메시지인 경우 토스트 알림을 위한 특별한 메시지 설정
        const displayMessage = data.message === 'VIDEO_READY' 
          ? '영상이 생성되었습니다!' 
          : data.message;

        // SSE 이벤트 데이터를 notification_store로 전달 (스토어 간 연동 포함)
        add_sse_notification({
          type: eventType === 'video-ready' ? 'video_completed' : 'video_completed',
          message: displayMessage,
          timestamp: ts,
          video_id: data.video_id,
          temp_id: data.temp_id,
          data: data, // 전체 데이터도 함께 전달
        });
        
        console.log(`[SSE 디버그] 알림 스토어에 데이터 전달 완료`);

        // VIDEO_READY 이벤트 시 실시간 UI 업데이트 처리
        if (data.message === 'VIDEO_READY') {
          console.log('[SSE] 🎯 VIDEO_READY 이벤트 감지! - 실시간 UI 업데이트 시작:', {
            message: data.message,
            timestamp: data.timestamp,
            fullData: data
          });
          
          // 백엔드에서 전송하는 실제 SSE 데이터 구조: SimpleMsg(message, timestamp)
          // resultId나 video_id는 포함되지 않으므로, 완성된 영상 목록을 조회하여 최신 영상 처리
          console.log('[SSE] 🚀 완성된 영상 목록 조회하여 최신 영상 확인 시작');
          
          try {
            const { handle_video_completion } = use_content_launch.getState();
            console.log('[SSE] 🎬 handle_video_completion 함수 호출 시작');
            
            handle_video_completion().catch(error => {
              console.error('[SSE] ❌ 영상 완성 처리 실패:', error);
            });
          } catch (storeError) {
            console.error('[SSE] ❌ 스토어 접근 실패:', storeError);
          }
        } else {
          console.log(`[SSE 디버그] VIDEO_READY가 아닌 메시지: ${data.message}`);
        }

        set_last_event(eventType);
        set_last_data(raw);
      } else {
        console.log(`[SSE 디버그] 메시지 또는 타임스탬프 누락:`, {
          hasMessage: !!data.message,
          message: data.message,
          hasTimestamp: !!ts,
          timestamp: ts
        });
      }
    } catch (parseError) {
      console.log(`[SSE 디버그] JSON 파싱 실패 (정상 - init/ping):`, {
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
      //console.log('[SSE TRY]', endpoint);              // ✅ 여기서 로그
      const es = new EventSource(endpoint);            // ✅ 실제 생성
      event_source_ref.current = es;

      es.onopen = () => {
        set_is_connected(true);
        set_connection_error(null);
        set_reconnect_attempts(0);
        set_connection_status(true);
        //console.log('SSE connected:', endpoint);
      };

      // ping 이벤트도 상태에 반영(콘솔/화면에서 확인)
      es.addEventListener('ping', (e) => {
        console.log('PING:', e.data);
        set_last_event('ping');
        set_last_data(String(e.data));
      });

      es.addEventListener('video-ready', (event) => handlePayload(event.data, 'video-ready'));

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
        console.log('[SSE] token changed → reconnect');
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