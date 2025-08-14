/**
 * Main Dashboard View 컴포넌트
 * 메인 대시보드 뷰 (플랫폼 카드들)
 */

import React from 'react';
import { EnhancedPlatformCard } from "./enhanced-platform-card.jsx";
import { get_platform_data } from '../../utils/dashboard_utils.js';

/**
 * Main Dashboard View 컴포넌트
 * @returns {JSX.Element} Main Dashboard View 컴포넌트
 */
const MainDashboardView = () => {
  const platform_data = get_platform_data();

  return (
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
  );
};

export default React.memo(MainDashboardView);