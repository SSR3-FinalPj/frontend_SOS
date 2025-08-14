import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../ui/pagination.jsx";
import { GlassCard } from '../ui/glass-card.jsx';
import { mockContentData } from '../../utils/mock-data.js';

// 수정된 콘텐츠 리스트 뷰 - 3x2 그리드 (6개)
function ContentListView({
  selectedPlatform,
  setSelectedPlatform,
  sortOrder,
  setSortOrder
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const itemsPerPage = 6; // 3x2 그리드
  const sortDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort content
  const filteredAndSortedContent = mockContentData
    .filter(content => {
      if (selectedPlatform === 'all') return true;
      return content.platform.toLowerCase() === selectedPlatform.toLowerCase();
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedContent = filteredAndSortedContent.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPlatform, sortOrder]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate page numbers for pagination
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

  return (
    <div className="p-6 space-y-6 relative z-10">
      {/* Filter Section */}
      <div className="flex items-center justify-between">
        {/* Left - Platform Filter (Text Links) */}
        <div className="flex items-center gap-6">
          {[
            { id: 'all', label: '모든 채널' },
            { id: 'youtube', label: 'YouTube' },
            { id: 'reddit', label: 'Reddit' }
          ].map((platform) => (
            <motion.button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`transition-all duration-200 ${
                selectedPlatform === platform.id
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {platform.label}
            </motion.button>
          ))}
        </div>

        {/* Right - Sort Dropdown */}
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

          {/* Sort Dropdown Menu */}
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
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      sortOrder === sort.id
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

      {/* 3x2 그리드 콘텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[500px]"
      >
        <div className="grid grid-cols-3 gap-6">
          {displayedContent.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* 정사각형 썸네일 */}
                <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* 콘텐츠 정보 */}
                <div className="p-4">
                  {/* 플랫폼 배지 */}
                  <div className="mb-3">
                    <div className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                      content.platform === 'YouTube'
                        ? 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                        : 'bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400'
                    }`}>
                      {content.platform}
                    </div>
                  </div>

                  {/* 제목 */}
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2 line-clamp-2 leading-tight">
                    {content.title}
                  </h3>

                  {/* 업로드 날짜 */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(content.uploadDate)}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* 빈 카드들로 그리드 레이아웃 유지 */}
        {displayedContent.length < 6 && (
          <div className="grid grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 6 - displayedContent.length }, (_, index) => (
              <div key={`empty-${index}`} className="aspect-square opacity-0"></div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Custom Pagination Component */}
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
                {/* Previous Button */}
                <PaginationItem>
                  <motion.button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:block">이전</span>
                  </motion.button>
                </PaginationItem>

                {/* Page Numbers */}
                {generatePageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
                    ) : (
                      <motion.button
                        onClick={() => setCurrentPage(page)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </motion.button>
                    )}
                  </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                  <motion.button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
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

      {/* Empty State */}
      {filteredAndSortedContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-12"
        >
          <GlassCard>
            <div className="py-8">
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
    </div>
  );
}

export { ContentListView };