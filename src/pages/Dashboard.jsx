// FSD Blocks 조합
import DashboardLayout from '../blocks/DashboardLayout';
import MainDashboardView from '../blocks/MainDashboardView';

/**
 * Dashboard 페이지
 * 메인 대시보드 - FSD 아키텍처의 조립 레이어
 */
const Dashboard = () => {
  return (
    <DashboardLayout currentView="dashboard" title="대시보드">
      <MainDashboardView />
    </DashboardLayout>
  );
};

export default Dashboard;