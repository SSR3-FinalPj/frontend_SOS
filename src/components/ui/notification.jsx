/**
 * Notification 컴포넌트
 * 웹소켓 기반 실시간 알림 드롭다운 메뉴를 제공하는 컴포넌트
 */

import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/use_on_click_outside.js';
import { useNotificationStore } from '../../stores/notification_store.js';

/**
 * Notification 컴포넌트
 * @returns {JSX.Element} Notification 컴포넌트
 */
const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const button_ref = useRef(null);
  const dropdown_ref = useRef(null);

  // Zustand 스토어에서 알림 데이터 가져오기
  const { 
    notifications, 
    unread_count,
    mark_as_read, 
    mark_all_as_read, 
    remove_notification 
  } = useNotificationStore();

  // 드롭다운 위치 계산 함수
  const calculate_dropdown_position = useCallback(() => {
    if (button_ref.current) {
      const rect = button_ref.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: rect.right + window.scrollX - 280, // 280px는 드롭다운 너비
      });
    }
  }, []);

  // 드롭다운 토글 함수
  const toggle_dropdown = useCallback(() => {
    if (!isOpen) {
      calculate_dropdown_position();
    }
    setIsOpen(prev => !prev);
  }, [isOpen, calculate_dropdown_position]);

  // 드롭다운 닫기 함수
  const close_dropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 알림 클릭 핸들러
  const handle_notification_click = useCallback((notification) => {
    if (!notification.read) {
      mark_as_read(notification.id);
    }
  }, [mark_as_read]);

  // 모든 알림 읽음 처리
  const handle_mark_all_read = useCallback(() => {
    mark_all_as_read();
  }, [mark_all_as_read]);

  // 외부 클릭 감지
  useOnClickOutside(dropdown_ref, close_dropdown);

  return (
    <>
      {/* Bell 아이콘 버튼 */}
      <motion.button
        ref={button_ref}
        onClick={toggle_dropdown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 relative"
        aria-label="알림 보기"
      >
        <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        
        {/* 읽지 않은 알림 표시 */}
        {unread_count > 0 && (
          <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-800" />
        )}
      </motion.button>

      {/* 드롭다운 메뉴 - Portal로 렌더링 */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            ref={dropdown_ref}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 9999,
            }}
            className="w-80 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-white/30 dark:border-white/20"
          >
            <div className="py-2">
              {/* 헤더 */}
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    알림
                  </h3>
                  {unread_count > 0 && (
                    <button
                      onClick={handle_mark_all_read}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    >
                      모두 읽음
                    </button>
                  )}
                </div>
                {unread_count > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {unread_count}개의 읽지 않은 알림
                  </p>
                )}
              </div>

              {/* 알림 목록 */}
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map(notification => (
                      <li
                        key={notification.id}
                        onClick={() => handle_notification_click(notification)}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* 읽지 않은 알림 표시 점 */}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          )}
                          
                          <div className={`flex-1 ${!notification.read ? '' : 'ml-5'}`}>
                            {/* 알림 메시지 */}
                            <p className={`text-sm leading-relaxed ${
                              notification.read 
                                ? 'text-gray-600 dark:text-gray-400' 
                                : 'text-gray-800 dark:text-gray-200 font-medium'
                            }`}>
                              {notification.message}
                            </p>
                            
                            {/* 시간 표시 */}
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      새로운 알림이 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Notification;