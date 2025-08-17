import { motion } from 'framer-motion';
import { usePageStore } from '../stores/page_store.js';

// 컴포넌트들 import
import Sidebar from '../components/dashboard/sidebar.jsx';
import DashboardHeader from '../components/dashboard/dashboard_header.jsx';
import SettingsView from '../components/dashboard/settings_view.jsx';

/**
 * SettingsPage 컴포넌트
 * 환경설정 페이지
 */
const SettingsPage = () => {
  const { isDarkMode, language } = usePageStore();

  // 번역 객체 (기본적인 설정 관련 번역)
  const translations = {
    ko: {
      connectionManagement: '연결 관리',
      dataExport: '데이터 내보내기',
      platformConnections: '플랫폼 연결',
      exportSettings: '내보내기 설정'
    },
    en: {
      connectionManagement: 'Connection Management',
      dataExport: 'Data Export',
      platformConnections: 'Platform Connections',
      exportSettings: 'Export Settings'
    }
  };

  const t = translations[language] || translations['ko'];

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar current_view="settings" />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader current_view="settings" />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsView t={t} />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;