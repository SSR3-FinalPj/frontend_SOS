/**
 * Analytics Filter Sidebar 컴포넌트
 * 분석 페이지 필터 사이드바
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ArrowLeft,
  Check,
  Lock, // Import Lock icon
  BarChart3,
  PieChart
} from 'lucide-react';
import YoutubeIcon from '@/assets/images/button/Youtube_Icon.svg';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';
import { useAnalyticsStore } from '@/domain/analytics/logic/store';
import { MeaireLogo } from '@/common/ui/meaire-logo';
import { usePageStore } from '@/common/stores/page-store';

const period_options = [
  { id: 'last7Days', label: 'last7Days' },
  { id: 'last30Days', label: 'last30Days' },
  //{ id: 'last3Months', label: 'last3Months' },
  //{ id: 'thisYear', label: 'thisYear' },
  { id: 'custom', label: 'custom' }
];

/**
 * Analytics Filter Sidebar 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {object} props.platforms - Platform connection status
 * @returns {JSX.Element} Analytics Filter Sidebar 컴포넌트
 */
const AnalyticsFilterSidebar = ({ 
  platforms
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = usePageStore();
  const period_dropdown_ref = React.useRef(null);
  const {
    selected_platform,
    set_selected_platform,
    view_type,
    set_view_type,
    selected_period,
    is_calendar_visible,
    period_dropdown_open,
    set_period_dropdown_open,
    get_selected_period_label,
    handle_period_select
  } = useAnalyticsStore();

  const periodLabels = {
    last7Days: '최근 7일',
    last30Days: '최근 30일',
    custom: '직접 설정'
  };
  const platform_options = [
    { id: 'youtube', label: 'YouTube', icon: YoutubeIcon, color: 'text-red-600', isSvg: true },
    { id: 'reddit', label: 'Reddit', icon: RedditIcon, color: 'text-orange-600', isSvg: true }
  ];

  return (
    <div className="w-64 h-full flex flex-col relative z-10 flex-shrink-0">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border-r border-white/30 dark:border-white/10 h-full flex flex-col shadow-xl p-6">
        {/* Header - 로고만 표시 */}
        <div className="pb-6 border-b border-gray-200/40 dark:border-white/10 mb-6">
          <MeaireLogo size={32} showText={true} variant={isDarkMode ? 'dark' : 'light'} />
        </div>

        {/* 분석 유형 선택 */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            분석 유형
          </h3>
          <div className="space-y-2">
            {[
              { id: 'integrated', label: '비교 분석', icon: BarChart3, description: '플랫폼 간 비교 분석' },
              { id: 'detailed', label: '개별 분석', icon: PieChart, description: '플랫폼별 상세 분석' }
            ].map((viewOption) => {
              const Icon = viewOption.icon;
              const isSelected = view_type === viewOption.id;

              return (
                <motion.button
                  key={viewOption.id}
                  onClick={() => set_view_type(viewOption.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-brand-secondary-500/20 to-brand-primary-500/20 border border-brand-secondary-500/30 text-gray-800 dark:text-white shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-gray-800 dark:text-white' : 'text-brand-primary-500/80'}`} />
                  <div className="text-left">
                    <div className="font-medium">{viewOption.label}</div>
                    <div className={`text-xs ${isSelected ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {viewOption.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 플랫폼 선택 - 개별 분석일 때만 표시 */}
        {view_type === 'detailed' && (
          <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            플랫폼
          </h3>
          <div className="space-y-2">
            {platform_options.map((platform) => {
              const Icon = platform.icon;
              const isConnected = platform.id === 'youtube' ? platforms.google.connected : platforms.reddit.connected;
              const isSelected = selected_platform === platform.id;

              const buttonClasses = [
                'w-full',
                'flex',
                'items-center',
                'gap-3',
                'px-4',
                'py-3',
                'rounded-xl',
                'transition-all',
                'duration-200',
                isSelected ? 'bg-gradient-to-r from-brand-secondary-500/20 to-brand-primary-500/20 border border-brand-secondary-500/30 text-gray-800 dark:text-white shadow-lg' : 'text-gray-700 dark:text-gray-300',
                !isConnected ? 'opacity-50 cursor-not-allowed' : (isSelected ? '' : 'hover:bg-white/30 dark:hover:bg-white/20')
              ].join(' ');

              return (
                <motion.button
                  key={platform.id}
                  onClick={() => isConnected && set_selected_platform(platform.id)}
                  whileHover={{ scale: isConnected ? 1.02 : 1 }}
                  whileTap={{ scale: isConnected ? 0.98 : 1 }}
                  className={buttonClasses}
                  disabled={!isConnected}
                >
                  {platform.isSvg ? (
                    <img src={Icon} alt={platform.label} className="w-4 h-4" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : platform.color}`} />
                  )}
                  <span>{platform.label}</span>
                  {!isConnected && <Lock className="w-4 h-4 ml-auto text-gray-500 dark:text-gray-400" />}
                </motion.button>
              );
            })}
          </div>
        </div>
        )}

        {/* 분석 기간 - 개별 분석일 때만 표시 */}
        {view_type === 'detailed' && (
        <div className="mb-8 flex-1">
          {!is_calendar_visible ? (
            // 필터 목록 표시
            <>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                분석 기간
              </h3>
              
              <div className="relative" ref={period_dropdown_ref}>
                <motion.button
                  onClick={() => set_period_dropdown_open(!period_dropdown_open)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {get_selected_period_label()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${period_dropdown_open ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* 드롭다운 메뉴 */}
                <AnimatePresence>
                  {period_dropdown_open && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="absolute top-full left-0 right-0 mt-2 backdrop-blur-2xl bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 rounded-xl shadow-2xl p-2 z-50"
                    >
                      {period_options.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handle_period_select(option.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                            selected_period === option.id
                              ? 'bg-gradient-to-r from-brand-secondary-500/20 to-brand-primary-500/20 border border-brand-secondary-500/30 text-gray-800 dark:text-white shadow-lg'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                          }`}
                        >
                          <span className="text-sm font-medium">{periodLabels[option.label]}</span>
                          {selected_period === option.id && (
                            <Check className="w-4 h-4" />
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            // 달력 표시 상태 - 실제 달력은 부모에서 렌더링
            <div className="w-full relative">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                날짜 범위 선택
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                날짜 범위를 선택하세요
              </p>
            </div>
          )}
        </div>
        )}

        {/* 뒤로가기 버튼 - 최하단에 위치 */}
        <div className="pt-6 border-t border-gray-200/40 dark:border-white/10 mt-auto">
          <motion.button
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white rounded-xl transition-all duration-200 text-left font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드로 돌아가기
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnalyticsFilterSidebar);
