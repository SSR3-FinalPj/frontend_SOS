/**
 * 버전 트리 네비게이션을 관리하는 커스텀 훅
 * 윈도우 탐색기 스타일의 계층적 탐색 기능 제공
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  getNodeByPath,
  buildPathToNode,
  getAvailableChildren,
  findParentNode,
  pathToVersionStrings,
  validateTreeData
} from '@/common/utils/tree-utils';

/**
 * useVersionNavigation 커스텀 훅
 * @param {Array} treeData - 백엔드에서 받은 트리 데이터
 * @param {number} initialResultId - 초기 선택할 result_id (선택사항)
 * @returns {Object} 네비게이션 상태와 제어 함수들
 */
export const useVersionNavigation = (treeData = [], initialResultId = null) => {
  // 현재 경로 상태 (result_id 배열)
  const [currentPath, setCurrentPath] = useState([]);
  
  // 트리 데이터 유효성 검증
  const isValidTree = useMemo(() => validateTreeData(treeData), [treeData]);
  
  // 초기 경로 설정
  useEffect(() => {
    if (!isValidTree || treeData.length === 0) {
      setCurrentPath([]);
      return;
    }
    
    if (initialResultId) {
      // 특정 result_id로 초기화
      const path = buildPathToNode(treeData, initialResultId);
      if (path.length > 0) {
        setCurrentPath(path);
        return;
      }
    }
    
    // 기본적으로 첫 번째 루트 노드로 초기화
    setCurrentPath([treeData[0].result_id]);
  }, [treeData, initialResultId, isValidTree]);
  
  // 현재 노드 정보
  const currentNode = useMemo(() => {
    if (!isValidTree || currentPath.length === 0) return null;
    return getNodeByPath(treeData, currentPath);
  }, [treeData, currentPath, isValidTree]);
  
  // 현재 노드의 가용한 자식들
  const availableChildren = useMemo(() => {
    if (!currentNode) return [];
    return getAvailableChildren(currentNode);
  }, [currentNode]);
  
  // 하위 버전으로 이동 가능한지 여부
  const canGoDeeper = useMemo(() => {
    return availableChildren.length > 0;
  }, [availableChildren]);
  
  // 상위로 이동 가능한지 여부  
  const canGoUp = useMemo(() => {
    return currentPath.length > 1;
  }, [currentPath]);
  
  // 버전 문자열로 변환된 경로
  const versionPath = useMemo(() => {
    if (!isValidTree) return [];
    return pathToVersionStrings(currentPath, treeData);
  }, [currentPath, treeData, isValidTree]);
  
  // 특정 자식 노드로 이동
  const navigateToChild = useCallback((childResultId) => {
    console.log(`[NAVIGATION] navigateToChild 호출:`, {
      childResultId,
      isValidTree,
      availableChildrenCount: availableChildren.length,
      currentPath
    });
    
    if (!isValidTree) {
      console.log(`[NAVIGATION] 자식 이동 실패: 트리가 유효하지 않음`);
      return false;
    }
    
    const childNode = availableChildren.find(child => child.result_id === childResultId);
    if (!childNode) {
      console.log(`[NAVIGATION] 자식 이동 실패: 자식 노드를 찾을 수 없음`, { 
        childResultId, 
        availableChildren: availableChildren.map(c => c.result_id) 
      });
      return false;
    }
    
    const newPath = [...currentPath, childResultId];
    console.log(`[NAVIGATION] 자식으로 경로 업데이트:`, { from: currentPath, to: newPath });
    
    setCurrentPath(newPath);
    return true;
  }, [availableChildren, isValidTree, currentPath]);
  
  // 경로의 특정 인덱스로 이동 (브레드크럼 클릭용)
  const navigateToPathIndex = useCallback((index) => {
    console.log(`[NAVIGATION] navigateToPathIndex 호출:`, {
      index,
      isValidTree,
      currentPath,
      currentPathLength: currentPath.length,
      targetPath: currentPath.slice(0, index + 1)
    });
    
    if (!isValidTree) {
      console.log(`[NAVIGATION] 실패: 트리가 유효하지 않음`);
      return false;
    }
    
    if (index < 0 || index >= currentPath.length) {
      console.log(`[NAVIGATION] 실패: 인덱스 범위 오류`, { index, pathLength: currentPath.length });
      return false;
    }
    
    const newPath = currentPath.slice(0, index + 1);
    console.log(`[NAVIGATION] 경로 업데이트:`, { from: currentPath, to: newPath });
    
    setCurrentPath(newPath);
    return true;
  }, [currentPath, isValidTree]);
  
  // 상위 레벨로 이동
  const navigateUp = useCallback(() => {
    if (!canGoUp) return false;
    
    setCurrentPath(prev => prev.slice(0, -1));
    return true;
  }, [canGoUp]);
  
  // 특정 result_id로 직접 이동
  const navigateToResultId = useCallback((resultId) => {
    if (!isValidTree) return false;
    
    const path = buildPathToNode(treeData, resultId);
    if (path.length === 0) return false;
    
    setCurrentPath(path);
    return true;
  }, [treeData, isValidTree]);
  
  // 루트로 이동
  const navigateToRoot = useCallback(() => {
    if (!isValidTree || treeData.length === 0) return false;
    
    setCurrentPath([treeData[0].result_id]);
    return true;
  }, [treeData, isValidTree]);
  
  // 현재 위치의 형제 노드들 가져오기
  const getSiblings = useCallback(() => {
    if (!isValidTree || currentPath.length === 0) return [];
    
    if (currentPath.length === 1) {
      // 루트 레벨의 형제들
      return treeData;
    }
    
    // 부모의 자식들 (형제들)
    const parentPath = currentPath.slice(0, -1);
    const parentNode = getNodeByPath(treeData, parentPath);
    return parentNode ? getAvailableChildren(parentNode) : [];
  }, [currentPath, treeData, isValidTree]);
  
  // 네비게이션 기록 (뒤로가기용)
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // 경로 변경시 히스토리 업데이트
  useEffect(() => {
    if (currentPath.length > 0) {
      setNavigationHistory(prev => {
        const newHistory = [...prev, [...currentPath]];
        // 히스토리 크기 제한 (최대 10개)
        return newHistory.slice(-10);
      });
    }
  }, [currentPath]);
  
  // 뒤로가기
  const goBack = useCallback(() => {
    if (navigationHistory.length < 2) return false;
    
    const previousPath = navigationHistory[navigationHistory.length - 2];
    setCurrentPath(previousPath);
    setNavigationHistory(prev => prev.slice(0, -1));
    return true;
  }, [navigationHistory]);
  
  // 디버그 정보
  const debugInfo = useMemo(() => ({
    isValidTree,
    currentPath,
    currentNodeId: currentNode?.result_id,
    availableChildrenCount: availableChildren.length,
    canGoDeeper,
    canGoUp,
    versionPath,
    navigationHistoryLength: navigationHistory.length
  }), [
    isValidTree,
    currentPath,
    currentNode,
    availableChildren.length,
    canGoDeeper,
    canGoUp,
    versionPath,
    navigationHistory.length
  ]);
  
  return {
    // 현재 상태
    currentPath,
    currentNode,
    currentResultId: currentNode?.result_id || null,
    availableChildren,
    versionPath,
    
    // 상태 플래그
    canGoDeeper,
    canGoUp,
    isValidTree,
    
    // 네비게이션 함수들
    navigateToChild,
    navigateToPathIndex,
    navigateUp,
    navigateToResultId,
    navigateToRoot,
    goBack,
    
    // 유틸리티 함수들
    getSiblings,
    
    // 디버그
    debugInfo
  };
};