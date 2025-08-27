/**
 * Premium Notification 컴포넌트
 * 세련된 Modern Glassmorphism 디자인의 실시간 알림 드롭다운 시스템
 */

import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Play, Trash2, Check } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/use_on_click_outside.js';
import { useNotificationStore } from '../../stores/notification_store.js';

/**
 * Premium Notification 컴포넌트
 * @returns {JSX.Element} Enhanced Notification 컴포넌트
 */
const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Zustand 스토어에서 알림 데이터 가져오기
  const { 
    notifications, 
    unread_count,
    mark_as_read, 
    mark_all_as_read, 
    remove_notification 
  } = useNotificationStore();

  // 드롭다운 위치 계산 함수
  const calculateDropdownPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 12, // 더 넓은 간격
        left: rect.right + window.scrollX - 320, // 더 넓은 드롭다운
      });
    }
  }, []);

  // 드롭다운 토글 함수
  const toggleDropdown = useCallback(() => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(prev => !prev);
  }, [isOpen, calculateDropdownPosition]);

  // 드롭다운 닫기 함수
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 알림 클릭 핸들러
  const handleNotificationClick = useCallback((notification) => {
    if (!notification.read) {
      mark_as_read(notification.id);
    }
  }, [mark_as_read]);

  // 모든 알림 읽음 처리
  const handleMarkAllRead = useCallback(() => {
    mark_all_as_read();
  }, [mark_all_as_read]);

  // 알림 삭제 핸들러
  const handleRemoveNotification = useCallback((e, notificationId) => {
    e.stopPropagation();
    remove_notification(notificationId);
  }, [remove_notification]);

  // 외부 클릭 감지
  useOnClickOutside(dropdownRef, closeDropdown);

  // UTC 타임스탬프를 KST '오전/오후 HH:MM' 형식으로 변환
  const formatToKST = useCallback((utcTimestamp) => {
    return new Date(utcTimestamp).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // 알림 타입별 아이콘 매핑
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'video_completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'video_ready':
        return <Play className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Enhanced Bell 아이콘 버튼 */}
      <motion.button
        ref={buttonRef}
        onClick={toggleDropdown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
        aria-label="알림 보기"
      >
        <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        
        {/* Enhanced 읽지 않은 알림 배지 */}
        {unread_count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-lg border-2 border-white dark:border-gray-800"
          >
            {unread_count > 99 ? '99+' : unread_count}
          </motion.div>
        )}
      </motion.button>

      {/* Enhanced 드롭다운 메뉴 - Portal로 렌더링 */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 9999,
            }}
            className="w-80 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden"
          >
            {/* Enhanced 헤더 */}
            <div className="px-6 py-4 bg-gradient-to-r from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 border-b border-white/30 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    알림
                  </h3>
                </div>
                {unread_count > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50/80 dark:bg-blue-900/30 rounded-lg transition-all duration-200 hover:bg-blue-100/80 dark:hover:bg-blue-900/50"
                  >
                    <Check className="w-3 h-3" />
                    모두 읽음
                  </motion.button>
                )}
              </div>
              {unread_count > 0 && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  {unread_count}개의 읽지 않은 알림
                </p>
              )}
            </div>

            {/* Enhanced 알림 목록 */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <ul className="divide-y divide-white/20 dark:divide-white/5">
                  {notifications.map((notification, index) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`group relative px-6 py-4 hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer ${
                        !notification.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* 알림 타입 아이콘 */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* 읽지 않은 알림 표시 점 */}
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          {/* 알림 메시지 */}
                          <p className={`text-sm leading-relaxed break-words ${
                            notification.read 
                              ? 'text-gray-600 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-gray-100 font-semibold'
                          }`}>
                            {notification.message}
                          </p>
                          
                          {/* 시간 표시 */}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 font-medium">
                            {formatToKST(notification.timestamp)}
                          </p>
                        </div>

                        {/* 삭제 버튼 */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleRemoveNotification(e, notification.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200"
                          aria-label="알림 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    새로운 알림이 없습니다
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    새로운 소식이 있으면 여기에 표시됩니다
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </>
  );
};

export default Notification;