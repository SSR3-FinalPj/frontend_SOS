import { motion } from 'framer-motion';

// 컴포넌트들 import
import Sidebar from '../components/dashboard/sidebar.jsx';
import DashboardHeader from '../components/dashboard/dashboard_header.jsx';
import MainDashboardView from '../components/dashboard/main_dashboard_view.jsx';

/**
 * Dashboard 컴포넌트
 * 메인 대시보드 페이지 (MainDashboardView만 렌더링)
 */
const Dashboard = () => {

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar current_view="dashboard" />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader current_view="dashboard" />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MainDashboardView />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;