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



export const useVersionNavigation = (treeData = [], initialResultId = null) => {
  const [currentPath, setCurrentPath] = useState([]);
  
  const isValidTree = useMemo(() => validateTreeData(treeData), [treeData]);
  
  useEffect(() => {
    if (!isValidTree || treeData.length === 0) {
      setCurrentPath([]);
      return;
    }
    
    if (initialResultId) {
      const path = buildPathToNode(treeData, initialResultId);
      if (path.length > 0) {
        setCurrentPath(path);
        return;
      }
    }
    
    const rootId = treeData[0].result_id || treeData[0].resultId;
    if (rootId) {
      setCurrentPath([rootId]);
    }
  }, [treeData, initialResultId, isValidTree]);
  
  const currentNode = useMemo(() => {
    if (!isValidTree || currentPath.length === 0) return null;
    return getNodeByPath(treeData, currentPath);
  }, [treeData, currentPath, isValidTree]);
  
  const availableChildren = useMemo(() => {
    if (!currentNode) return [];
    return getAvailableChildren(currentNode);
  }, [currentNode]);
  
  const canGoDeeper = useMemo(() => {
    return availableChildren.length > 0;
  }, [availableChildren]);
  
  const canGoUp = useMemo(() => {
    return currentPath.length > 1;
  }, [currentPath]);
  
  const versionPath = useMemo(() => {
    if (!isValidTree) return [];
    return pathToVersionStrings(currentPath, treeData);
  }, [currentPath, treeData, isValidTree]);
  
  const navigateToChild = useCallback((childResultId) => {
    if (!isValidTree) return false;
    const childNode = availableChildren.find(child => (child.result_id || child.resultId) === childResultId);
    if (!childNode) return false;
    const newPath = [...currentPath, childResultId];
    setCurrentPath(newPath);
    return true;
  }, [availableChildren, isValidTree, currentPath]);
  
  const navigateToPathIndex = useCallback((index) => {
    if (!isValidTree) return false;
    if (index < 0 || index >= currentPath.length) return false;
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    return true;
  }, [currentPath, isValidTree]);
  
  const navigateUp = useCallback(() => {
    if (!canGoUp) return false;
    setCurrentPath(prev => prev.slice(0, -1));
    return true;
  }, [canGoUp]);
  
  const navigateToResultId = useCallback((resultId) => {
    if (!isValidTree) return false;
    const path = buildPathToNode(treeData, resultId);
    if (path.length === 0) return false;
    setCurrentPath(path);
    return true;
  }, [treeData, isValidTree]);
  
  const navigateToRoot = useCallback(() => {
    if (!isValidTree || treeData.length === 0) return false;
    const rootId = treeData[0].result_id || treeData[0].resultId;
    if (rootId) {
      setCurrentPath([rootId]);
    }
    return true;
  }, [treeData, isValidTree]);
  
  const getSiblings = useCallback(() => {
    if (!isValidTree || currentPath.length === 0) return [];
    if (currentPath.length === 1) return treeData;
    const parentPath = currentPath.slice(0, -1);
    const parentNode = getNodeByPath(treeData, parentPath);
    return parentNode ? getAvailableChildren(parentNode) : [];
  }, [currentPath, treeData, isValidTree]);
  
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  useEffect(() => {
    if (currentPath.length > 0) {
      setNavigationHistory(prev => {
        const newHistory = [...prev, [...currentPath]];
        return newHistory.slice(-10);
      });
    }
  }, [currentPath]);
  
  const goBack = useCallback(() => {
    if (navigationHistory.length < 2) return false;
    const previousPath = navigationHistory[navigationHistory.length - 2];
    setCurrentPath(previousPath);
    setNavigationHistory(prev => prev.slice(0, -1));
    return true;
  }, [navigationHistory]);
  
  const debugInfo = useMemo(() => ({
    isValidTree,
    currentPath,
    currentNodeId: currentNode ? (currentNode.result_id || currentNode.resultId) : null,
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
    currentPath,
    currentNode,
    currentResultId: currentNode ? (currentNode.result_id || currentNode.resultId) : null,
    availableChildren,
    versionPath,
    canGoDeeper,
    canGoUp,
    isValidTree,
    navigateToChild,
    navigateToPathIndex,
    navigateUp,
    navigateToResultId,
    navigateToRoot,
    goBack,
    getSiblings,
    debugInfo
  };
};
