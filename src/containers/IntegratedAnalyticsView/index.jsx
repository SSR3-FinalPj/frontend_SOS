/**
 * IntegratedAnalyticsView 컴포넌트
 * 통합 분석 뷰 - 플랫폼 간 성과 비교 분석
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Play,
  MessageSquare
} from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import YouTubeIcon from '@/assets/images/button/Youtube_Icon.svg';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';
import { mockCrossPlatformContent } from '@/common/utils/comparison-mock-data';

const IntegratedAnalyticsView = () => {
  const [selectedCrossPlatformContent, setSelectedCrossPlatformContent] = useState(null);

  // 크로스 플랫폼 콘텐츠 선택 처리
  const handleSelectCrossPlatformContent = React.useCallback((content) => {
    setSelectedCrossPlatformContent(content);
  }, []);

  // 크로스 플랫폼 검색 카드 컴포넌트
  const CrossPlatformSearchCard = ({ selectedContent, onSelectContent, allContent }) => {
    const [query, setQuery] = React.useState('');
    const [filteredResults, setFilteredResults] = React.useState([]);

    // 실시간 검색 필터링
    React.useEffect(() => {
      if (query.length < 1) {
        setFilteredResults([]);
        return;
      }

      const results = allContent.filter(content => 
        content.title.toLowerCase().includes(query.toLowerCase()) ||
        content.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // 최대 5개까지만 표시

      setFilteredResults(results);
    }, [query, allContent]);

    // 콘텐츠 선택 처리
    const handleSelectContent = (content) => {
      onSelectContent(content);
      setQuery('');
      setFilteredResults([]);
    };

    // 검색 초기화
    const handleClearSearch = () => {
      setQuery('');
      setFilteredResults([]);
    };

    const formatNumber = (num) => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num?.toLocaleString();
    };


    return (
      <GlassCard className="h-full">
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800/30 rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              콘텐츠 성과 비교하기
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <img src={YouTubeIcon} alt="YouTube" className="w-4 h-4" />
              <span>vs</span>
              <img src={RedditIcon} alt="Reddit" className="w-4 h-4" />
            </div>
          </div>

          {/* 지속적 검색 영역 */}
          <div className="flex-1">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="동일한 제목으로 업로드된 콘텐츠를 검색해보세요..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {query && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* 검색 결과 드롭다운 - 항상 표시 */}
              {query.length >= 1 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((content) => (
                      <button
                        key={content.id}
                        onClick={() => handleSelectContent(content)}
                        className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-lg text-gray-900 dark:text-white">
                              {content.title}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {content.description}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                            {/* YouTube 성과 */}
                            <div className="flex items-start gap-2">
                              <img 
                                src={YouTubeIcon}
                                alt="YouTube"
                                className="w-4 h-4 mt-0.5 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">YouTube 성과</p>
                                <div className="space-y-0.5">
                                  <p className="text-xs text-gray-700 dark:text-gray-300">
                                    {formatNumber(content.youtube.views)} 조회 • {content.youtube.engagement}% 참여율
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {formatNumber(content.youtube.likes)} 좋아요
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Reddit 성과 */}
                            <div className="flex items-start gap-2">
                              <img 
                                src={RedditIcon}
                                alt="Reddit"
                                className="w-4 h-4 mt-0.5 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Reddit 성과</p>
                                <div className="space-y-0.5">
                                  <p className="text-xs text-gray-700 dark:text-gray-300">
                                    {formatNumber(content.reddit.upvotes)} 업보트 • {content.reddit.engagement}% 참여율
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {content.reddit.subreddit}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">검색 결과가 없습니다</p>
                    </div>
                  )}
                </div>
              )}

              {/* 검색 가이드 (검색어가 없을 때) */}
              {!query && (
                <div className="p-6 text-center rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="flex items-center justify-center gap-1">
                      <img src={YouTubeIcon} alt="YouTube" className="w-6 h-6" />
                      <span className="text-gray-500 dark:text-gray-400 text-lg">vs</span>
                      <img src={RedditIcon} alt="Reddit" className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                    동일 콘텐츠 성과 비교
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    같은 제목으로 YouTube와 Reddit에 업로드된 콘텐츠의 성과를 비교해보세요
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 선택된 콘텐츠 요약 */}
          {selectedContent && (
            // 선택된 콘텐츠 미리보기
            <div className="flex-1">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4 mb-4">
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                  {selectedContent.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {selectedContent.description}
                </p>
                
                {/* 플랫폼별 미리보기 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* YouTube */}
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={YouTubeIcon}
                        alt="YouTube"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">YouTube</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {selectedContent.youtube.title}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatNumber(selectedContent.youtube.views)} 조회 • {selectedContent.youtube.engagement}% 참여율
                    </div>
                  </div>
                  
                  {/* Reddit */}
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={RedditIcon}
                        alt="Reddit"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reddit</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {selectedContent.reddit.title}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatNumber(selectedContent.reddit.upvotes)} 업보트 • {selectedContent.reddit.engagement}% 참여율
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </GlassCard>
    );
  };

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

  // 크로스 플랫폼 검색 섹션
  const CrossPlatformSearchSection = () => (
    <div className="mb-8">
      <CrossPlatformSearchCard
        selectedContent={selectedCrossPlatformContent}
        onSelectContent={handleSelectCrossPlatformContent}
        allContent={mockCrossPlatformContent}
      />
      
      {selectedCrossPlatformContent && (
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
                <span className="text-blue-600 dark:text-blue-400 ml-1 font-semibold">{selectedCrossPlatformContent.title}</span>
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              업로드: {new Date(selectedCrossPlatformContent.youtube.publishedAt).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );


  // 성과 요약 UI 컴포넌트 - 크로스 플랫폼 콘텐츠 지원
  const PerformanceSummary = ({ youtubeContent, redditContent, title }) => {
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
            {title} - 플랫폼별 성과 비교
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            동일 콘텐츠를 YouTube와 Reddit에 업로드하여 어느 플랫폼에서 더 좋은 성과를 거두었는지 비교합니다
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
      {/* 크로스 플랫폼 검색 섹션 */}
      <CrossPlatformSearchSection />
      
      {/* 비교 결과 섹션 - 콘텐츠 선택 시에만 표시 */}
      {selectedCrossPlatformContent && (
        <div className="space-y-8">
          {/* 성과 요약 */}
          <PerformanceSummary 
            youtubeContent={selectedCrossPlatformContent.youtube} 
            redditContent={selectedCrossPlatformContent.reddit}
            title={selectedCrossPlatformContent.title}
          />
          
          {/* 세부 비교 테이블 */}
          <DetailedComparison 
            youtubeContent={selectedCrossPlatformContent.youtube}
            redditContent={selectedCrossPlatformContent.reddit}
          />
        </div>
      )}
    </div>
  );
};

export default IntegratedAnalyticsView;