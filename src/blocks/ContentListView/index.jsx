/**
 * ContentListView 블록
 * 콘텐츠 목록 페이지의 메인 콘텐츠를 담당하는 뷰 블록
 */

import { usePageStore } from '../../common/stores/pageStore.js';
import { use_dashboard_data } from '../../domain/dashboard/model/useDashboardData.jsx';
import { ContentListView as ContentListFeature } from '../../features/content-modals/ui/ContentListView.jsx';

/**
 * ContentListView 컴포넌트
 * 콘텐츠 목록 관련 뷰를 관리하는 블록
 */
const ContentListView = () => {
  const { isDarkMode } = usePageStore();
  const {
    selected_platform,
    sort_order,
    set_selected_platform,
    set_sort_order
  } = use_dashboard_data();

  return (
    <ContentListFeature 
      selectedPlatform={selected_platform} 
      setSelectedPlatform={set_selected_platform}
      sortOrder={sort_order} 
      setSortOrder={set_sort_order}
    />
  );
};

export default ContentListView;