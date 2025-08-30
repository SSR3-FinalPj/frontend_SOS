/**
 * Detailed Analytics View 컴포넌트
 * 상세 분석 페이지 뷰
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Loader2
} from 'lucide-react';

import { usePageStore } from '../../common/stores/pageStore.js';
import { Calendar as CalendarComponent } from "../../common/ui/calendar.jsx";
import { useAnalyticsStore } from '../../domain/analytics/model/store.js';
import { get_kpi_data_from_api } from '../../domain/dashboard/model/dashboardUtils.js';
import AnalyticsFilterSidebar from '../AnalyticsFilterSidebar/index.jsx';
import Notification from '../../common/ui/notification.jsx';
import AudienceDemographicsChart from '../../common/ui/AudienceDemographicsChart.jsx';
import TrafficSourceChart from '../../common/ui/TrafficSourceChart.jsx';
import UploadedContentList from '../../features/content-management/ui/UploadedContentList.jsx';

const DetailedAnalyticsView = ({ current_view, set_current_view, onVideoCardClick }) => {
  const { isDarkMode, setIsDarkMode } = usePageStore();
  
  const {
    selected_platform,
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
    fetchSummaryData();
  }, [fetchSummaryData]);

  const kpiData = get_kpi_data_from_api(selected_platform, summaryData);

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <AnalyticsFilterSidebar 
        current_view={current_view} 
        set_current_view={set_current_view}
      />

      <div className="flex-1 flex flex-col relative z-10">
        <header className="p-6 border-b border-gray-200/40 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-2">
                {selected_platform === 'youtube' ? '유튜브 상세 분석' : '레딧 상세 분석'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {get_selected_period_label()}
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

            <UploadedContentList startDate={date_range?.from} endDate={date_range?.to} onVideoCardClick={onVideoCardClick} />
            

            <div className="grid grid-cols-2 gap-8">
              <AudienceDemographicsChart />
              

              <TrafficSourceChart />
            </div>
          </div>
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
