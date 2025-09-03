/**
 * PlatformSearchCard 컴포넌트
 * 개별 플랫폼(YouTube/Reddit) 검색 트리거 카드
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Play, 
  MessageSquare,
  Eye,
  ThumbsUp,
  TrendingUp,
  Calendar
} from 'lucide-react';
import GlassCard from '@/common/ui/glass-card';

const PlatformSearchCard = ({ 
  platform,
  selectedContent,
  onOpenSearch 
}) => {
  const platformConfig = {
    youtube: {
      name: 'YouTube',
      icon: Play,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800/30',
      iconColor: 'text-red-500',
      textColor: 'text-red-700 dark:text-red-400',
      placeholder: 'YouTube 영상을 검색해보세요...'
    },
    reddit: {
      name: 'Reddit',
      icon: MessageSquare,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800/30',
      iconColor: 'text-orange-500',
      textColor: 'text-orange-700 dark:text-orange-400',
      placeholder: 'Reddit 포스트를 검색해보세요...'
    }
  };

  const config = platformConfig[platform];
  const PlatformIcon = config.icon;

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
            <PlatformIcon className={`w-4 h-4 ${config.iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {config.name}
          </h3>
        </div>

        {/* 검색 트리거 버튼 */}
        {!selectedContent ? (
          <motion.button
            onClick={onOpenSearch}
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
              onClick={onOpenSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 ${config.bgColor} hover:brightness-105 ${config.borderColor} border rounded-lg transition-all duration-200 group`}
            >
              <div className="flex items-center justify-center gap-2">
                <Search className={`w-4 h-4 ${config.iconColor}`} />
                <span className={`text-sm font-medium ${config.textColor}`}>
                  다른 {config.name} 콘텐츠 검색
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