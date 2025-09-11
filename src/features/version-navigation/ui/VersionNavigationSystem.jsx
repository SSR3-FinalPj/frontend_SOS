/**
 * VersionNavigationSystem 컴포넌트
 * BreadcrumbNavigation과 SingleVideoViewer를 통합한 완전한 네비게이션 시스템
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVersionNavigation } from '../logic/use-version-navigation';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import SingleVideoViewer from './SingleVideoViewer';
import { convertToTreeData } from '@/features/content-tree/logic/tree-utils';

/**
 * VersionNavigationSystem 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.treeData - 백엔드 트리 데이터 (result_id + children)
 * @param {Array} props.contents - 평면 콘텐츠 배열 (legacy)
 * @param {boolean} props.darkMode - 다크모드 여부
 * @param {Array} props.uploadingItems - 업로드 중인 아이템들
 * @param {Function} props.onPreview - 미리보기 함수
 * @param {Function} props.onPublish - 게시 함수
 * @param {Function} props.onEdit - 수정 함수
 * @returns {JSX.Element} VersionNavigationSystem 컴포넌트
 */
const VersionNavigationSystem = ({
  treeData = null,
  contents = [],
  darkMode = false,
  uploadingItems = [],
  onPreview,
  onPublish,
  onEdit
}) => {
  
  // 모든 hooks를 컴포넌트 최상단에서 호출
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // 트리 데이터 처리 (treeData가 있으면 사용, 없으면 contents를 변환)
  const processedTreeData = React.useMemo(() => {
    // 🧪 TEST: VersionNavigationSystem에 전달된 데이터 로깅
    if (contents && contents.length > 0) {
      const hasTestData = contents.some(c => c.title?.includes('AI 영상') || c.id?.includes('temp-'));
      if (hasTestData) {
        console.log(`[VERSION NAV] 받은 contents 데이터:`, contents);
      }
    }
    
    if (treeData && Array.isArray(treeData) && treeData.length > 0) {
      return treeData;
    }
    
    // contents를 트리 구조로 변환 (기존 로직 유지)
    if (contents && contents.length > 0) {
      const converted = convertToTreeData(contents);
      
      // 🧪 TEST: 변환된 트리 데이터 로깅
      const hasTestData = converted.some(c => c.title?.includes('AI 영상') || c.result_id?.includes('temp-'));
      if (hasTestData) {
        console.log(`[VERSION NAV] 변환된 트리 데이터:`, converted);
      }
      
      return converted;
    }
    
    return [];
  }, [treeData, contents]);

  // 초기 result_id 결정
  const initialResultId = React.useMemo(() => {
    if (processedTreeData.length === 0) return null;
    return processedTreeData[0].result_id || processedTreeData[0].id;
  }, [processedTreeData]);

  // 버전 네비게이션 훅 사용
  const {
    currentPath,
    currentNode,
    currentResultId,
    availableChildren,
    versionPath,
    canGoUp,
    canGoDeeper,
    isValidTree,
    navigateToChild,
    navigateToPathIndex,
    navigateUp,
    navigateToRoot,
    goBack,
    debugInfo
  } = useVersionNavigation(processedTreeData, initialResultId);

  // handleGoBack 함수 정의
  const handleGoBack = React.useCallback(() => {
    if (navigationHistory.length > 1) {
      const previous = navigationHistory[navigationHistory.length - 2];
      navigateToPathIndex(previous.pathIndex);
      setNavigationHistory(prev => prev.slice(0, -1));
      return true;
    }
    return goBack();
  }, [navigationHistory, navigateToPathIndex, goBack]);

  // 경로 변경시 히스토리 업데이트 - hooks를 최상단으로 이동
  useEffect(() => {
    // 조건부 로직을 useEffect 내부로 이동
    if (isValidTree && processedTreeData.length > 0 && currentPath.length > 0) {
      setNavigationHistory(prev => {
        const newEntry = {
          path: [...currentPath],
          pathIndex: currentPath.length - 1,
          timestamp: Date.now()
        };
        const newHistory = [...prev, newEntry];
        return newHistory.slice(-5); // 최대 5개까지만 유지
      });
    }
  }, [currentPath, isValidTree, processedTreeData.length]);

  // 데이터가 없거나 트리가 유효하지 않으면 빈 상태 표시
  if (!isValidTree || processedTreeData.length === 0) {
    return (
      <div className="space-y-4">
        {/* 기본 브레드크럼 */}
        <BreadcrumbNavigation
          versionPath={[]}
          currentPath={[]}
          onNavigateToIndex={() => {}}
          onGoBack={() => {}}
          onGoToRoot={() => {}}
          canGoUp={false}
          canGoBack={false}
          darkMode={darkMode}
        />
        
        <div className={`text-center py-8 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="text-sm">표시할 콘텐츠가 없습니다</div>
          {contents && contents.length > 0 ? (
            <div className="text-xs mt-1">
              데이터 처리 중입니다...
            </div>
          ) : (
            <div className="text-xs mt-1">
              새로운 영상을 생성해보세요
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 네비게이션 - 항상 표시 */}
      <BreadcrumbNavigation
        versionPath={versionPath}
        currentPath={currentPath}
        onNavigateToIndex={navigateToPathIndex}
        onGoBack={handleGoBack}
        onGoToRoot={navigateToRoot}
        canGoUp={canGoUp}
        canGoBack={navigationHistory.length > 1}
        darkMode={darkMode}
      />

      {/* 단일 영상 뷰어 - 왼쪽 정렬 */}
      <div className="overflow-x-auto">
        <AnimatePresence mode="wait">
          <SingleVideoViewer
            key={currentResultId} // 결과 ID가 바뀔 때마다 애니메이션
            currentNode={currentNode}
            availableChildren={availableChildren}
            onNavigateToChild={navigateToChild}
            onPreview={onPreview}
            onPublish={onPublish}
            onEdit={onEdit}
            darkMode={darkMode}
            uploadingItems={uploadingItems}
          />
        </AnimatePresence>
      </div>

      {/* 개발 환경 디버그 패널 */}
      {process.env.NODE_ENV === 'development' && (
        <details className={`mt-4 p-3 rounded-md text-xs ${
          darkMode 
            ? 'bg-gray-800/30 text-gray-400 border border-gray-700' 
            : 'bg-gray-50/30 text-gray-600 border border-gray-200'
        }`}>
          <summary className="cursor-pointer font-medium mb-2">
            🔧 Version Navigation Debug
          </summary>
          <div className="font-mono space-y-1">
            <div>Tree Valid: {debugInfo.isValidTree ? '✅' : '❌'}</div>
            <div>Current Path: [{debugInfo.currentPath.join(' → ')}]</div>
            <div>Current Node ID: {debugInfo.currentNodeId || 'N/A'}</div>
            <div>Version Path: [{debugInfo.versionPath.join(' → ')}]</div>
            <div>Children Count: {debugInfo.availableChildrenCount}</div>
            <div>Can Go Deeper: {debugInfo.canGoDeeper ? '✅' : '❌'}</div>
            <div>Can Go Up: {debugInfo.canGoUp ? '✅' : '❌'}</div>
            <div>History Length: {navigationHistory.length}</div>
            <div>Tree Data Length: {processedTreeData.length}</div>
            {contents && (
              <div>Original Contents: {contents.length}</div>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default React.memo(VersionNavigationSystem);