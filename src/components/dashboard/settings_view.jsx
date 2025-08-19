/**
 * Settings View 컴포넌트
 * 설정 페이지 뷰
 */

import React from 'react';
import ConnectionManagementCard from "./connection-management-card.jsx";
import { DataExportCard } from "./data-export-card.jsx";
import { get_platform_data } from '../../utils/dashboard_utils.js';

/**
 * Settings View 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.t - 번역 객체
 * @returns {JSX.Element} Settings View 컴포넌트
 */
const SettingsView = ({ t }) => {
  const platform_data = get_platform_data();

  return (
    <div className="p-6 space-y-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConnectionManagementCard t={t} platformData={platform_data} />
        <DataExportCard t={t} />
      </div>
    </div>
  );
};

export default React.memo(SettingsView);