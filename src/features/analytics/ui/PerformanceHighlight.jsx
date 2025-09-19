import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Eye, Heart, GitCompareArrows } from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import { format_number_korean } from '@/domain/dashboard/logic/dashboard-utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PerformanceHighlight = ({ contentData, summaryData, selectedPlatform }) => {
  // 데이터 처리 로직
  const { topPerformer, worstPerformer } = React.useMemo(() => {
    if (!contentData || !Array.isArray(contentData) || contentData.length === 0) {
      return { topPerformer: null, worstPerformer: null };
    }
    if (contentData.length < 2) {
      return { topPerformer: contentData[0], worstPerformer: null };
    }
    const sorted = [...contentData].sort((a, b) => {
      const valA = selectedPlatform === 'youtube' ? (a.statistics?.viewCount || 0) : (a.upvotes || a.score || 0);
      const valB = selectedPlatform === 'youtube' ? (b.statistics?.viewCount || 0) : (b.upvotes || b.score || 0);
      return valB - valA;
    });
    return { topPerformer: sorted[0], worstPerformer: sorted[sorted.length - 1] };
  }, [contentData, selectedPlatform]);

  const engagementRate = React.useMemo(() => {
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
  }, [summaryData, selectedPlatform]);

  // 차트 데이터 준비 (BEST vs WORST)
  const chartData = React.useMemo(() => {
    if (!topPerformer || !worstPerformer || topPerformer === worstPerformer) return [];
    const topValue = selectedPlatform === 'youtube' ? (topPerformer.statistics?.viewCount || 0) : (topPerformer.upvotes || topPerformer.score || 0);
    const worstValue = selectedPlatform === 'youtube' ? (worstPerformer.statistics?.viewCount || 0) : (worstPerformer.upvotes || worstPerformer.score || 0);

    return [
      { name: topPerformer.title, value: topValue, color: '#22c55e' },
      { name: worstPerformer.title, value: worstValue, color: '#ef4444' },
    ];
  }, [topPerformer, worstPerformer, selectedPlatform]);

  // 썸네일 URL 추출
  const thumbnailUrl = React.useMemo(() => {
    if (!topPerformer) return null;

    if (selectedPlatform === 'youtube') {
      return topPerformer.thumbnail;
    }

    if (selectedPlatform === 'reddit') {
      if (topPerformer.url && topPerformer.url.includes('preview.redd.it')) {
        return topPerformer.url;
      }
      if (topPerformer.rd_video_url) {
        return topPerformer.rd_video_url; // 썸네일 대신 영상 미리보기
      }
    }

    return null;
  }, [topPerformer, selectedPlatform]);

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 text-xs bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-md border border-gray-300/50 dark:border-gray-700/50 shadow-lg">
          <p className="font-bold text-gray-800 dark:text-gray-200 truncate max-w-xs">{payload[0].payload.name}</p>
          <p className="text-gray-600 dark:text-gray-400">{`${selectedPlatform === 'youtube' ? '조회수' : '업보트'}: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  // Y축 라벨 포맷터
  const formatYAxisTick = (tick) => {
    const limit = 12;
    if (tick.length > limit) {
      return `${tick.substring(0, limit)}...`;
    }
    return tick;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
      <GlassCard className="p-6 min-h-[400px] flex flex-col" hover={false}>
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-5 flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">성과 하이라이트</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">주요 성과 지표와 최고 콘텐츠</p>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-col space-y-4">
          {/* Top 콘텐츠 */}
          {topPerformer ? (
            <div className="relative p-3 rounded-xl bg-gradient-to-r from-yellow-100/50 to-orange-100/50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/50 dark:border-yellow-800/50 flex gap-4 items-center">
              {thumbnailUrl ? (
                <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0">
                  {selectedPlatform === "reddit" ? (
                    topPerformer.rd_video_url ? (
                      <video
                        src={topPerformer.rd_video_url}
                        className="w-full h-full object-cover"
                        playsInline
                        preload="metadata"
                        muted
                        controls={false}
                        crossOrigin="anonymous"
                      />
                    ) : topPerformer.url?.includes("i.redd.it") || topPerformer.url?.includes("preview.redd.it") ? (
                      <img
                        src={topPerformer.url}
                        alt={topPerformer.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-xs text-gray-600">
                        No Thumbnail
                      </div>
                    )
                  ) : (
                    <img
                      src={topPerformer.thumbnail}
                      alt={topPerformer.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
              )}

              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">🏆 TOP CONTENT</span>
                <h4 className="text-base font-bold text-gray-800 dark:text-white truncate mt-1">{topPerformer.title}</h4>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className={`flex items-center gap-1.5 text-lg font-bold ${selectedPlatform === 'youtube' ? 'text-red-500' : 'text-orange-500'}`}>
                  {selectedPlatform === 'youtube' ? <Eye className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  <span>
                    {format_number_korean(
                      selectedPlatform === 'youtube'
                        ? topPerformer.statistics?.viewCount || 0
                        : topPerformer.upvotes || topPerformer.score || 0
                    )}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPlatform === 'youtube' ? '조회수' : '업보트'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30 h-24">
              <p className="text-sm text-gray-600 dark:text-gray-400">콘텐츠 데이터가 없습니다.</p>
            </div>
          )}

          {/* 성과 지표 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-primary-100/50 dark:bg-brand-primary-950/20 rounded-lg p-3 border border-brand-primary-200/30 dark:border-brand-primary-800/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-brand-primary-600 dark:text-brand-primary-400" />
                <span className="text-xs font-medium text-brand-primary-700 dark:text-brand-primary-400">참여율</span>
              </div>
              <p className="text-lg font-semibold text-brand-primary-800 dark:text-brand-primary-300">{engagementRate}%</p>
            </div>
            <div className="bg-brand-primary-50/50 dark:bg-brand-primary-900/20 rounded-lg p-3 border border-brand-primary-200/30 dark:border-brand-primary-700/30">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-brand-primary-500 dark:text-brand-primary-400" />
                <span className="text-xs font-medium text-brand-primary-600 dark:text-brand-primary-400">총 콘텐츠</span>
              </div>
              <p className="text-lg font-semibold text-brand-primary-700 dark:text-brand-primary-300">{contentData ? contentData.length : 0}개</p>
            </div>
          </div>

          {/* 성과 비교 차트 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <GitCompareArrows className="w-4 h-4" />
              최고 vs 최저 성과 비교
            </h4>
            <div className="w-full h-24">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tickFormatter={formatYAxisTick} tick={{ fill: 'currentColor', fontSize: 12 }} width={80} />
                    <Tooltip cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-500">비교할 데이터가 부족합니다.</div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default PerformanceHighlight;
