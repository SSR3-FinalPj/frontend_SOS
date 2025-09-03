/**
 * Detailed Analytics View 컴포넌트
 * 상세 분석 페이지 뷰
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Loader2,
  AlertTriangle
} from 'lucide-react';

import { usePageStore } from '@/common/stores/page-store';
import { Calendar as CalendarComponent } from '@/common/ui/calendar';
import { useAnalyticsStore } from '@/domain/analytics/logic/store';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { get_kpi_data_from_api } from '@/domain/dashboard/logic/dashboard-utils';
import AnalyticsFilterSidebar from '@/containers/AnalyticsFilterSidebar/index';
import Notification from '@/common/ui/notification';
import AudienceDemographicsChart from '@/common/ui/AudienceDemographicsChart';
import TrafficSourceChart from '@/common/ui/TrafficSourceChart';
import UploadedContentList from '@/features/content-management/ui/UploadedContentList';
import IntegratedAnalyticsView from '@/containers/IntegratedAnalyticsView';

const DetailedAnalyticsView = ({ current_view, set_current_view, onVideoCardClick }) => {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = usePageStore();
  const { platforms } = usePlatformStore();

  const {
    selected_platform,
    view_type,
    is_calendar_visible,
    date_range,
    summaryData,
    isLoading,
    error,
    get_selected_period_label,
    handle_apply_date_range,
    handle_calendar_cancel,
    handle_calendar_range_select,
    fetchSummaryData
  } = useAnalyticsStore();

  React.useEffect(() => {
    const isYoutubeConnected = platforms.google.connected;
    const isRedditConnected = platforms.reddit.connected;

    if (platforms.google.loading || platforms.reddit.loading) return;

    if ((selected_platform === 'youtube' && isYoutubeConnected) || (selected_platform === 'reddit' && isRedditConnected)) {
      fetchSummaryData();
    }
  }, [platforms.google.connected, platforms.reddit.connected, platforms.google.loading, platforms.reddit.loading, selected_platform, fetchSummaryData]);

  const kpiData = get_kpi_data_from_api(selected_platform, summaryData);

  const isSelectedPlatformConnected = selected_platform === 'youtube' ? platforms.google.connected : platforms.reddit.connected;

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <AnalyticsFilterSidebar 
        current_view={current_view} 
        set_current_view={set_current_view}
        platforms={platforms} // Pass platforms down
      />

      <div className="flex-1 flex flex-col relative z-10">
        <header className="p-6 border-b border-gray-200/40 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-2">
                {view_type === 'integrated' 
                  ? '통합 분석' 
                  : (selected_platform === 'youtube' ? '유튜브 상세 분석' : '레딧 상세 분석')
                }
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {view_type === 'integrated' 
                  ? '플랫폼 간 성과를 한눈에 비교 분석하세요'
                  : get_selected_period_label()
                }
              </p>
            </div>

            <div className="flex items-center gap-3">
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

              <Notification />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {view_type === 'integrated' ? (
            <IntegratedAnalyticsView />
          ) : platforms.google.loading || platforms.reddit.loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : !isSelectedPlatformConnected ? (
            <div className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/80 dark:border-gray-700/60 rounded-2xl p-8 shadow-inner">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">플랫폼이 연결되지 않았습니다</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                선택하신 플랫폼은 현재 연결되어 있지 않습니다. 설정 페이지에서 계정을 연동하여 모든 분석 기능을 활성화하세요.
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              >
                설정으로 이동
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                {kpiData.map((kpi, index) => {
                  const Icon = kpi.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`${kpi.bgColor} border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative`}
                    >
                      {isLoading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.label}</p>
                        <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                          {isLoading ? "로딩 중..." : kpi.value}
                        </p>
                        {error && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                            데이터 로딩 실패
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <UploadedContentList startDate={date_range?.from} endDate={date_range?.to} onVideoCardClick={onVideoCardClick} selectedPlatform={selected_platform} />
              

              <div className="grid grid-cols-2 gap-8">
                <AudienceDemographicsChart />
                

                <TrafficSourceChart />
              </div>
            </div>
          )}
        </main>
      </div>

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
