/**
 * Detailed Analytics View 컴포넌트
 * 상세 분석 페이지 뷰
 */

import React, { useState, useEffect } from 'react';
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
import { getYouTubeChannelId, getYouTubeVideosByChannelId, getRedditChannelInfo, getRedditUploadsByRange } from '@/common/api/api';
import AnalyticsFilterSidebar from '@/containers/AnalyticsFilterSidebar/index';
import Notification from '@/common/ui/notification';
import AudienceDemoContainer from '@/containers/AudienceDemoContainer/index'; // ✅ 수정
import TrafficSourceChart from '@/common/ui/TrafficSourceChart';
import UploadedContentList from '@/features/content-management/ui/UploadedContentList';
import IntegratedAnalyticsView from '@/containers/IntegratedAnalyticsView';
import PerformanceHighlight from '@/features/analytics/ui/PerformanceHighlight';
import GlassCard from '@/common/ui/glass-card';

const DetailedAnalyticsView = ({ onVideoCardClick }) => {
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
    fetchSummaryData,
  } = useAnalyticsStore();

  const [contentData, setContentData] = useState([]);

  // 콘텐츠 데이터 가져오기
  useEffect(() => {
    const fetchContentData = async () => {
      if (!date_range?.from || !date_range?.to) return;

      try {
        const start = new Date(date_range.from);
        const end = new Date(date_range.to);

        if (selected_platform === "youtube") {
          const channelInfo = await getYouTubeChannelId();
          if (channelInfo?.channelId) {
            const videoData = await getYouTubeVideosByChannelId(channelInfo.channelId, {
              sortBy: "latest",
              limit: 50,
            });
            const filteredVideos =
              videoData.videos?.filter((video) => {
                const publishedAt = new Date(video.publishedAt);
                return publishedAt >= start && publishedAt <= end;
              }) || [];
            setContentData(filteredVideos);
          }
        } else if (selected_platform === "reddit") {
          const channelInfo = await getRedditChannelInfo();
          if (channelInfo?.channelId) {
            const postData = await getRedditUploadsByRange(
              date_range.from.toISOString().slice(0, 10),
              date_range.to.toISOString().slice(0, 10),
              channelInfo.channelId
            );
            setContentData(postData.posts || []);
          }
        }
      } catch (err) {
        console.error("Content data fetch error:", err);
        setContentData([]);
      }
    };

    fetchContentData();
  }, [selected_platform, date_range]);

  // 요약 데이터 가져오기
  useEffect(() => {
    if (platforms.google.loading || platforms.reddit.loading) return;

    const isYoutubeConnected = platforms.google.connected;
    const isRedditConnected = platforms.reddit.connected;

    if (
      (selected_platform === "youtube" && isYoutubeConnected) ||
      (selected_platform === "reddit" && isRedditConnected)
    ) {
      fetchSummaryData();
    }
  }, [
    selected_platform,
    platforms.google.connected,
    platforms.reddit.connected,
    platforms.google.loading,
    platforms.reddit.loading,
    fetchSummaryData,
  ]);

  const kpiData = get_kpi_data_from_api(selected_platform, summaryData);

  const isSelectedPlatformConnected =
    selected_platform === "youtube"
      ? platforms.google.connected
      : platforms.reddit.connected;

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* 사이드바 */}
      <AnalyticsFilterSidebar platforms={platforms} />

      <div className="flex-1 flex flex-col relative z-10">
        {/* 헤더 */}
        <header className="relative z-10 p-6">
          <GlassCard hover={false}>
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-1">
                  {view_type === "integrated"
                    ? "비교 분석"
                    : selected_platform === "youtube"
                    ? "유튜브 상세 분석"
                    : "레딧 상세 분석"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {view_type === "integrated"
                    ? "플랫폼 간 성과를 한눈에 비교 분석하세요"
                    : get_selected_period_label()}
                </p>
              </div>

              {/* 우측 버튼 */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.button>
                <Notification />
              </div>
            </div>
          </GlassCard>
        </header>

        {/* 메인 */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          {view_type === "integrated" ? (
            <IntegratedAnalyticsView />
          ) : platforms.google.loading || platforms.reddit.loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-brand-secondary-500" />
            </div>
          ) : !isSelectedPlatformConnected ? (
            <div className="flex flex-col items-center justify-center h-full text-center rounded-2xl p-8 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/80 dark:border-gray-700/60">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">플랫폼이 연결되지 않았습니다</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                선택하신 플랫폼은 현재 연결되어 있지 않습니다. 설정 페이지에서 계정을 연동하여
                모든 분석 기능을 활성화하세요.
              </p>
              <button
                onClick={() => navigate("/settings")}
                className="px-6 py-2 bg-brand-secondary-500 text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary-600 transition-colors"
              >
                설정으로 이동
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* KPI 카드 */}
              <div className="grid grid-cols-3 gap-3">
                {kpiData.map((kpi, index) => {
                  const Icon = kpi.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`${kpi.bgColor} border border-white/30 dark:border-white/10 rounded-xl p-4 shadow-sm flex flex-col items-center text-center relative`}
                    >
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      )}

                      {/* 상단: 아이콘 */}
                      <div className="flex justify-center mb-2">
                        <div
                          className={`w-8 h-8 rounded-md ${kpi.iconBg} flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* 중앙: 라벨 + 숫자 */}
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-0.5">
                        {kpi.label}
                      </p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {isLoading ? "..." : kpi.value}
                      </p>

                      {/* 하단: 최고/최저 */}
                      {!isLoading && kpi.extra && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {kpi.extra}
                        </p>
                      )}
                      {error && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                          {error.message || "데이터 로딩 실패"}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* 콘텐츠 섹션 */}
              <div className="grid grid-cols-2 gap-6">
                <UploadedContentList
                  contentData={contentData} 
                  startDate={date_range?.from}
                  endDate={date_range?.to}
                  onVideoCardClick={onVideoCardClick}
                  selectedPlatform={selected_platform}
                />
                <PerformanceHighlight
                  contentData={contentData}
                  summaryData={summaryData}
                  selectedPlatform={selected_platform}
                />
              </div>

              {/* YouTube 전용 섹션 */}
              {selected_platform === "youtube" && (
                <div className="grid grid-cols-2 gap-6">
                  <AudienceDemoContainer startDate={date_range?.from} endDate={date_range?.to} />
                  <TrafficSourceChart />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 달력 모달 */}
      {is_calendar_visible && (
        <div
          className="fixed inset-0 z-[9999] bg-black/20 dark:bg-black/40"
          onClick={handle_calendar_cancel}
        >
          <div className="absolute left-64 top-32" onClick={(e) => e.stopPropagation()}>
            <div className="w-80 rounded-xl shadow-2xl border bg-white dark:bg-gray-800 dark:border-gray-700">
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
export default DetailedAnalyticsView;
