import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { latest_content_data } from '../../utils/dashboard_constants.js';

const UploadedContentList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">업로드된 콘텐츠</h3>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-80 custom-scrollbar pr-2">
          {latest_content_data.map((content, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/20 dark:bg-white/5 rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                  {content.rank}
                </div>
              </div>
              
              <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                <img 
                  src={content.thumbnail} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate mb-1">
                  {content.title}
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {content.uploadDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UploadedContentList;
