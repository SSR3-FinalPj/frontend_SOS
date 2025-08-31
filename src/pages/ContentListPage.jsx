import DashboardLayout from '@/containers/DashboardLayout';
import ContentListView from '@/containers/ContentListView';

/**
 * Content List Page 컴포넌트
 * 콘텐츠 목록 페이지를 위한 레이아웃과 뷰 조립
 */
const ContentListPage = () => (
  <DashboardLayout currentView="contentList" title="콘텐츠 목록">
    <ContentListView />
  </DashboardLayout>
);

export default ContentListPage;