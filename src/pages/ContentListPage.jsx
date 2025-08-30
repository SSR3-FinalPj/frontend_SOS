/**
 * Content List Page 컴포넌트
 * 독립적인 콘텐츠 목록 페이지
 */

import React from 'react';
import { motion } from 'framer-motion';
import { usePageStore } from '../common/stores/pageStore.js';
import { use_dashboard_data } from '../domain/dashboard/model/useDashboardData.jsx';

// 기존 컴포넌트들 import
import Sidebar from '../components/dashboard/sidebar.jsx';
import DashboardHeader from '../components/dashboard/dashboard_header.jsx';
import { ContentListView } from '../features/content-modals/ui/ContentListView.jsx';

/**
 * Content List Page 컴포넌트
 * 기존 ContentListView를 독립 페이지로 활용
 */
const ContentListPage = () => {
  const { isDarkMode } = usePageStore();
  const {
    selected_platform,
    sort_order,
    set_selected_platform,
    set_sort_order
  } = use_dashboard_data();

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar current_view="contentList" />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader current_view="contentList" />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContentListView 
              selectedPlatform={selected_platform} 
              setSelectedPlatform={set_selected_platform}
              sortOrder={sort_order} 
              setSortOrder={set_sort_order}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ContentListPage;