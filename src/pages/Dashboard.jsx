import React from 'react';
import { motion } from 'framer-motion';
import { usePageStore } from '../stores/page_store.js';
import { ContentListView } from "../components/dashboard/content-list-view.jsx";
import { ContentLaunchPage } from "./ContentLaunchPage.jsx";
import { use_dashboard_data } from '../hooks/use_dashboard_data.jsx';

// 리팩토링된 컴포넌트들 import
import Sidebar from '../components/dashboard/sidebar.jsx';
import DashboardHeader from '../components/dashboard/dashboard_header.jsx';
import MainDashboardView from '../components/dashboard/main_dashboard_view.jsx';
import SettingsView from '../components/dashboard/settings_view.jsx';
import DetailedAnalyticsView from '../components/dashboard/detailed_analytics_view.jsx';


/**
 * Dashboard 컴포넌트
 * 리팩토링된 메인 대시보드 페이지
 */

const Dashboard = () => {
  const { isDarkMode } = usePageStore();
  const {
    current_view,
    selected_platform,
    sort_order,
    set_current_view,
    set_selected_platform,
    set_sort_order
  } = use_dashboard_data();
  

  /**
   * 현재 뷰에 따른 컴포넌트 렌더링
   * @returns {JSX.Element} 현재 뷰 컴포넌트
   */
  const render_current_view = () => {
    switch (current_view) {
      case 'dashboard':
        return <MainDashboardView />;
      case 'analytics':
        return (
          <DetailedAnalyticsView 
            current_view={current_view} 
            set_current_view={set_current_view} 
          />
        );
      case 'settings':
        return <SettingsView />;
      case 'contentList':
        return (
          <ContentListView 
            selectedPlatform={selected_platform} 
            setSelectedPlatform={set_selected_platform}
            sortOrder={sort_order} 
            setSortOrder={set_sort_order}
          />
        );
      case 'contentLaunch':
        return <ContentLaunchPage dark_mode={isDarkMode} />;
      default:
        return <MainDashboardView />;
    }
  };

  // 분석 페이지일 때는 완전히 다른 레이아웃 사용
  if (current_view === 'analytics') {
    return render_current_view();
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar 
        current_view={current_view} 
        set_current_view={set_current_view} 
      />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader 
          current_view={current_view} 
        />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={current_view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {render_current_view()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);