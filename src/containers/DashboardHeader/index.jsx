/**
 * Dashboard Header 컴포넌트
 * 대시보드 페이지 헤더
 */

import React, { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import { usePageStore } from '@/common/stores/page-store';
import { get_header_info } from '@/domain/dashboard/logic/dashboard-utils';
import GlassCard from '@/common/ui/glass-card';
import Notification from '@/common/ui/notification';
import { useOnClickOutside } from '@/common/hooks/use-on-click-outside';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/common/api/api';
import { clearAccessToken } from '@/common/api/token';

/**
 * Dashboard Header 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.current_view - 현재 뷰
 * @returns {JSX.Element} Dashboard Header 컴포넌트
 */
const DashboardHeader = ({ current_view }) => {
  const { isDarkMode, setIsDarkMode } = usePageStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const userButtonRef = useRef(null);
  const navigate = useNavigate();

  // Portal 방식에서는 외부 클릭 감지를 직접 구현
  useOnClickOutside([dropdownRef, userButtonRef], () => setIsDropdownOpen(false));

  const header_info = get_header_info(current_view);


  const toggle_dark_mode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);

  // 드롭다운 위치 계산 함수
  const calculateDropdownPosition = useCallback(() => {
    if (userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  // 드롭다운 토글 함수
  const toggleDropdown = useCallback(() => {
    if (!isDropdownOpen) {
      calculateDropdownPosition();
    }
    setIsDropdownOpen(prev => !prev);
  }, [isDropdownOpen, calculateDropdownPosition]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_error) {
    } finally {
      clearAccessToken();
      navigate('/login');
    }
  };

  return (
    <header className="relative z-10 p-6">
      <GlassCard hover={false}>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-1">
              {header_info.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {header_info.subtitle}
            </p>
          </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggle_dark_mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>

              {/* Notification */}
              <Notification />

              {/* User Profile Dropdown */}
              <div className="relative">
                <motion.button
                  ref={userButtonRef}
                  onClick={toggleDropdown}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
                >
                  <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </motion.button>
              </div>
            </div>
        </div>
      </GlassCard>

      {/* User Profile Dropdown - Portal로 렌더링 */}
      {createPortal(
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              key="user-menu-modal"
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", duration: 0.2, bounce: 0.1 }}
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                right: dropdownPosition.right,
              }}
              className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-[9999]"
            >
              <div className="p-2">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-md flex items-center gap-2 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>환경설정</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-md flex items-center gap-2 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};

export default React.memo(DashboardHeader);
