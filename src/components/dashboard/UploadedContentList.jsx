import { motion } from 'framer-motion';
import { Calendar, Eye, Heart, MessageSquare } from 'lucide-react';
import { latest_content_data } from '../../utils/dashboard_constants.js';
import GlassCard from '../ui/glass-card.jsx';

const UploadedContentList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <GlassCard className="p-6" hover={true}>
        {/* 헤더 */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-green-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              업로드된 콘텐츠
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              최신 업로드 영상 목록
            </p>
          </div>
        </motion.div>

        {/* 콘텐츠 리스트 */}
        <div className="space-y-3 overflow-y-auto max-h-80 custom-scrollbar pr-2">
          {latest_content_data.map((content, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-3 bg-white/20 dark:bg-white/5 rounded-xl"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {content.rank}
                </div>
              </div>
              
              <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                <img 
                  src={content.thumbnail} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {content.title}
                </h4>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{content.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{content.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{content.comments.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {content.uploadDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default UploadedContentList;
