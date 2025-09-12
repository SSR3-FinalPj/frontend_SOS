/**
 * 알림 상태 관리 Zustand Store
 * 실시간 알림 데이터 및 상태를 관리하고 다른 스토어와 연동
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
  // 알림 목록
  notifications: [],
  
  // 읽지 않은 알림 개수
  unread_count: 0,
  
  // 웹소켓 연결 상태
  is_connected: false,
  
  // 새로운 알림 추가 (자동 정리 포함)
  add_notification: (notification) => {
    const timestamp = notification.timestamp || new Date().toISOString();
    
    const new_notification = {
      id: notification.id || Date.now().toString(),
      type: notification.type || 'general',
      message: notification.message,
      data: notification.data || {},
      read: false,
      timestamp: timestamp, // 원본 ISO 형식 타임스탬프 저장
      raw_timestamp: timestamp, // 호환성을 위해 보존
    };
    
    set((state) => ({
      notifications: [new_notification, ...state.notifications],
      unread_count: state.unread_count + 1,
    }));
    
    // 새 알림 추가 시 오래된 알림 자동 정리
    setTimeout(() => get().cleanup_old_notifications(), 1000);
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
      timestamp: video_data.timestamp || new Date().toISOString(),
      path: '/contentlaunch' // 클릭 시 이동할 경로 추가
    });
  },
  
  // 영상 리스트 업데이트 알림 처리
  handle_video_list_updated: (list_data) => {
    get().add_notification({
      type: 'video_list_updated',
      message: '영상 리스트가 업데이트되었습니다.',
      data: list_data,
      timestamp: list_data.timestamp || new Date().toISOString(),
    });
  },
  
  // SSE 전용 알림 추가 메서드 (다른 스토어와 연동)
  add_sse_notification: (sse_data) => {
    // 원본 ISO 형식 타임스탬프 사용
    const timestamp = sse_data.timestamp || new Date().toISOString();
    
    const new_notification = {
      id: Date.now().toString(),
      type: sse_data.type || 'sse_notification',
      message: sse_data.message,
      data: sse_data.data || {},
      read: false,
      timestamp: timestamp, // 원본 ISO 형식 타임스탬프 저장
      raw_timestamp: timestamp, // 호환성을 위해 보존
      // video_completed 타입의 알림에는 contentlaunch 페이지로 이동하는 path 추가
      ...(sse_data.type === 'video_completed' && { path: '/contentlaunch' })
    };
    
    // 일반 알림을 스토어에 추가 (드롭다운용)
    set((state) => ({
      notifications: [new_notification, ...state.notifications],
      unread_count: state.unread_count + 1,
    }));

    
    // video-ready 이벤트의 경우 use_content_launch 스토어와 연동
    if (sse_data.type === 'video_completed' || sse_data.type === 'video_ready') {
      get().handle_video_ready_event(sse_data);
    }
    
    // YouTube 업로드 완료 이벤트 처리
    if (sse_data.type === 'youtube_completed') {
      get().handle_youtube_completed_event(sse_data);
    }
    
    // Reddit 게시 완료 이벤트 처리
    if (sse_data.type === 'reddit_completed') {
      get().handle_reddit_completed_event(sse_data);
    }
  },
  
  // video-ready 이벤트 전용 처리 (use_content_launch 스토어와 연동)
  handle_video_ready_event: (sse_data) => {
    try {
      // use_content_launch 스토어를 dynamic import로 가져와서 순환 참조 방지
      import('@/features/content-management/logic/use-content-launch').then(({ use_content_launch }) => {
        // video_id가 있으면 해당 영상을 ready 상태로 전환
        if (sse_data.video_id || sse_data.data?.video_id) {
          const video_id = sse_data.video_id || sse_data.data.video_id;
          
          use_content_launch.getState().transition_to_ready(video_id);
        }
        
        // temp_id가 있는 경우에도 처리
        if (sse_data.temp_id || sse_data.data?.temp_id) {
          const temp_id = sse_data.temp_id || sse_data.data.temp_id;
          
          use_content_launch.getState().transition_to_ready(temp_id);
        }
        
        
      }).catch(error => {
        console.error('use_content_launch 스토어 연동 실패:', error);
      });
    } catch (error) {
      console.error('video-ready 이벤트 처리 중 오류:', error);
    }
  },
  
  // YouTube 업로드 완료 이벤트 처리
  handle_youtube_completed_event: (sse_data) => {
    try {
      
      
      // YouTube 관련 추가 로직이 필요한 경우 여기에 구현
      // 예: 업로드된 영상 정보를 content-launch 스토어에 업데이트
      if (sse_data.videoId || sse_data.videoUrl) {
        
          videoId: sse_data.videoId,
          videoUrl: sse_data.videoUrl
        });
      }
    } catch (error) {
      console.error('YouTube 완료 이벤트 처리 중 오류:', error);
    }
  },

  // Reddit 게시 완료 이벤트 처리
  handle_reddit_completed_event: (sse_data) => {
    try {
      
      
      // Reddit 관련 추가 로직이 필요한 경우 여기에 구현
      // 예: 게시된 포스트 정보를 content-launch 스토어에 업데이트
      if (sse_data.postUrl) {
        
          postUrl: sse_data.postUrl
        });
      }
    } catch (error) {
      console.error('Reddit 완료 이벤트 처리 중 오류:', error);
    }
  },

  // SSE 영상 생성 완료 전용 처리
  handle_sse_video_completed: (message, timestamp) => {
    get().add_sse_notification({
      type: 'video_completed_sse',
      message: message,
      timestamp: timestamp, // 원본 ISO 형식 사용
      data: { source: 'sse' },
    });
  },

  // 오래된 알림 정리 (읽은 알림 7일 후 삭제, 모든 알림 30일 후 삭제)
  cleanup_old_notifications: () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    set((state) => {
      const cleaned_notifications = state.notifications.filter((notification) => {
        // raw_timestamp 또는 timestamp를 사용하여 날짜 비교
        const dateString = notification.raw_timestamp || notification.timestamp;
        const notificationDate = new Date(dateString);
        
        // 유효하지 않은 날짜는 보존 (삭제하지 않음)
        if (isNaN(notificationDate.getTime())) {
          return true;
        }
        
        // 읽은 알림은 7일 후 삭제
        if (notification.read && notificationDate < sevenDaysAgo) {
          return false;
        }
        
        // 모든 알림은 30일 후 삭제
        if (notificationDate < thirtyDaysAgo) {
          return false;
        }
        
        return true;
      });
      
      const unread_count = cleaned_notifications.filter(n => !n.read).length;
      
      return {
        notifications: cleaned_notifications,
        unread_count,
      };
    });
  },

    }),
    {
      name: 'sos-notifications-storage',
      partialize: (state) => ({
        // 읽지 않은 알림만 로컬스토리지에 저장
        notifications: state.notifications.filter(n => !n.read && n.timestamp),
        unread_count: state.unread_count
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 복원 후 오래된 알림 정리
          state.cleanup_old_notifications();
          
        }
      },
    }
  )
);
