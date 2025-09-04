import { motion } from 'framer-motion';
import Sidebar from '@/containers/Sidebar';
import DashboardHeader from '@/containers/DashboardHeader';
import { usePlatformStore } from '@/domain/platform/logic/store';
import { usePlatformInitializer } from '@/domain/platform/logic/use-platform-initializer';

const DashboardLayout = ({ children, currentView, title }) => {
  usePlatformInitializer(); // Initializes platform status
  const { platforms, isLoading } = usePlatformStore(state => ({
    platforms: state.platforms,
    isLoading: state.platforms.google.loading || state.platforms.reddit.loading
  }));

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar 
        current_view={currentView} 
        isYoutubeConnected={platforms.google.connected} 
        isRedditConnected={platforms.reddit.connected} 
        isLoading={isLoading} 
      />
      
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