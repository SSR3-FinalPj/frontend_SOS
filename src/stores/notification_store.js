/**
 * 알림 상태 관리 Zustand Store
 * 실시간 알림 데이터 및 상태를 관리
 */

import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  // 알림 목록
  notifications: [],
  
  // 읽지 않은 알림 개수
  unread_count: 0,
  
  // 웹소켓 연결 상태
  is_connected: false,
  
  // 새로운 알림 추가
  add_notification: (notification) => {
    const new_notification = {
      id: notification.id || Date.now().toString(),
      type: notification.type || 'general',
      message: notification.message,
      data: notification.data || {},
      read: false,
      timestamp: notification.timestamp || new Date().toISOString(),
    };
    
    set((state) => ({
      notifications: [new_notification, ...state.notifications],
      unread_count: state.unread_count + 1,
    }));
  },
  
  // 알림을 읽음 상태로 변경
  mark_as_read: (notification_id) => {
    set((state) => {
      const updated_notifications = state.notifications.map((notification) =>
        notification.id === notification_id
          ? { ...notification, read: true }
          : notification
      );
      
      const unread_count = updated_notifications.filter(n => !n.read).length;
      
      return {
        notifications: updated_notifications,
        unread_count,
      };
    });
  },
  
  // 모든 알림을 읽음 상태로 변경
  mark_all_as_read: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
      unread_count: 0,
    }));
  },
  
  // 특정 알림 삭제
  remove_notification: (notification_id) => {
    set((state) => {
      const filtered_notifications = state.notifications.filter(
        (notification) => notification.id !== notification_id
      );
      
      const unread_count = filtered_notifications.filter(n => !n.read).length;
      
      return {
        notifications: filtered_notifications,
        unread_count,
      };
    });
  },
  
  // 모든 알림 삭제
  clear_all_notifications: () => {
    set({
      notifications: [],
      unread_count: 0,
    });
  },
  
  // 웹소켓 연결 상태 업데이트
  set_connection_status: (is_connected) => {
    set({ is_connected });
  },
  
  // 영상 제작 완료 알림 처리
  handle_video_completed: (video_data) => {
    get().add_notification({
      type: 'video_completed',
      message: `영상 제작이 완료되었습니다: ${video_data.title || '새 영상'}`,
      data: video_data,
    });
  },
  
  // 영상 리스트 업데이트 알림 처리
  handle_video_list_updated: (list_data) => {
    get().add_notification({
      type: 'video_list_updated',
      message: '영상 리스트가 업데이트되었습니다.',
      data: list_data,
    });
  },
  
  // SSE 전용 알림 추가 메서드
  add_sse_notification: (sse_data) => {
    const new_notification = {
      id: Date.now().toString(),
      type: sse_data.type || 'sse_notification',
      message: sse_data.message,
      data: sse_data.data || {},
      read: false,
      timestamp: sse_data.timestamp || new Date().toISOString(),
    };
    
    set((state) => ({
      notifications: [new_notification, ...state.notifications],
      unread_count: state.unread_count + 1,
    }));
  },
  
  // SSE 영상 생성 완료 전용 처리
  handle_sse_video_completed: (message, timestamp) => {
    get().add_sse_notification({
      type: 'video_completed_sse',
      message: message,
      timestamp: timestamp,
      data: { source: 'sse' },
    });
  },
}));