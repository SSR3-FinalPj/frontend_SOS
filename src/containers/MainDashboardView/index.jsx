import React, { useState, useEffect } from 'react';
import { EnhancedPlatformCard } from "@/containers/EnhancedPlatformCard";
import { get_platform_data } from '@/domain/dashboard/logic/dashboard-utils';
import { getDashboardData, getGoogleStatus, getRedditStatus, getRedditDashboardData } from '@/common/api/api';
import { format, subDays } from 'date-fns';
import { TooltipProvider } from '@/common/ui/tooltip';
import NoconnectView from '../NoconnectView';

const MainDashboardView = () => {
  const [youtubeData, setYoutubeData] = useState(null);
  const [redditData, setRedditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isYoutubeConnected, setIsYoutubeConnected] = useState(false);
  const [isRedditConnected, setIsRedditConnected] = useState(false);

  useEffect(() => {
    const fetchPlatformStatusAndData = async () => {
      try {
        setLoading(true);
        const [googleStatus, redditStatus] = await Promise.all([
          getGoogleStatus(),
          getRedditStatus(),
        ]);

        setIsYoutubeConnected(googleStatus.connected);
        setIsRedditConnected(redditStatus.connected);

        const endDate = format(new Date(), 'yyyy-MM-dd');
        const startDate = format(subDays(new Date(), 6), 'yyyy-MM-dd');

        const dataPromises = [];
        if (googleStatus.connected) {
          dataPromises.push(getDashboardData({ type: 'range', startDate, endDate }));
        } else {
          dataPromises.push(Promise.resolve(null)); // Maintain order
        }

        if (redditStatus.connected) {
          dataPromises.push(getRedditDashboardData({ startDate, endDate }));
        } else {
          dataPromises.push(Promise.resolve(null)); // Maintain order
        }

        const [youtubeResult, redditResult] = await Promise.all(dataPromises);

        if (youtubeResult) {
          setYoutubeData(youtubeResult.youtube.data);
        }
        if (redditResult) {
          setRedditData(redditResult);
        }

      } catch (err) {
        setError(err);
        console.error("Failed to fetch platform status or data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformStatusAndData();
  }, []);

  const all_platform_data = get_platform_data(youtubeData, redditData);

  const connected_platforms = all_platform_data.filter(platform => {
    if (platform.name === 'YouTube') {
      return isYoutubeConnected;
    }
    if (platform.name === 'Reddit') {
      return isRedditConnected;
    }
    return false;
  });

  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading dashboard data...</div>;
  }

  if (error) {
    // You might want to show a more specific error message
    return <NoconnectView />;
  }

  if (connected_platforms.length === 0) {
    return <NoconnectView />;
  }

  return (
    <TooltipProvider>
      <div className="p-6 relative z-10">
        <div className={`grid ${connected_platforms.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-6 h-[calc(100vh-200px)]`}>
          {connected_platforms.map((platform, index) => (
            <EnhancedPlatformCard 
              key={platform.name} 
              platform={platform} 
              index={index}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default React.memo(MainDashboardView);