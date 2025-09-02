import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Image, MessageSquare, ThumbsUp, ArrowBigUp, Eye } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/common/ui/pagination';
import GlassCard from '@/common/ui/glass-card';
import { getYouTubeVideosByChannelId } from '@/common/api/api';
import { useYouTubeStore } from '@/domain/youtube/logic/store';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { mockContentData } from '@/common/utils/mock-data';
import { use_content_modals } from '@/features/content-modals/logic/use-content-modals';
import ContentPreviewModal from '@/features/content-modals/ui/ContentPreviewModal';
import { usePageStore } from '@/common/stores/page-store';

function ContentListView({
  selectedPlatform,
  setSelectedPlatform,
  sortOrder,
  setSortOrder
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  
  const [contents, setContents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortDropdownRef = useRef(null);
  const { channelId } = useYouTubeStore();
  const { platforms } = usePlatformStore();
  const { isDarkMode } = usePageStore();
  const { preview_modal, open_preview_modal, close_preview_modal } = use_content_modals();
  const authLoading = platforms.google.loading;
  const ITEMS_PER_PAGE = 6;

  const platformOptions = [
    { id: 'all', label: '모든 채널' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'reddit', label: 'Reddit' }
  ];

  const availablePlatforms = platformOptions.filter(p => {
    if (p.id === 'all') return platforms.google.connected && platforms.reddit.connected;
    if (p.id === 'youtube') return platforms.google.connected;
    if (p.id === 'reddit') return platforms.reddit.connected;
    return false;
  });

  useEffect(() => {
    if (platforms.google.connected && !platforms.reddit.connected) {
      setSelectedPlatform('youtube');
    } else if (!platforms.google.connected && platforms.reddit.connected) {
      setSelectedPlatform('reddit');
    } else if (platforms.google.connected && platforms.reddit.connected) {
      setSelectedPlatform('all');
    }
  }, [platforms.google.connected, platforms.reddit.connected, setSelectedPlatform]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      if (authLoading) {
        setLoading(false);
        return;
      }
      
      try {
        let allData = [];

        if (selectedPlatform === 'youtube' || selectedPlatform === 'all') {
          if (channelId) {
            const ytData = await getYouTubeVideosByChannelId(channelId, {
              sortBy: sortOrder,
              // No pagination here, fetch all and paginate after merge
            });
            const formattedYtData = ytData.videos.map(v => ({...v, platform: 'YouTube', uploadDate: v.publishedAt, id: v.videoId, views: v.statistics?.viewCount, likes: v.statistics?.likeCount, comments: v.statistics?.commentCount}));
            allData.push(...formattedYtData);
          } else if (selectedPlatform === 'youtube') {
             setError('YouTube 채널이 연결되지 않았습니다.');
          }
        }

        if (selectedPlatform === 'reddit' || selectedPlatform === 'all') {
          const redditData = mockContentData.filter(item => item.platform === 'Reddit');
          allData.push(...redditData);
        }

        if (sortOrder === 'latest') {
          allData.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        } else {
          allData.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        }

        const totalItems = allData.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const paginatedData = allData.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        );

        setContents(paginatedData);
        setTotalPages(totalPages);

      } catch (err) {
        console.error(err);
        setError(err.message);
        setContents([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedPlatform, sortOrder, currentPage, channelId, authLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPlatform, sortOrder]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const PlatformBadge = ({ platform }) => {
    const isYoutube = platform.toLowerCase() === 'youtube';
    const bgColor = isYoutube ? 'bg-red-100 dark:bg-red-950/20' : 'bg-orange-100 dark:bg-orange-950/20';
    const textColor = isYoutube ? 'text-red-700 dark:text-red-400' : 'text-orange-700 dark:text-orange-400';
    return (
      <div className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${bgColor} ${textColor}`}>
        {platform}
      </div>
    );
  };

  const ContentStats = ({ content }) => {
    const isYoutube = content.platform.toLowerCase() === 'youtube';
    return (
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        {isYoutube ? (
          <>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{content.views?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{content.likes?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{content.comments?.toLocaleString()}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <ArrowBigUp className="w-4 h-4" />
              <span>{content.upvotes?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{content.comments?.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 relative z-10">
      {/* Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {availablePlatforms.map((platform) => (
            <motion.button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`transition-all duration-200 ${selectedPlatform === platform.id
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {platform.label}
            </motion.button>
          ))}
        </div>
        <div className="relative" ref={sortDropdownRef}>
          <motion.button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {sortOrder === 'latest' ? '최신순' : '오래된순'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>
          <AnimatePresence>
            {sortDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="absolute top-full right-0 mt-2 w-40 backdrop-blur-2xl bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 rounded-xl shadow-2xl p-2 z-50"
              >
                {[
                  { id: 'latest', label: '최신순' },
                  { id: 'oldest', label: '오래된순' }
                ].map((sort) => (
                  <motion.button
                    key={sort.id}
                    onClick={() => {
                      setSortOrder(sort.id);
                      setSortDropdownOpen(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${sortOrder === sort.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                    }`}
                  >
                    {sort.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Grid */}
      {authLoading ? (
        <div className="flex justify-center items-center min-h-[500px]">
          <p className="text-gray-500 dark:text-gray-400">인증 정보 로드 중...</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center min-h-[500px]">
          <p className="text-gray-500 dark:text-gray-400">콘텐츠를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[500px]">
          <p className="text-red-500 dark:text-red-400">오류: {error}</p>
        </div>
      ) : contents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-[500px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => open_preview_modal(content)}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="cursor-pointer backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
                >
                  <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-3">
                      <PlatformBadge platform={content.platform} />
                    </div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2 line-clamp-2 leading-tight flex-grow">
                      {content.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <ContentStats content={content} />
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(content.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 min-h-[500px] flex items-center justify-center"
        >
          <GlassCard>
            <div className="py-8 px-12">
              <Image className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                콘텐츠가 없습니다
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                선택한 필터 조건에 맞는 콘텐츠를 찾을 수 없습니다.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center pt-6"
        >
          <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-4 shadow-xl">
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <motion.button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:block">이전</span>
                  </motion.button>
                </PaginationItem>
                {generatePageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
                    ) : (
                      <motion.button
                        onClick={() => setCurrentPage(page)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${currentPage === page
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </motion.button>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <motion.button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                    }`}
                  >
                    <span className="hidden sm:block">다음</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </motion.div>
      )}
      <ContentPreviewModal
        is_open={preview_modal.open}
        item={preview_modal.item}
        dark_mode={isDarkMode}
        on_close={close_preview_modal}
        viewMode="simple"
      />
    </div>
  );
}

export { ContentListView };