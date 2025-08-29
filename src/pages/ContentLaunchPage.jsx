import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TestTube } from 'lucide-react';
import { usePageStore } from '../stores/page_store.js';

// 컴포넌트들 import
import Sidebar from '../components/dashboard/sidebar.jsx';
import DashboardHeader from '../components/dashboard/dashboard_header.jsx';
import ContentLaunchView from '../components/dashboard/content_launch_view.jsx';
import VideoStreamTestPanel from '../components/dashboard/VideoStreamTestPanel.jsx';
import { Button } from '../components/ui/button.jsx';

/**
 * ContentLaunchPage 컴포넌트
 * AI 콘텐츠 론칭 페이지
 */
const ContentLaunchPage = () => {
  const { isDarkMode } = usePageStore();
  
  // 테스트 패널 표시 여부 상태
  const [showTestPanel, setShowTestPanel] = useState(false);

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar current_view="contentLaunch" />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader current_view="contentLaunch" />
        
        {/* 테스트 패널 토글 버튼 */}
        <div className="px-8 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <Button
            onClick={() => setShowTestPanel(!showTestPanel)}
            variant="outline"
            size="sm"
            className={`${
              showTestPanel 
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/50 text-orange-700 dark:text-orange-300' 
                : ''
            }`}
          >
            <TestTube className="w-4 h-4 mr-2" />
            {showTestPanel ? '테스트 패널 닫기' : '🧪 API 테스트 패널'}
          </Button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* 테스트 패널 (조건부 렌더링) */}
            <AnimatePresence>
              {showTestPanel && (
                <VideoStreamTestPanel dark_mode={isDarkMode} />
              )}
            </AnimatePresence>
            
            {/* 기존 콘텐츠 론칭 뷰 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ContentLaunchView dark_mode={isDarkMode} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContentLaunchPage;