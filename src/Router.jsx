/**
 * Router 컴포넌트
 * 애플리케이션의 모든 라우트 정의
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트들 import
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ContentListPage from './pages/ContentListPage.jsx';
import ContentLaunchPage from './pages/ContentLaunchPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * Router 컴포넌트
 * React Router를 사용하여 모든 페이지 라우트 정의
 */
const Router = () => {
  return (
    <Routes>
      {/* 메인 페이지 */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 인증 관련 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 대시보드 관련 */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contents" element={<ContentListPage />} />
      <Route path="/contentlaunch" element={<ContentLaunchPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      
      
      {/* 404 페이지 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;