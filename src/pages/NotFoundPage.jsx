/**
 * Not Found Page 컴포넌트
 * 404 에러 페이지
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { usePageStore } from '../common/stores/pageStore.js';

/**
 * Not Found Page 컴포넌트
 * 존재하지 않는 경로에 대한 404 페이지
 */
const NotFoundPage = () => {
  const { isDarkMode } = usePageStore();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <div className="relative z-10 text-center px-6 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          {/* 404 숫자 */}
          <motion.h1 
            className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            404
          </motion.h1>

          {/* 메시지 */}
          <motion.h2 
            className="text-2xl font-light text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            페이지를 찾을 수 없습니다
          </motion.h2>

          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </motion.p>

          {/* 버튼들 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link to="/">
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                홈으로 돌아가기
              </motion.button>
            </Link>

            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 bg-white/20 dark:bg-white/5 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              이전 페이지로
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;