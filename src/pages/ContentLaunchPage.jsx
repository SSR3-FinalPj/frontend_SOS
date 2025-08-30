import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TestTube } from 'lucide-react';
import { usePageStore } from '../common/stores/pageStore.js';

// FSD Blocks & Features 조합
import DashboardLayout from '../blocks/DashboardLayout';
import ContentLaunchView from '../features/content-management/ui/ContentLaunchView.jsx';
import VideoStreamTestPanel from '../blocks/VideoStreamTestPanel';
import { Button } from '../common/ui/button.jsx';

/**
 * ContentLaunchPage 페이지
 * AI 콘텐츠 론칭 - FSD 아키텍처의 조립 레이어
 */
const ContentLaunchPage = () => {
  const { isDarkMode } = usePageStore();
  const [showTestPanel, setShowTestPanel] = useState(false);

  return (
    <DashboardLayout currentView="contentLaunch" title="AI 콘텐츠 론칭">
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

      <div className="px-8 py-6">
        {/* 테스트 패널 (조건부 렌더링) */}
        <AnimatePresence>
          {showTestPanel && (
            <VideoStreamTestPanel dark_mode={isDarkMode} />
          )}
        </AnimatePresence>
        
        {/* 콘텐츠 론칭 뷰 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ContentLaunchView dark_mode={isDarkMode} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ContentLaunchPage;