import React from 'react';
import { usePageStore } from '@/common/stores/page-store';
import { useStatusMonitor } from '@/features/content-management/logic/use-status-monitor';

// FSD Blocks & Features 조합
import DashboardLayout from '@/containers/DashboardLayout';
import ProjectHistoryContainer from '@/containers/ProjectHistoryContainer';

/**
 * ContentLaunchPage 페이지
 * AI 콘텐츠 론칭 - FSD 아키텍처의 조립 레이어 (순수 조립만 담당)
 */
const ContentLaunchPage = () => {
  const { isDarkMode } = usePageStore();
  useStatusMonitor();

  return (
    <DashboardLayout currentView="contentLaunch" title="AI 콘텐츠 론칭">
      <div className="px-8 py-6">
        {/* 새로운 프로젝트 히스토리 구조 */}
        <ProjectHistoryContainer dark_mode={isDarkMode} />
      </div>
    </DashboardLayout>
  );
};

export default ContentLaunchPage;
