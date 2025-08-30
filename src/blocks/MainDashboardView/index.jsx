/**
 * Main Dashboard View 컴포넌트
 * 메인 대시보드 뷰 (플랫폼 카드들)
 */

import React, { useState, useEffect } from 'react';
import { EnhancedPlatformCard } from "../EnhancedPlatformCard";
import { get_platform_data } from '../../domain/dashboard/model/dashboardUtils.js';
import { getDashboardData } from '../../common/api/api.js';
import { format, subDays } from 'date-fns';
import { TooltipProvider } from '../../common/ui/tooltip.jsx';

/**
 * Main Dashboard View 컴포넌트
 * @returns {JSX.Element} Main Dashboard View 컴포넌트
 */
const MainDashboardView = () => {
  const [youtubeData, setYoutubeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYoutubeData = async () => {
      try {
        setLoading(true);
        const endDate = format(new Date(), 'yyyy-MM-dd');
        const startDate = format(subDays(new Date(), 6), 'yyyy-MM-dd'); // Last 7 days including today

        const data = await getDashboardData({ type: 'range', startDate, endDate });
        setYoutubeData(data.youtube.data); // Assuming data.youtube.data contains the relevant info
      } catch (err) {
        setError(err);
        console.error("Failed to fetch YouTube dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYoutubeData();
  }, []);

  const platform_data = get_platform_data(youtubeData);

  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">Error: {error.message}</div>;
  }

  return (
    <TooltipProvider>
      <div className="p-6 relative z-10">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {platform_data.map((platform, index) => (
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