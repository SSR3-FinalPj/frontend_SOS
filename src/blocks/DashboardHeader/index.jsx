/**
 * Dashboard Header 컴포넌트
 * 대시보드 페이지 헤더
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { usePageStore } from '../../common/stores/pageStore.js';
import { get_header_info } from '../../domain/dashboard/model/dashboardUtils.js';
import GlassCard from '../../common/ui/glass-card.jsx';
import Notification from '../../common/ui/notification.jsx';

/**
 * Dashboard Header 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.current_view - 현재 뷰
 * @returns {JSX.Element} Dashboard Header 컴포넌트
 */
const DashboardHeader = ({ current_view }) => {
  const { isDarkMode, setIsDarkMode } = usePageStore();

  const header_info = get_header_info(current_view);


  const toggle_dark_mode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);

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
          </div>
        </div>
      </GlassCard>
    </header>
  );
};

export default React.memo(DashboardHeader);