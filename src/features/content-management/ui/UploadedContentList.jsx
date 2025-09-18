import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, Heart, MessageSquare, VideoOff, TrendingUp, Star, Filter, ChevronDown } from 'lucide-react';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';
import GlassCard from '@/common/ui/glass-card';

const UploadedContentList = ({ contentData = [], startDate, endDate, onVideoCardClick, selectedPlatform }) => {
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // ✅ 상위에서 내려준 contentData를 정렬해서 사용
  useEffect(() => {
    if (!Array.isArray(contentData)) {
      setItems([]);
      return;
    }
    setItems(sortItems(contentData, sortBy));
  }, [contentData, sortBy]);

  // 정렬 함수
  const sortItems = (itemsToSort, sortType) => {
    if (!itemsToSort || !Array.isArray(itemsToSort)) return [];

    const sorted = [...itemsToSort].sort((a, b) => {
      switch (sortType) {
        case 'views':
          return selectedPlatform === 'youtube'
            ? ((b.statistics?.viewCount ?? b.viewCount ?? 0) - (a.statistics?.viewCount ?? a.viewCount ?? 0))
            : ((b.upvote || b.score || 0) - (a.upvote || a.score || 0));
        case 'likes':
          return selectedPlatform === 'youtube'
            ? ((b.statistics?.likeCount ?? b.likeCount ?? 0) - (a.statistics?.likeCount ?? a.likeCount ?? 0))
            : ((b.upvote || 0) - (a.upvote || 0));
        case 'comments':
          return selectedPlatform === 'youtube'
            ? ((b.statistics?.commentCount ?? b.commentCount ?? 0) - (a.statistics?.commentCount ?? a.commentCount ?? 0))
            : ((b.comment_count || 0) - (a.comment_count || 0));
        case 'oldest':
          return selectedPlatform === 'youtube'
            ? new Date(a.publishedAt || a.published_at) - new Date(b.publishedAt || b.published_at)
            : new Date(a.upload_date + 'T00:00:00') - new Date(b.upload_date + 'T00:00:00');
        case 'latest':
        default:
          return selectedPlatform === 'youtube'
            ? new Date(b.publishedAt || b.published_at) - new Date(a.publishedAt || a.published_at)
            : new Date(b.upload_date + 'T00:00:00') - new Date(a.upload_date + 'T00:00:00');
      }
    });
    return sorted;
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
    setItems(sortItems(items, newSortBy));
  };

  const youtubeSortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'views', label: '조회수순' },
    { value: 'likes', label: '좋아요순' },
    { value: 'comments', label: '댓글순' },
  ];

  const redditSortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'likes', label: '업보트순' },
    { value: 'comments', label: '댓글순' },
  ];

  const sortOptions = selectedPlatform === 'youtube' ? youtubeSortOptions : redditSortOptions;

  const renderContent = () => {
    if (!items || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-400 p-8">
          <VideoOff className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="font-semibold">해당 기간에 업로드된 콘텐츠가 없습니다.</h4>
          <p className="text-sm">다른 기간을 선택해주세요.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 overflow-y-auto max-h-[280px] min-h-48 custom-scrollbar pr-2">
        {items.map((content, index) => (
          <div
            key={content.videoId || content.video_id || content.post_id || index}
            className="flex items-center gap-4 p-3 bg-gray-100/80 dark:bg-white/5 border border-gray-300/40 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-200/60 dark:hover:bg-white/10 transition-colors duration-200"
            onClick={() => {
              if (selectedPlatform === 'youtube') {
                onVideoCardClick({
                  contentId: content.videoId || content.video_id || content.id,
                  title: content.title,
                  platform: 'youtube',
                });
              } else {
                onVideoCardClick({
                  contentId: content.post_id,
                  title: content.title,
                  platform: 'reddit',
                });
              }
            }}
          >
            {/* 순번 */}
            <div className="flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md
                ${
                  selectedPlatform === 'youtube'
                    ? content.statistics?.viewCount > 1000
                      ? 'bg-green-500'
                      : content.statistics?.viewCount > 100
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                    : content.upvote > 50
                    ? 'bg-green-500'
                    : content.upvote > 10
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
                }`}
              >
                {index + 1}
              </div>
            </div>

            {/* 썸네일 */}
            <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {selectedPlatform === 'youtube' ? (
                <img src={content.thumbnail || content.thumbnailUrl || content.thumbnail_url} alt={content.title} className="w-full h-full object-cover" />
              ) : content.url && content.url.includes('preview.redd.it') ? (
                <img src={content.url} alt={content.title} className="w-full h-full object-cover" />
              ) : content.rd_video_url ? (
                <video src={content.rd_video_url} className="w-full h-full object-cover" playsInline preload="metadata" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-orange-500/20 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 p-2 text-center">
                  <img src={RedditIcon} alt="Reddit Icon" className="w-6 h-6 mb-1" />
                  <span className="font-semibold text-[0.6rem] line-clamp-2">{content.sub_reddit}</span>
                </div>
              )}
            </div>

            {/* 본문 */}
            <div className="flex-1 min-w-0">
              {/* 제목 강조 */}
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {content.title}
              </h4>

              {/* 조회수/좋아요/댓글 → 서브 정보 */}
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                {selectedPlatform === 'youtube' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gray-400" />
                      <span>{Number((content.statistics?.viewCount ?? content.viewCount ?? 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-gray-400" />
                      <span>{Number((content.statistics?.likeCount ?? content.likeCount ?? 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-gray-400" />
                      <span>{Number((content.statistics?.commentCount ?? content.commentCount ?? 0)).toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-gray-400" />
                      <span>{Number(content.upvote || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-gray-400" />
                      <span>{Number(content.comment_count || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-gray-400" />
                      <span>{Number(content.score || 0).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>


            {/* 날짜 */}
            <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 ml-auto">
              {selectedPlatform === 'youtube'
                ? new Date(content.publishedAt || content.published_at).toLocaleDateString('ko-KR')
                : new Date(content.upload_date + 'T00:00:00').toLocaleDateString('ko-KR')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <GlassCard className="p-6 min-h-[400px]" hover={false}>
        {/* 헤더 */}
        <motion.div
          className="flex items-center gap-4 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-green-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">업로드된 콘텐츠</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              선택한 기간 내 업로드된 {selectedPlatform === 'youtube' ? '영상' : '포스트'} 목록
            </p>
          </div>

          {/* 색상 기준 */}
          <div className="flex gap-3 text-xs">
            {selectedPlatform === 'youtube' ? (
              <>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500 font-semibold">{'≤100'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-yellow-500" />
                  <span className="text-yellow-600 font-semibold">{'≤1000'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-green-500" />
                  <span className="text-green-600 font-semibold">{'<1000'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500 font-semibold">{'≤10'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-yellow-500" />
                  <span className="text-yellow-600 font-semibold">{'≤50'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-600 font-semibold">{'<50'}</span>
                </div>
              </>
            )}
          </div>

          {/* 정렬 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Filter className="w-3 h-3" />
              <span>{sortOptions.find((opt) => opt.value === sortBy)?.label || '정렬'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${sortBy === option.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                      } ${option.value === sortOptions[0].value ? 'rounded-t-lg' : ''} ${option.value === sortOptions[sortOptions.length - 1].value ? 'rounded-b-lg' : ''
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* 콘텐츠 */}
        {renderContent()}
      </GlassCard>
    </motion.div>
  );
};

export default UploadedContentList;
