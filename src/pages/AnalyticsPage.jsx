import DashboardLayout from '../blocks/DashboardLayout';
import AnalyticsView from '../blocks/AnalyticsView';

/**
 * Analytics Page 컴포넌트
 * 분석 페이지를 위한 레이아웃과 뷰 조립
 */
const AnalyticsPage = () => (
  <DashboardLayout currentView="analytics" title="분석">
    <AnalyticsView />
  </DashboardLayout>
);

export default AnalyticsPage;