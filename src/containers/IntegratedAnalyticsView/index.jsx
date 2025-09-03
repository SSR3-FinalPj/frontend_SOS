/**
 * IntegratedAnalyticsView 컴포넌트
 * 통합 분석 뷰 - 플랫폼 간 성과 비교 분석
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Play, 
  MessageSquare,
  Calendar,
  Eye,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import PlatformSearchCard from '@/features/platform-search/ui/PlatformSearchCard';
import PlatformSearchModal from '@/features/platform-search/ui/PlatformSearchModal';

const IntegratedAnalyticsView = () => {
  const [selectedYouTube, setSelectedYouTube] = useState(null);
  const [selectedReddit, setSelectedReddit] = useState(null);
  const [isYouTubeSearchOpen, setYouTubeSearchOpen] = useState(false);
  const [isRedditSearchOpen, setRedditSearchOpen] = useState(false);

  // Mock 데이터: 개별 플랫폼 콘텐츠 목록
  const mockYouTubeContent = [
    {
      id: 'yt1',
      title: 'AI 기술의 미래와 현실',
      videoId: 'abc123',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 24500,
      likes: 1200,
      comments: 234,
      engagement: 5.2,
      publishedAt: '2024-01-15',
      duration: '12:34'
    },
    {
      id: 'yt2',
      title: '최신 프로그래밍 트렌드 2024',
      videoId: 'def456',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 18200,
      likes: 892,
      comments: 145,
      engagement: 6.1,
      publishedAt: '2024-02-01',
      duration: '8:45'
    },
    {
      id: 'yt3',
      title: '개발자를 위한 효율적인 워크플로우',
      videoId: 'ghi789',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 31000,
      likes: 1850,
      comments: 267,
      engagement: 7.3,
      publishedAt: '2024-01-28',
      duration: '15:22'
    },
    {
      id: 'yt4',
      title: '리액트 훅 완벽 가이드',
      videoId: 'jkl012',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 42300,
      likes: 2100,
      comments: 189,
      engagement: 8.1,
      publishedAt: '2024-02-15',
      duration: '20:10'
    }
  ];

  const mockRedditContent = [
    {
      id: 'rd1',
      title: 'AI 기술에 대한 사회적 논의',
      postId: 'r/technology_post1',
      subreddit: 'r/technology',
      upvotes: 3100,
      comments: 156,
      score: 258,
      engagement: 8.3,
      publishedAt: '2024-01-16',
      author: 'tech_enthusiast_42'
    },
    {
      id: 'rd2',
      title: '프로그래밍 커리어 전환 후기',
      postId: 'r/programming_post2',
      subreddit: 'r/programming',
      upvotes: 2400,
      comments: 89,
      score: 195,
      engagement: 7.8,
      publishedAt: '2024-02-02',
      author: 'code_switcher'
    },
    {
      id: 'rd3',
      title: '웹개발 워크플로우 추천',
      postId: 'r/webdev_post3',
      subreddit: 'r/webdev',
      upvotes: 4200,
      comments: 198,
      score: 342,
      engagement: 9.1,
      publishedAt: '2024-01-29',
      author: 'frontend_guru'
    },
    {
      id: 'rd4',
      title: '리액트 vs Vue 비교 분석',
      postId: 'r/javascript_debate',
      subreddit: 'r/javascript',
      upvotes: 1850,
      comments: 245,
      score: 178,
      engagement: 6.4,
      publishedAt: '2024-02-12',
      author: 'js_debater'
    }
  ];

  // 개별 플랫폼 콘텐츠 선택 처리
  const handleSelectYouTube = React.useCallback((content) => {
    setSelectedYouTube(content);
  }, []);

  const handleSelectReddit = React.useCallback((content) => {
    setSelectedReddit(content);
  }, []);

  // ComparisonRow 컴포넌트
  const ComparisonRow = ({ youtubeValue, redditValue, metricName, unit = '', isPercentage = false }) => {
    const formatValue = (value) => {
      if (typeof value === 'number') {
        if (isPercentage) {
          return `${value.toFixed(1)}%`;
        }
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toLocaleString();
      }
      return value;
    };

    const calculateDelta = () => {
      if (typeof youtubeValue !== 'number' || typeof redditValue !== 'number') {
        return { value: 0, display: '0', isPositive: true };
      }

      const difference = youtubeValue - redditValue;
      const percentDiff = redditValue !== 0 ? (difference / redditValue) * 100 : 0;
      
      if (isPercentage) {
        return {
          value: difference,
          display: `${difference >= 0 ? '+' : ''}${difference.toFixed(1)}%p`,
          isPositive: difference >= 0
        };
      } else {
        return {
          value: difference,
          display: `${percentDiff >= 0 ? '+' : ''}${percentDiff.toFixed(1)}%`,
          isPositive: difference >= 0
        };
      }
    };

    const delta = calculateDelta();
    const youtubeBetter = typeof youtubeValue === 'number' && typeof redditValue === 'number' && youtubeValue > redditValue;
    const redditBetter = typeof youtubeValue === 'number' && typeof redditValue === 'number' && redditValue > youtubeValue;

    return (
      <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        {/* YouTube 값 */}
        <div className={`text-right px-4 py-2 rounded-lg transition-colors ${
          youtubeBetter 
            ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 font-semibold text-red-700 dark:text-red-400' 
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          <div className="text-lg">{formatValue(youtubeValue)}{unit}</div>
        </div>

        {/* 지표명 및 차이 값 */}
        <div className="text-center">
          <div className="font-medium text-gray-800 dark:text-white mb-1">
            {metricName}
          </div>
          <div className={`text-sm font-medium ${
            delta.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {delta.display}
          </div>
        </div>

        {/* Reddit 값 */}
        <div className={`text-left px-4 py-2 rounded-lg transition-colors ${
          redditBetter 
            ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 font-semibold text-orange-700 dark:text-orange-400' 
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          <div className="text-lg">{formatValue(redditValue)}{unit}</div>
        </div>
      </div>
    );
  };

  // 듀얼 플랫폼 검색 섹션
  const DualSearchSection = () => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          콘텐츠 선택
        </h3>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlatformSearchCard
          platform="youtube"
          selectedContent={selectedYouTube}
          onOpenSearch={() => setYouTubeSearchOpen(true)}
        />
        <PlatformSearchCard
          platform="reddit"
          selectedContent={selectedReddit}
          onOpenSearch={() => setRedditSearchOpen(true)}
        />
      </div>
      
      {(selectedYouTube || selectedReddit) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                선택된 콘텐츠: 
                {selectedYouTube && <span className="text-red-600 dark:text-red-400 ml-1">YouTube</span>}
                {selectedYouTube && selectedReddit && <span className="text-gray-500 mx-1">+</span>}
                {selectedReddit && <span className="text-orange-600 dark:text-orange-400 ml-1">Reddit</span>}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {(selectedYouTube ? 1 : 0) + (selectedReddit ? 1 : 0)}/2 플랫폼 선택됨
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  // EmptyState 컴포넌트
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <GlassCard className="text-center max-w-lg mx-auto">
        <div className="mb-6">
          <Search className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            콘텐츠 성과 비교 시작하기
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            상단의 검색창을 이용해 비교하고 싶은 콘텐츠를 찾아보세요
          </p>
        </div>
        <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <Play className="w-4 h-4 text-red-500" />
            <span>YouTube 영상</span>
            <span>vs</span>
            <MessageSquare className="w-4 h-4 text-orange-500" />
            <span>Reddit 포스트</span>
          </div>
          <p>두 플랫폼의 성과를 한눈에 비교할 수 있습니다</p>
        </div>
      </GlassCard>
    </motion.div>
  );

  // 성과 요약 UI 컴포넌트 - 개별 플랫폼 지원
  const PerformanceSummary = ({ youtubeContent, redditContent }) => {
    const formatNumber = (num) => {
      if (!num) return '-';
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toLocaleString();
    };

    return (
      <GlassCard>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            선택된 콘텐츠 비교
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {youtubeContent && redditContent 
              ? '두 플랫폼 간 성과 비교'
              : '개별 플랫폼 성과 분석'
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* YouTube 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {youtubeContent ? (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Play className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-gray-800 dark:text-white">YouTube</h4>
                </div>
                
                <h5 className="font-medium text-sm text-gray-800 dark:text-white mb-3 line-clamp-2">
                  {youtubeContent.title}
                </h5>
                
                {/* YouTube 썸네일 */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={youtubeContent.thumbnail} 
                    alt={youtubeContent.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQuMjUgNzVMMTc1Ljc1IDkyLjVMMTQ0LjI1IDExMFY3NVoiIGZpbGw9IiNFRjQ0NDQiLz4KPC9zdmc+';
                    }}
                  />
                </div>
                
                {/* YouTube 주요 지표 */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {formatNumber(youtubeContent.views)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">조회수</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {formatNumber(youtubeContent.likes)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">좋아요</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {youtubeContent.comments || '-'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">댓글</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {youtubeContent.engagement || '-'}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">참여율</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">YouTube 콘텐츠</h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">선택되지 않음</p>
              </div>
            )}
          </motion.div>

          {/* Reddit 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            {redditContent ? (
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-gray-800 dark:text-white">Reddit</h4>
                </div>
                
                <h5 className="font-medium text-sm text-gray-800 dark:text-white mb-3 line-clamp-2">
                  {redditContent.title}
                </h5>
                
                {/* Reddit 플레이스홀더 (썸네일 없음) */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-orange-500" />
                    <p className="text-xs">{redditContent.subreddit}</p>
                  </div>
                </div>
                
                {/* Reddit 주요 지표 */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {formatNumber(redditContent.upvotes)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">업보트</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {redditContent.comments || '-'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">댓글</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {redditContent.score || '-'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">점수</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800 dark:text-white">
                      {redditContent.engagement || '-'}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">참여율</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-orange-500" />
                </div>
                <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Reddit 콘텐츠</h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">선택되지 않음</p>
              </div>
            )}
          </motion.div>
        </div>
      </GlassCard>
    );
  };

  // 세부 비교 테이블 컴포넌트 - 개별 플랫폼 지원
  const DetailedComparison = ({ youtubeContent, redditContent }) => {
    // 둘 다 선택되지 않은 경우 테이블을 보여주지 않음
    if (!youtubeContent && !redditContent) {
      return null;
    }

    return (
      <GlassCard>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            세부 지표 비교
          </h3>
          
          {/* 헤더 */}
          <div className="grid grid-cols-3 gap-4 py-3 border-b-2 border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Play className={`w-4 h-4 ${youtubeContent ? 'text-red-500' : 'text-gray-400'}`} />
                <span className={youtubeContent ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}>
                  YouTube
                </span>
              </div>
            </div>
            <div className="text-center">지표명</div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <MessageSquare className={`w-4 h-4 ${redditContent ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className={redditContent ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}>
                  Reddit
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <ComparisonRow 
            youtubeValue={youtubeContent?.engagement} 
            redditValue={redditContent?.engagement} 
            metricName="참여율" 
            unit="%" 
            isPercentage={true}
          />
          <ComparisonRow 
            youtubeValue={youtubeContent?.views} 
            redditValue={redditContent?.upvotes} 
            metricName="조회수 / 업보트" 
          />
          <ComparisonRow 
            youtubeValue={youtubeContent?.comments} 
            redditValue={redditContent?.comments} 
            metricName="댓글 수" 
          />
          <ComparisonRow 
            youtubeValue={youtubeContent?.likes} 
            redditValue={redditContent?.score} 
            metricName="좋아요 / 점수" 
          />
          {youtubeContent && redditContent && (
            <ComparisonRow 
              youtubeValue={new Date(youtubeContent.publishedAt).getTime()} 
              redditValue={new Date(redditContent.publishedAt).getTime()} 
              metricName="게시일"
            />
          )}
        </div>
        
        {(!youtubeContent || !redditContent) && (
          <div className="mt-4 p-3 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-400 text-center">
              한 쪽 플랫폼만 선택된 상태입니다. 전체 비교를 위해 다른 플랫폼도 선택해보세요.
            </p>
          </div>
        )}
      </GlassCard>
    );
  };

  return (
    <div className="space-y-8">
      {/* 듀얼 검색 섹션 */}
      <DualSearchSection />
      
      {/* YouTube 검색 모달 */}
      <PlatformSearchModal
        isOpen={isYouTubeSearchOpen}
        onClose={() => setYouTubeSearchOpen(false)}
        onSelectContent={handleSelectYouTube}
        contentList={mockYouTubeContent}
        platform="youtube"
      />
      
      {/* Reddit 검색 모달 */}
      <PlatformSearchModal
        isOpen={isRedditSearchOpen}
        onClose={() => setRedditSearchOpen(false)}
        onSelectContent={handleSelectReddit}
        contentList={mockRedditContent}
        platform="reddit"
      />
      
      {!selectedYouTube && !selectedReddit ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {/* 성과 요약 */}
          <PerformanceSummary 
            youtubeContent={selectedYouTube} 
            redditContent={selectedReddit} 
          />
          
          {/* 세부 비교 테이블 */}
          <DetailedComparison 
            youtubeContent={selectedYouTube}
            redditContent={selectedReddit}
          />
        </div>
      )}
    </div>
  );
};

export default IntegratedAnalyticsView;