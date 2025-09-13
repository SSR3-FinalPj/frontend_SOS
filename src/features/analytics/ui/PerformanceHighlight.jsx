import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Eye, Heart, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import { format_number_korean } from '@/domain/dashboard/logic/dashboard-utils';

/**
 * 성과 하이라이트 컴포넌트
 * 현재 API 데이터를 활용하여 최고 성과 콘텐츠와 성장 지표를 표시
 */
const PerformanceHighlight = ({ contentData, summaryData, selectedPlatform }) => {
  // 최고 성과 콘텐츠 찾기
  const getTopPerformer = () => {
    if (!contentData || !Array.isArray(contentData) || contentData.length === 0) {
      return null;
    }

    // 플랫폼별 정렬 기준
    const sortKey = selectedPlatform === 'youtube' ? 'statistics.viewCount' : 'upvotes';
    
    return contentData.reduce((top, current) => {
      const currentValue = selectedPlatform === 'youtube' 
        ? (current.statistics?.viewCount || 0)
        : (current.upvotes || current.score || 0);
      
      const topValue = selectedPlatform === 'youtube'
        ? (top.statistics?.viewCount || 0)
        : (top.upvotes || top.score || 0);

      return currentValue > topValue ? current : top;
    });
  };

  // 최저 성과 콘텐츠 찾기
  const getWorstPerformer = () => {
    if (!contentData || !Array.isArray(contentData) || contentData.length === 0) {
      return null;
    }
    
    return contentData.reduce((worst, current) => {
      const currentValue = selectedPlatform === 'youtube' 
        ? (current.statistics?.viewCount || 0)
        : (current.upvotes || current.score || 0);
      
      const worstValue = selectedPlatform === 'youtube'
        ? (worst.statistics?.viewCount || 0)
        : (worst.upvotes || worst.score || 0);

      return currentValue < worstValue ? current : worst;
    });
  };

  // 성과 차이 계산
  const getPerformanceDifference = (best, worst) => {
    if (!best || !worst) return null;
    
    const bestValue = selectedPlatform === 'youtube' 
      ? (best.statistics?.viewCount || 0)
      : (best.upvotes || best.score || 0);
      
    const worstValue = selectedPlatform === 'youtube'
      ? (worst.statistics?.viewCount || 0)
      : (worst.upvotes || worst.score || 0);

    if (worstValue === 0) return null;
    return Math.round((bestValue / worstValue) * 10) / 10; // 소수점 1자리까지
  };

  // 성장률 계산 (간단한 참여율 기준)
  const getEngagementRate = () => {
    if (!summaryData) return 0;
    
    const totalData = summaryData.total || summaryData;
    
    if (selectedPlatform === 'youtube') {
      const views = totalData?.total_view_count || 0;
      const likes = totalData?.total_like_count || 0;
      const comments = totalData?.total_comment_count || 0;
      
      if (views === 0) return 0;
      return ((likes + comments * 2) / views * 100).toFixed(1);
    } else {
      const upvotes = totalData?.total_upvote_count || 0;
      const comments = totalData?.total_comment_count || 0;
      
      if (upvotes === 0) return 0;
      return ((comments / upvotes) * 100).toFixed(1);
    }
  };

  const topPerformer = getTopPerformer();
  const worstPerformer = getWorstPerformer();
  const engagementRate = getEngagementRate();
  const performanceDiff = getPerformanceDifference(topPerformer, worstPerformer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <GlassCard className="p-6 min-h-[400px]" hover={false}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              성과 하이라이트
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              주요 성과 지표와 최고 콘텐츠
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* 최고 성과 콘텐츠 */}
          {topPerformer ? (
            <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl p-3 border border-yellow-200/30 dark:border-yellow-800/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">
                  🏆 TOP 콘텐츠
                </span>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedPlatform === 'youtube' ? (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{format_number_korean(topPerformer.statistics?.viewCount || 0)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{format_number_korean(topPerformer.upvotes || topPerformer.score || 0)}</span>
                    </div>
                  )}
                </div>
              </div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2 leading-tight">
                {topPerformer.title}
              </h4>
            </div>
          ) : (
            <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                콘텐츠 데이터를 불러오는 중...
              </p>
            </div>
          )}

          {/* 성과 지표 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200/30 dark:border-blue-800/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  참여율
                </span>
              </div>
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                {engagementRate}%
              </p>
            </div>

            <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200/30 dark:border-green-800/30">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  총 콘텐츠
                </span>
              </div>
              <p className="text-lg font-semibold text-green-800 dark:text-green-300">
                {contentData ? contentData.length : 0}개
              </p>
            </div>
          </div>

          {/* 성과 비교 섹션 */}
          {topPerformer && worstPerformer && topPerformer !== worstPerformer && (
            <div className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                📊 성과 비교
                {performanceDiff && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {performanceDiff}배 차이
                  </span>
                )}
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {/* 최고 성과 */}
                <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-2 border border-green-200/30 dark:border-green-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">BEST</span>
                  </div>
                  <h5 className="text-xs font-medium text-gray-800 dark:text-white line-clamp-1 mb-1">
                    {topPerformer.title}
                  </h5>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    {selectedPlatform === 'youtube' ? (
                      `${format_number_korean(topPerformer.statistics?.viewCount || 0)} 조회`
                    ) : (
                      `${format_number_korean(topPerformer.upvotes || topPerformer.score || 0)} 업보트`
                    )}
                  </p>
                </div>

                {/* 최저 성과 */}
                <div className="bg-red-50/50 dark:bg-red-950/20 rounded-lg p-2 border border-red-200/30 dark:border-red-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                    <span className="text-xs font-medium text-red-700 dark:text-red-400">WORST</span>
                  </div>
                  <h5 className="text-xs font-medium text-gray-800 dark:text-white line-clamp-1 mb-1">
                    {worstPerformer.title}
                  </h5>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    {selectedPlatform === 'youtube' ? (
                      `${format_number_korean(worstPerformer.statistics?.viewCount || 0)} 조회`
                    ) : (
                      `${format_number_korean(worstPerformer.upvotes || worstPerformer.score || 0)} 업보트`
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default React.memo(PerformanceHighlight);