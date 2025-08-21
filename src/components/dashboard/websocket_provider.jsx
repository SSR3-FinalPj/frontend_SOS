/**
 * 웹소켓 Provider 컴포넌트
 * 대시보드에서 웹소켓 연결을 관리하는 컴포넌트
 */

import React, { useEffect } from 'react';
import { useWebSocket } from '../../hooks/use_websocket.js';
import { WEBSOCKET_URL, build_websocket_url } from '../../lib/websocket_service.js';

/**
 * WebSocket Provider 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트들
 * @returns {JSX.Element} WebSocket Provider 컴포넌트
 */
const WebSocketProvider = ({ children }) => {
  // 사용자 토큰 가져오기 (실제 구현 시 auth store에서 가져오기)
  const get_user_token = () => {
    // TODO: 실제 인증 토큰 가져오기 로직 구현
    return localStorage.getItem('auth_token') || null;
  };

  // 웹소켓 URL 생성 (사용자 토큰 포함)
  const websocket_url = build_websocket_url({
    token: get_user_token(),
    client: 'dashboard',
  });

  // 웹소켓 훅 사용
  const { connect, disconnect, is_connected } = useWebSocket(websocket_url, {
    reconnect_interval: 3000,
    max_reconnect_attempts: 5,
    
    on_open: (event) => {
      console.log('대시보드 웹소켓 연결됨');
    },
    
    on_close: (event) => {
      console.log('대시보드 웹소켓 연결 종료');
    },
    
    on_error: (error) => {
      console.error('대시보드 웹소켓 오류:', error);
    },
    
    on_message: (event, data) => {
      console.log('웹소켓 메시지 수신:', data);
    },
  });

  // 컴포넌트 마운트 시 연결, 언마운트 시 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <>
      {children}
    </>
  );
};

export default WebSocketProvider;