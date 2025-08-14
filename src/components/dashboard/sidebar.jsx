/**
 * Dashboard Sidebar 컴포넌트
 * 대시보드 네비게이션 사이드바
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Zap, PieChart, Settings, ArrowLeft } from 'lucide-react';
import { usePageStore } from '../../stores/page_store.js';

/**
 * Sidebar 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.current_view - 현재 뷰
 * @param {Function} props.set_current_view - 뷰 변경 함수
 * @returns {JSX.Element} Sidebar 컴포넌트
 */
const Sidebar = ({ current_view, set_current_view }) => {
  const { setCurrentPage } = usePageStore();

  const menu_items = [
    { id: 'dashboard', label: '대시보드', icon: BarChart3 },
    { id: 'contentList', label: '콘텐츠 목록', icon: Calendar },
    { id: 'contentLaunch', label: 'AI 콘텐츠 론칭', icon: Zap },
    { id: 'analytics', label: '분석', icon: PieChart },
    { id: 'settings', label: '환경설정', icon: Settings }
  ];

  const go_back_to_landing = useCallback(() => {
    setCurrentPage('landing');
  }, [setCurrentPage]);

  return (
    <div className="w-64 h-full flex flex-col relative z-10 flex-shrink-0">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border-r border-white/30 dark:border-white/10 h-full flex flex-col shadow-xl p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200/40 dark:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <span className="text-xl font-light text-gray-800 dark:text-white">콘텐츠부스트</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-2">
            {menu_items.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => set_current_view(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    current_view === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-gray-800 dark:text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gray-200/40 dark:border-white/10">
          <motion.button
            onClick={go_back_to_landing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white rounded-xl transition-all duration-200 text-left font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            로그아웃
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);