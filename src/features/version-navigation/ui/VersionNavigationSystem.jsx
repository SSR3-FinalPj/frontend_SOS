import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import { buildVersionGroups, convertToTreeData } from '@/features/content-tree/logic/tree-utils';
import ContentItemCard from '@/features/content-management/ui/ContentItemCard';

const VersionNavigationSystem = ({
  treeData = null,
  contents = [],
  darkMode = false,
  uploadingItems = [],
  onPreview,
  onPublish,
  onEdit
}) => {

  const processedTreeData = useMemo(() => {
    if (treeData && Array.isArray(treeData) && treeData.length > 0) {
      return treeData;
    }
    if (contents && contents.length > 0) {
      return convertToTreeData(contents);
    }
    return [];
  }, [treeData, contents]);

  const versionGroups = useMemo(() => buildVersionGroups(processedTreeData), [processedTreeData]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  useEffect(() => {
    if (versionGroups.length > 0) {
      setActiveGroupIndex((prev) => Math.min(prev, versionGroups.length - 1));
    } else {
      setActiveGroupIndex(0);
    }
  }, [versionGroups]);

  if (versionGroups.length === 0) {
    return <div className="text-center py-8 text-sm text-gray-500">표시할 콘텐츠가 없습니다.</div>;
  }

  const currentGroup = versionGroups[activeGroupIndex] || versionGroups[0];
  const remainingGroups = versionGroups.slice(activeGroupIndex + 1);
  const versionPath = versionGroups.slice(0, activeGroupIndex + 1).map((group) => group.versionLabel);
  const immediateNextGroups = remainingGroups.slice(0, 1).map((group, idx) => ({
    label: group.versionLabel,
    targetIndex: activeGroupIndex + 1 + idx,
  }));

  const handleNavigateToIndex = (index) => {
    if (index < 0 || index >= versionGroups.length) return;
    setActiveGroupIndex(index);
  };

  const handleGoBack = () => {
    if (activeGroupIndex > 0) {
      setActiveGroupIndex(activeGroupIndex - 1);
    }
  };

  const handleGoRoot = () => {
    setActiveGroupIndex(0);
  };

  const normalizedItems = currentGroup.nodes.map((node) => {
    const resultId = node.result_id || node.resultId || node.id;
    const childCount = Array.isArray(node.children) ? node.children.length : 0;
    const isBaselineForNext = childCount > 0;
    return {
      ...node,
      id: resultId,
      result_id: resultId,
      version: node.version || currentGroup.version,
      childrenCount: childCount,
      hasChildren: childCount > 0,
      isBaselineForNext,
    };
  });

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation
        versionPath={versionPath}
        currentPath={versionPath.map((_, idx) => idx + 1)}
        nextVersions={immediateNextGroups}
        onNavigateToIndex={handleNavigateToIndex}
        onGoBack={handleGoBack}
        onGoToRoot={handleGoRoot}
        canGoUp={activeGroupIndex > 0}
        canGoBack={activeGroupIndex > 0}
        darkMode={darkMode}
      />
      <motion.div
        key={currentGroup.version}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`${darkMode ? 'bg-gray-900/40' : 'bg-white'} rounded-3xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/60'} p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentGroup.versionLabel}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {normalizedItems.length}개 영상 묶음
            </p>
            {activeGroupIndex > 0 && (
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {versionGroups[activeGroupIndex - 1].versionLabel} 기반 수정
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {normalizedItems.map((item) => (
            <ContentItemCard
              key={item.id || item.temp_id}
              item={item}
              dark_mode={darkMode}
              uploading_items={uploadingItems}
              on_preview={onPreview}
              on_publish={onPublish}
              on_edit={onEdit}
              isVersionBaseline={item.isBaselineForNext}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(VersionNavigationSystem);
