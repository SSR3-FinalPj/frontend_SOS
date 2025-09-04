/**
 * PlatformSearchCard 컴포넌트
 * 개별 플랫폼(YouTube/Reddit) 검색 트리거 카드
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Eye,
  ThumbsUp,
  TrendingUp,
  Calendar,
  MessageSquare
} from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';
import YouTubeIcon from '@/assets/images/button/Youtube_Icon.svg';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';

const PlatformSearchCard = ({ 
  platform,
  selectedContent,
  onSelectContent,
  allContent = []
}) => {
  const [isSearching, setIsSearching] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [filteredResults, setFilteredResults] = React.useState([]);

  // 실시간 검색 필터링
  React.useEffect(() => {
    if (query.length < 2) {
      setFilteredResults([]);
      return;
    }

    const results = allContent.filter(content => 
      content.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // 최대 5개까지만 표시

    setFilteredResults(results);
  }, [query, allContent]);

  // 검색 시작 처리
  const handleStartSearch = () => {
    setIsSearching(true);
    setQuery('');
    setFilteredResults([]);
  };

  // 콘텐츠 선택 처리
  const handleSelectContent = (content) => {
    onSelectContent(content);
    setIsSearching(false);
    setQuery('');
    setFilteredResults([]);
  };

  // 검색 취소 처리
  const handleCancelSearch = () => {
    setIsSearching(false);
    setQuery('');
    setFilteredResults([]);
  };

  const platformConfig = {
    youtube: {
      name: 'YouTube',
      icon: YouTubeIcon,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800/30',
      iconColor: 'text-red-500',
      textColor: 'text-red-700 dark:text-red-400',
      placeholder: 'YouTube 영상을 검색해보세요...'
    },
    reddit: {
      name: 'Reddit',
      icon: RedditIcon,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800/30',
      iconColor: 'text-orange-500',
      textColor: 'text-orange-700 dark:text-orange-400',
      placeholder: 'Reddit 포스트를 검색해보세요...'
    },
    left: {
      name: '콘텐츠 A',
      icon: null,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800/30',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-700 dark:text-blue-400',
      placeholder: '비교할 첫 번째 콘텐츠를 검색하세요...'
    },
    right: {
      name: '콘텐츠 B',
      icon: null,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800/30',
      iconColor: 'text-purple-500',
      textColor: 'text-purple-700 dark:text-purple-400',
      placeholder: '비교할 두 번째 콘텐츠를 검색하세요...'
    }
  };

  const config = platformConfig[platform];

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toLocaleString();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <GlassCard className="h-full">
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center`}>
            {config.icon ? (
              <img 
                src={config.icon} 
                alt={`${config.name} icon`} 
                className="w-4 h-4" 
              />
            ) : selectedContent ? (
              <img 
                src={selectedContent.platform === 'youtube' ? YouTubeIcon : RedditIcon} 
                alt={`${selectedContent.platform} icon`} 
                className="w-4 h-4" 
              />
            ) : (
              <Search className={`w-4 h-4 ${config.iconColor}`} />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {selectedContent ? (
              <span className="capitalize">{selectedContent.platform}</span>
            ) : (
              config.name
            )}
          </h3>
        </div>

        {/* 검색 영역 */}
        {!selectedContent ? (
          <div className="flex-1">
            {!isSearching ? (
              <motion.button
                onClick={handleStartSearch}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                    <Search className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                      {config.name} 검색
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {config.placeholder}
                    </p>
                  </div>
                </div>
              </motion.button>
            ) : (
              // 검색 입력 필드와 드롭다운
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder={config.placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    autoFocus
                  />
                  <button
                    onClick={handleCancelSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* 검색 결과 드롭다운 */}
                {query.length >= 2 && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((content) => (
                        <button
                          key={content.id}
                          onClick={() => handleSelectContent(content)}
                          className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-start gap-2">
                            <img 
                              src={content.platform === 'youtube' ? YouTubeIcon : RedditIcon} 
                              alt={`${content.platform} icon`} 
                              className="w-4 h-4 mt-0.5 flex-shrink-0" 
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                                {content.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="capitalize">{content.platform}</span>
                                <span>•</span>
                                {content.platform === 'youtube' ? (
                                  <span>{formatNumber(content.views)} 조회</span>
                                ) : (
                                  <span>{formatNumber(content.upvotes)} 업보트</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">검색 결과가 없습니다</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // 선택된 콘텐츠 미리보기
          <div className="flex-1">
            <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 mb-4`}>
              <h4 className="font-medium text-gray-800 dark:text-white mb-3 line-clamp-2">
                {selectedContent.title}
              </h4>
              
              {/* 플랫폼별 메타데이터 */}
              <div className="space-y-2 text-sm">
                {platform === 'youtube' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">조회수</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {formatNumber(selectedContent.views)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">좋아요</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {formatNumber(selectedContent.likes)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">참여율</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {selectedContent.engagement}%
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">업보트</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {formatNumber(selectedContent.upvotes)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">댓글</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {selectedContent.comments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 text-xs font-bold text-gray-500">r/</span>
                        <span className="text-gray-600 dark:text-gray-400">서브레딧</span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white text-xs">
                        {selectedContent.subreddit}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">게시일</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {formatDate(selectedContent.publishedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* 다시 검색 버튼 */}
            <motion.button
              onClick={handleStartSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 ${config.bgColor} hover:brightness-105 ${config.borderColor} border rounded-lg transition-all duration-200 group`}
            >
              <div className="flex items-center justify-center gap-2">
                <Search className={`w-4 h-4 ${config.iconColor}`} />
                <span className={`text-sm font-medium ${config.textColor}`}>
                  다른 콘텐츠 검색
                </span>
              </div>
            </motion.button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default PlatformSearchCard;