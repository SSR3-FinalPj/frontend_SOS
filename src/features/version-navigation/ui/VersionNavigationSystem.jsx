import React from 'react';
import { motion } from 'framer-motion';
import { useVersionNavigation } from '../logic/use-version-navigation';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import SingleVideoViewer from './SingleVideoViewer';
import { convertToTreeData } from '@/features/content-tree/logic/tree-utils';
import ContentItemCard from '@/features/content-management/ui/ContentItemCard'; // ContentItemCard를 import합니다.

// 최상위 영상 목록을 기존 디자인(ContentItemCard)을 사용하여 보여주는 뷰어
const RootListViewer = ({ nodes, onNavigate, onPreview, onPublish, onEdit, darkMode, uploadingItems }) => (
  <div className="flex space-x-4 overflow-x-auto pb-4">
    {nodes.map(node => (
      <div key={node.id} className="w-64 max-w-sm flex-shrink-0">
        <ContentItemCard
          item={{
            ...node,
            id: node.result_id || node.id,
            result_id: node.result_id || node.id,
            childrenCount: node.children?.length || 0,
            hasChildren: (node.children?.length || 0) > 0,
          }}
          dark_mode={darkMode}
          uploading_items={uploadingItems}
          on_preview={onPreview}
          on_publish={onPublish}
          on_edit={onEdit}
          on_navigate_to_child={onNavigate} // 카드의 버전 보기 버튼에 네비게이션 함수 연결
        />
      </div>
    ))}
  </div>
);

const VersionNavigationSystem = ({
  treeData = null,
  contents = [],
  darkMode = false,
  uploadingItems = [],
  onPreview,
  onPublish,
  onEdit
}) => {

  const processedTreeData = React.useMemo(() => {
    if (treeData && Array.isArray(treeData) && treeData.length > 0) {
      return treeData;
    }
    if (contents && contents.length > 0) {
      return convertToTreeData(contents);
    }
    return [];
  }, [treeData, contents]);

  const [initialResultId, setInitialResultId] = React.useState(null);

  const {
    currentPath,
    currentNode,
    currentResultId,
    availableChildren,
    versionPath,
    canGoUp,
    isValidTree,
    navigateToChild,
    navigateToPathIndex,
  } = useVersionNavigation(processedTreeData, initialResultId);

  const handleSelectRoot = (resultId) => {
    setInitialResultId(resultId);
  };

  const handleGoToRootList = () => {
    setInitialResultId(null);
  };

  if (!isValidTree || processedTreeData.length === 0) {
    return <div className="text-center py-8 text-sm text-gray-500">표시할 콘텐츠가 없습니다.</div>;
  }

  // 초기 상태이거나, 사용자가 루트 목록으로 돌아온 경우
  if (!initialResultId || !currentNode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">프로젝트 영상 목록 ({processedTreeData.length}개)</h3>
        <RootListViewer 
          nodes={processedTreeData} 
          onNavigate={handleSelectRoot} 
          darkMode={darkMode}
          onPreview={onPreview}
          onPublish={onPublish}
          onEdit={onEdit}
          uploadingItems={uploadingItems}
        />
      </div>
    );
  }

  // 특정 영상의 버전 트리를 탐색 중인 경우
  return (
    <div className="space-y-8">
      <BreadcrumbNavigation
        versionPath={versionPath}
        currentPath={currentPath}
        onNavigateToIndex={navigateToPathIndex}
        onGoBack={handleGoToRootList}
        onGoToRoot={handleGoToRootList}
        canGoUp={canGoUp}
        canGoBack={true}
        darkMode={darkMode}
      />
      <motion.div key={currentResultId}>
        <SingleVideoViewer
          currentNode={currentNode}
          availableChildren={availableChildren}
          onNavigateToChild={navigateToChild}
          onPreview={onPreview}
          onPublish={onPublish}
          onEdit={onEdit}
          darkMode={darkMode}
          uploadingItems={uploadingItems}
        />
      </motion.div>
    </div>
  );
};

export default React.memo(VersionNavigationSystem);