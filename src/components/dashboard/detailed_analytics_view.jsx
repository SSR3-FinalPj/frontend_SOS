/**
 * Detailed Analytics View 컴포넌트
 * 상세 분석 페이지 뷰
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Bell, 
  Calendar,
  Activity,
  TrendingUp 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { usePageStore } from '../../stores/page_store.js';
import { Calendar as CalendarComponent } from "../../components/ui/calendar.jsx";
import { use_analytics_filters } from '../../hooks/use_analytics_filters.js';
import { get_kpi_data } from '../../utils/dashboard_utils.js';
import { latest_content_data, weekly_activity_data } from '../../utils/dashboard_constants.js';
import AnalyticsFilterSidebar from './analytics_filter_sidebar.jsx';

/**
 * Detailed Analytics View 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.current_view - 현재 뷰
 * @param {Function} props.set_current_view - 뷰 변경 함수
 * @returns {JSX.Element} Detailed Analytics View 컴포넌트
 */
const DetailedAnalyticsView = ({ current_view, set_current_view }) => {
  const { isDarkMode, setIsDarkMode } = usePageStore();
  
  const {
    selected_platform,
    set_selected_platform,
    selected_period,
    is_calendar_visible,
    set_is_calendar_visible,
    date_range,
    set_date_range,
    temp_period_label,
    set_temp_period_label,
    period_dropdown_open,
    set_period_dropdown_open,
    period_dropdown_ref,
    get_selected_period_label,
    handle_period_select,
    handle_apply_date_range,
    handle_calendar_cancel,
    handle_calendar_range_select
  } = use_analytics_filters();

  // KPI 데이터 가져오기
  const kpi_data = get_kpi_data(selected_platform);

  // Custom Tooltip for Weekly Activity Chart
  const custom_tooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/30 dark:border-gray-600/30 rounded-xl p-4 shadow-xl">
          <p className="font-medium text-gray-800 dark:text-white mb-2">{data.date}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600 dark:text-blue-400">
              {selected_platform === 'youtube' ? '조회수' : '업보트'}: {data.views.toLocaleString()}
            </p>
            <p className="text-red-600 dark:text-red-400">
              좋아요: {data.likes.toLocaleString()}
            </p>
            <p className="text-green-600 dark:text-green-400">
              댓글: {data.comments.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      {/* Analytics Filter Sidebar */}
      <AnalyticsFilterSidebar 
        current_view={current_view} 
        set_current_view={set_current_view}
        selected_platform={selected_platform}
        set_selected_platform={set_selected_platform}
        selected_period={selected_period}
        is_calendar_visible={is_calendar_visible}
        set_is_calendar_visible={set_is_calendar_visible}
        date_range={date_range}
        set_date_range={set_date_range}
        temp_period_label={temp_period_label}
        set_temp_period_label={set_temp_period_label}
        period_dropdown_open={period_dropdown_open}
        set_period_dropdown_open={set_period_dropdown_open}
        period_dropdown_ref={period_dropdown_ref}
        get_selected_period_label={get_selected_period_label}
        handle_period_select={handle_period_select}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-gray-200/40 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-2">
                {selected_platform === 'youtube' ? '유튜브 상세 분석' : '레딧 상세 분석'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                최근 30일 데이터
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setIsDarkMode(!isDarkMode)}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 relative"
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* KPI Cards - 플랫폼별 3개 카드 */}
            <div className="grid grid-cols-3 gap-6">
              {kpi_data.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`${kpi.bgColor} border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        kpi.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${kpi.isPositive ? '' : 'rotate-180'}`} />
                        {kpi.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.label}</p>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-white">{kpi.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Row - Charts */}
            <div className="grid grid-cols-2 gap-8">
              {/* Latest Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl h-96">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">최신 콘텐츠</h3>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-80">
                    {latest_content_data.map((content, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/20 dark:bg-white/5 rounded-xl">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                            {content.rank}
                          </div>
                        </div>
                        
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          <img 
                            src={content.thumbnail} 
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate mb-1">
                            {content.title}
                          </h4>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {content.uploadDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Weekly Activity Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl h-96">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">주간 활동</h3>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weekly_activity_data} margin={{ top: 5, right: 5, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.7 }}
                          tickFormatter={(value) => {
                            if (value >= 1000) {
                              return (value / 1000).toFixed(0) + 'K';
                            }
                            return value;
                          }}
                        />
                        <Tooltip content={custom_tooltip} />
                        <Area 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          fill="url(#viewsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Calendar Component - Rendered at root level to avoid stacking context issues */}
      {is_calendar_visible && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/20 dark:bg-black/40" 
          onClick={handle_calendar_cancel}
        >
          <div 
            className="absolute left-64 top-32"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <CalendarComponent
                mode="range"
                selected_range={date_range}
                on_range_select={handle_calendar_range_select}
                on_apply={handle_apply_date_range}
                on_cancel={handle_calendar_cancel}
                className="w-full"
                show_actions={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(DetailedAnalyticsView);