/**
 * AnalyticsView 블록
 * 분석 페이지의 메인 콘텐츠를 담당하는 상세 분석 대시보드
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  Play,
  Clock,
  Loader2
} from 'lucide-react';

// Store and API imports
import { useAnalyticsStore } from '../../domain/analytics/model/store.js';

// Component imports
import AudienceDemographicsChart from '../../common/ui/AudienceDemographicsChart.jsx';
import TrafficSourceChart from '../../common/ui/TrafficSourceChart.jsx';
import GlassCard from '../../common/ui/glass-card.jsx';
import VideoAnalysisModal from '../../common/ui/VideoAnalysisModal.jsx';

// Utils and constants
import { mockContentData } from '../../common/utils/mockData.js';
import { formatNumber, formatDate } from '../../common/utils/format-utils.js';

/**
 * KPI Card 컴포넌트
 */
const KPICard = ({ icon: Icon, title, value, change, color, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <GlassCard className="p-6" hover={true}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
            {isLoading ? (
              <div className="flex items-center gap-2 mt-1">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">로딩 중...</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(value)}</p>
                {change && (
                  <div className={`flex items-center gap-1 mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
                    <span className="text-xs font-medium">{change > 0 ? '+' : ''}{change}%</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

/**
 * 최신 콘텐츠 아이템 컴포넌트
 */
const ContentItem = ({ content, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="cursor-pointer"
    onClick={() => onClick(content.videoId || content.id, content.title)}
  >
    <GlassCard className="p-4" hover={true}>
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <img 
            src={content.thumbnailUrl || content.thumbnail || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop"} 
            alt={content.title}
            className="w-20 h-14 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">
            {content.title}
          </h4>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(content.viewCount || content.views || 0)}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatNumber(content.likeCount || content.likes || 0)}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {formatNumber(content.commentCount || content.comments || 0)}
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            {formatDate(content.publishedAt || content.uploadDate)}
          </div>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

/**
 * AnalyticsView 컴포넌트
 * 상세 분석 대시보드 - KPI, 차트, 콘텐츠 목록 포함
 */
const AnalyticsView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');

  const { 
    summaryData, 
    isLoading, 
    error,
    fetchSummaryData 
  } = useAnalyticsStore();

  // 컴포넌트 마운트시 데이터 fetch
  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  useEffect(() => {
    const videoIdFromUrl = searchParams.get('videoId');
    if (videoIdFromUrl) {
      // API 데이터에서 영상 찾기
      let video = null;
      if (summaryData?.videos?.length > 0) {
        video = summaryData.videos.find(item => (item.videoId || item.id).toString() === videoIdFromUrl);
      }
      // Fallback to mock data
      if (!video) {
        video = mockContentData.find(item => item.id.toString() === videoIdFromUrl);
      }
      
      setSelectedVideoId(videoIdFromUrl);
      setSelectedVideoTitle(video ? video.title : `Video ${videoIdFromUrl}`);
    } else {
      setSelectedVideoId(null);
      setSelectedVideoTitle('');
    }
  }, [searchParams, summaryData]);

  const handleCloseModal = () => {
    setSelectedVideoId(null);
    setSelectedVideoTitle('');
    searchParams.delete('videoId');
    setSearchParams(searchParams);
  };

  const handleOpenAnalysisModal = (id, title) => {
    setSelectedVideoId(id.toString());
    setSelectedVideoTitle(title);
    searchParams.set('videoId', id.toString());
    setSearchParams(searchParams);
  };

  // 사용할 콘텐츠 데이터 결정
  const contentData = summaryData?.videos?.length > 0 ? summaryData.videos : mockContentData;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            분석 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            채널의 성과를 상세히 분석해보세요
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          icon={Eye}
          title="총 조회수"
          value={summaryData?.totalViews || 0}
          change={summaryData?.viewsChange}
          color="from-blue-500/30 to-cyan-500/30"
          isLoading={isLoading}
        />
        <KPICard
          icon={Heart}
          title="총 좋아요"
          value={summaryData?.totalLikes || 0}
          change={summaryData?.likesChange}
          color="from-red-500/30 to-pink-500/30"
          isLoading={isLoading}
        />
        <KPICard
          icon={MessageCircle}
          title="총 댓글"
          value={summaryData?.totalComments || 0}
          change={summaryData?.commentsChange}
          color="from-green-500/30 to-emerald-500/30"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AudienceDemographicsChart />
        <TrafficSourceChart />
      </div>

      {/* Latest Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            최신 콘텐츠
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {contentData.length}개 영상
          </span>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-4">
          {contentData.slice(0, 10).map((content, index) => (
            <motion.div
              key={content.videoId || content.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
            >
              <ContentItem 
                content={content} 
                onClick={handleOpenAnalysisModal}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Video Analysis Modal */}
      <VideoAnalysisModal
        videoId={selectedVideoId}
        title={selectedVideoTitle}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AnalyticsView;