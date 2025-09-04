/**
 * Dashboard Sidebar 컴포넌트
 * 대시보드 네비게이션 사이드바
 */

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Zap, PieChart, Settings, ArrowLeft } from 'lucide-react';
import { usePageStore } from '@/common/stores/page-store';
import { MeaireLogo } from '@/common/ui/meaire-logo';

/**
 * Sidebar 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.current_view - 현재 뷰 (사용하지 않음, URL로 판단)
 * @returns {JSX.Element} Sidebar 컴포넌트
 */
const Sidebar = ({ current_view, isYoutubeConnected, isRedditConnected, isLoading }) => {
  const location = useLocation();
  const { isDarkMode } = usePageStore();

  const menu_items = [
    { id: 'dashboard', label: '대시보드', icon: BarChart3, path: '/dashboard' },
    { id: 'contentList', label: '콘텐츠 목록', icon: Calendar, path: '/contents', disabled: !isYoutubeConnected && !isRedditConnected },
    { id: 'contentLaunch', label: 'AI 콘텐츠 론칭', icon: Zap, path: '/contentlaunch' },
    { id: 'analytics', label: '분석', icon: PieChart, path: '/analytics' },
    { id: 'settings', label: '환경설정', icon: Settings, path: '/settings' }
  ];

  // 현재 경로에 따라 활성 상태 판단
  const get_active_item = (item) => {
    if (current_view && current_view === item.id) return true;
    return location.pathname === item.path;
  };

  return (
    <div className="w-64 h-full flex flex-col relative z-10 flex-shrink-0">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border-r border-white/30 dark:border-white/10 h-full flex flex-col shadow-xl p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200/40 dark:border-white/10">
          <MeaireLogo size={32} showText={true} variant={isDarkMode ? 'dark' : 'light'} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-2">
            {menu_items.map((item) => {
              const Icon = item.icon;
              const is_active = get_active_item(item);
              const is_disabled = item.disabled || (isLoading && item.id === 'contentList');

              const link_content = (
                <motion.div
                  whileHover={!is_disabled ? { x: 4 } : {}}
                  whileTap={!is_disabled ? { scale: 0.98 } : {}}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    is_active
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-gray-800 dark:text-white shadow-lg'
                      : is_disabled
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              );

              return is_disabled ? (
                <div key={item.id} className="cursor-not-allowed">
                  {link_content}
                </div>
              ) : (
                <Link key={item.id} to={item.path}>
                  {link_content}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gray-200/40 dark:border-white/10">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white rounded-xl transition-all duration-200 text-left font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로 돌아가기
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;