import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, Heart, MessageSquare, VideoOff, TrendingUp, Star, Clock, Filter, ChevronDown } from 'lucide-react';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';
import {
  getYouTubeChannelId,
  getYouTubeVideosByChannelId,
  getRedditChannelInfo,
  getRedditUploadsByRange
} from '@/common/api/api';
import GlassCard from '@/common/ui/glass-card';

const UploadedContentList = ({ startDate, endDate, onVideoCardClick, selectedPlatform }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const fetchAndFilter = async () => {
      if (!startDate || !endDate) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (selectedPlatform === 'youtube') {
          // ✅ YouTube 데이터
          const channelInfo = await getYouTubeChannelId();
          if (!channelInfo || !channelInfo.channelId) {
            throw new Error('YouTube 채널 ID를 가져올 수 없습니다.');
          }

          const videoData = await getYouTubeVideosByChannelId(channelInfo.channelId, { sortBy: 'latest', limit: 100 });
          const filteredVideos = videoData.videos.filter(video => {
            const publishedAtDate = new Date(video.publishedAt);
            return publishedAtDate >= start && publishedAtDate <= end;
          });

          setItems(sortItems(filteredVideos, sortBy));

        } else if (selectedPlatform === 'reddit') {
          // ✅ Reddit 데이터
          const channelInfo = await getRedditChannelInfo();
          if (!channelInfo || !channelInfo.channelId) {
            throw new Error('Reddit 채널 정보를 가져올 수 없습니다.');
          }

          const postData = await getRedditUploadsByRange(
            startDate.toISOString().slice(0, 10),
            endDate.toISOString().slice(0, 10),
            channelInfo.channelId
          );

          const filteredPosts = postData.posts.filter(post => {
            const createdDate = new Date(post.upload_date + "T00:00:00");
            return createdDate >= start && createdDate <= end;
          });

          setItems(sortItems(filteredPosts, sortBy));
        }

      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [startDate, endDate, selectedPlatform, sortBy]);

  // 정렬 함수
  const sortItems = (itemsToSort, sortType) => {
    if (!itemsToSort || !Array.isArray(itemsToSort)) return [];

    const sorted = [...itemsToSort].sort((a, b) => {
      switch (sortType) {
        case 'views': // 조회수순
          if (selectedPlatform === 'youtube') {
            return (b.statistics?.viewCount || 0) - (a.statistics?.viewCount || 0);
          } else {
            return (b.upvote || b.score || 0) - (a.upvote || a.score || 0);
          }
        case 'likes': // 좋아요순
          if (selectedPlatform === 'youtube') {
            return (b.statistics?.likeCount || 0) - (a.statistics?.likeCount || 0);
          } else {
            return (b.upvote || 0) - (a.upvote || 0);
          }
        case 'comments': // 댓글순
          if (selectedPlatform === 'youtube') {
            return (b.statistics?.commentCount || 0) - (a.statistics?.commentCount || 0);
          } else {
            return (b.comment_count || 0) - (a.comment_count || 0);
          }
        case 'oldest': // 오래된순
          if (selectedPlatform === 'youtube') {
            return new Date(a.publishedAt) - new Date(b.publishedAt);
          } else {
            return new Date(a.upload_date + "T00:00:00") - new Date(b.upload_date + "T00:00:00");
          }
        case 'latest': // 최신순
        default:
          if (selectedPlatform === 'youtube') {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
          } else {
            return new Date(b.upload_date + "T00:00:00") - new Date(a.upload_date + "T00:00:00");
          }
      }
    });
    return sorted;
  };

  // 정렬 옵션 변경
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
    setItems(sortItems(items, newSortBy));
  };

  //youtube 
  const youtubeSortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'views', label: '조회수순' },
    { value: 'likes', label: '좋아요순' },
    { value: 'comments', label: '댓글순' }
  ];


  //Reddit
  const redditSortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'likes', label: '업보트순' },
    { value: 'comments', label: '댓글순' }
  ];

  // 정렬 옵션 목록
  const sortOptions = selectedPlatform === 'youtube' ? youtubeSortOptions : redditSortOptions;





  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-600 dark:text-gray-400">불러오는 중...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }

    if (items.length === 0) {
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
            key={content.videoId || content.post_id || index}
            className="flex items-center gap-4 p-3 bg-gray-100/80 dark:bg-white/5 border border-gray-300/40 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-200/60 dark:hover:bg-white/10 transition-colors duration-200"
            onClick={() => {
              if (selectedPlatform === 'youtube') {
                onVideoCardClick({
                  contentId: content.videoId,
                  title: content.title,
                  platform: 'youtube'
                });
              } else if (selectedPlatform === 'reddit') {
                onVideoCardClick({
                  contentId: content.post_id,
                  title: content.title,
                  platform: 'reddit'
                });
              }
            }}
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-gray-800 dark:text-white font-semibold text-sm shadow-lg">
                {index + 1}
              </div>
            </div>

            {/* 썸네일/프리뷰 */}
            <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {selectedPlatform === 'youtube' ? (
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                content.url && content.url.includes("preview.redd.it") ? (
                  <img
                    src={content.url}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-orange-500/20 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 p-2 text-center">
                    <img src={RedditIcon} alt="Reddit Icon" className="w-6 h-6 mb-1" />
                    <span className="font-semibold text-[0.6rem] line-clamp-2">{content.sub_reddit}</span>
                  </div>
                )
              )}
            </div>

            {/* 본문 */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {content.title}
              </h4>

              {selectedPlatform === 'youtube' ? (
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{Number(content.statistics?.viewCount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{Number(content.statistics?.likeCount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{Number(content.statistics?.commentCount || 0).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{Number(content.upvote || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{Number(content.comment_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{Number(content.score || 0).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {selectedPlatform === 'youtube'
                      ? new Date(content.publishedAt).toLocaleDateString('ko-KR')
                      : new Date(content.upload_date + "T00:00:00").toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${selectedPlatform === 'youtube'
                      ? (content.statistics?.viewCount > 1000 ? 'bg-green-500' : content.statistics?.viewCount > 100 ? 'bg-yellow-500' : 'bg-gray-400')
                      : (content.upvote > 50 ? 'bg-green-500' : content.upvote > 10 ? 'bg-yellow-500' : 'bg-gray-400')
                    }`} />
                  <span className="text-[10px]">
                    {selectedPlatform === 'youtube'
                      ? (content.statistics?.viewCount > 1000 ? '높음' : content.statistics?.viewCount > 100 ? '보통' : '낮음')
                      : (content.upvote > 50 ? '높음' : content.upvote > 10 ? '보통' : '낮음')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <GlassCard className="p-6 min-h-[400px]" hover={false}>
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
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              업로드된 콘텐츠
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              선택한 기간 내 업로드된 {selectedPlatform === 'youtube' ? '영상' : '포스트'} 목록
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{items.length}개</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">총 콘텐츠</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Filter className="w-3 h-3" />
                <span>{sortOptions.find(opt => opt.value === sortBy)?.label || '정렬'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        } ${option.value === sortOptions[0].value ? 'rounded-t-lg' : ''} ${option.value === sortOptions[sortOptions.length - 1].value ? 'rounded-b-lg' : ''}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {renderContent()}
      </GlassCard>
    </motion.div>
  );
};

export default UploadedContentList;
