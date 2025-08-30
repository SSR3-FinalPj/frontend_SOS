import DashboardLayout from '../blocks/DashboardLayout';
import SettingsView from '../blocks/SettingsView';

/**
 * SettingsPage 컴포넌트
 * 환경설정 페이지를 위한 레이아웃과 뷰 조립
 */
const SettingsPage = () => (
  <DashboardLayout currentView="settings" title="설정">
    <SettingsView />
  </DashboardLayout>
);

export default SettingsPage;