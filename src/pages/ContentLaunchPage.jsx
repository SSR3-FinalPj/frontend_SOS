import React, { useRef } from 'react';
import { usePageStore } from '@/common/stores/page-store';

// FSD Blocks & Features 조합
import DashboardLayout from '@/containers/DashboardLayout';
import ContentLaunchView from '@/features/content-management/ui/ContentLaunchView';

/**
 * ContentLaunchPage 페이지
 * AI 콘텐츠 론칭 - FSD 아키텍처의 조립 레이어
 */
const ContentLaunchPage = () => {
  const { isDarkMode } = usePageStore();
  const contentLaunchViewRef = useRef(null);

  return (
    <DashboardLayout currentView="contentLaunch" title="AI 콘텐츠 론칭">
      <div className="px-8 py-6">
        {/* 콘텐츠 론칭 뷰 */}
        <ContentLaunchView 
          ref={contentLaunchViewRef}
          dark_mode={isDarkMode}
        />
      </div>
    </DashboardLayout>
  );
};

export default ContentLaunchPage;