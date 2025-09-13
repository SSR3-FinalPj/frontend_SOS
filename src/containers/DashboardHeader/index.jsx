/**
 * Dashboard Header 컴포넌트
 * 대시보드 페이지 헤더
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const header_info = get_header_info(current_view);

  const toggle_dark_mode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      clearAccessToken();
      navigate('/login');
    }
  };

  return (
    <header className="relative z-10 p-6">
      <GlassCard hover={false}>
        <div className="flex items-center justify-between">
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
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
              >
                <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </motion.button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed top-16 right-6 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="p-2">
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>환경설정</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </header>
  );
};

export default React.memo(DashboardHeader);