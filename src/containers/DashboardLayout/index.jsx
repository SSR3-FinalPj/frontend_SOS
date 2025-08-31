/**
 * DashboardLayout 블록
 * 모든 대시보드 페이지에서 공통으로 사용하는 레이아웃 구조
 */

import { motion } from 'framer-motion';
import Sidebar from '@/containers/Sidebar';
import DashboardHeader from '@/containers/DashboardHeader';

/**
 * DashboardLayout 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 메인 콘텐츠
 * @param {string} props.currentView - 현재 뷰 식별자
 * @param {string} props.title - 페이지 제목
 * @returns {JSX.Element} DashboardLayout 컴포넌트
 */
const DashboardLayout = ({ children, currentView, title }) => {
  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar current_view={currentView} />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader current_view={currentView} title={title} />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;