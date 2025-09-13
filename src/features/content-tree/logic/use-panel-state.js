/**
 * use-panel-state.js
 * 패널 상태 관리를 위한 커스텀 훅
 */

import { useState, useEffect } from 'react';

/**
 * 패널 상태 관리 훅
 * @returns {Object} 패널 상태 관리 객체
 */
export const usePanelState = () => {
  // 열린 패널들의 상태를 관리 (여러 패널 동시 열기 가능)
  const [openPanels, setOpenPanels] = useState(new Set());
  // 서브 패널들의 상태를 관리 (2레벨+ 자식 표시용)
  const [openSubPanels, setOpenSubPanels] = useState(new Set());
  
  // 폴더 탐색 상태 관리
  const [currentPath, setCurrentPath] = useState([]); // 현재 위치 경로 스택
  const [pathHistory, setPathHistory] = useState([]); // 네비게이션 히스토리

  /**
   * 패널 토글 함수
   */
  const togglePanel = (nodeId) => {
    setOpenPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  /**
   * 서브 패널 토글 함수 (2레벨+ 자식용)
   */
  const toggleSubPanel = (nodeId) => {
    setOpenSubPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  /**
   * 폴더로 진입하는 함수
   * @param {Object} node - 진입할 노드 정보
   */
  const navigateToFolder = (node) => {
    setPathHistory(prev => [...prev, currentPath]);
    setCurrentPath(prev => [...prev, {
      id: node.result_id || node.id,
      title: node.title,
      version: node.version,
      children: node.children
    }]);
  };

  /**
   * 이전 폴더로 돌아가는 함수
   */
  const navigateBack = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      setCurrentPath(previousPath);
      setPathHistory(prev => prev.slice(0, -1));
    } else {
      // 루트로 돌아가기
      setCurrentPath([]);
    }
  };

  /**
   * 특정 경로로 직접 이동하는 함수
   * @param {number} index - 이동할 경로 인덱스
   */
  const navigateToPathIndex = (index) => {
    if (index < currentPath.length - 1) {
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);
      // 히스토리도 적절히 조정
      setPathHistory(prev => prev.slice(0, Math.max(0, prev.length - (currentPath.length - 1 - index))));
    }
  };

  /**
   * 현재 표시할 자식 노드들을 가져오는 함수
   * @param {Array} rootNodes - 루트 노드들
   * @returns {Array} 현재 레벨의 자식 노드들
   */
  const getCurrentLevelChildren = (rootNodes) => {
    if (currentPath.length === 0) {
      return rootNodes; // 루트 레벨
    }
    
    // 경로를 따라 현재 위치의 자식들 찾기
    const currentNode = currentPath[currentPath.length - 1];
    return currentNode.children || [];
  };

  // 외부 클릭 및 ESC 키로 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 모달이 열려있는 경우 트리 패널 닫지 않음
      const isModalOpen = document.querySelector('[role="dialog"]') || 
                          document.querySelector('.modal') ||
                          document.querySelector('[data-modal]');
      
      if (isModalOpen) {
        return;
      }

      // 클릭한 요소가 뱃지나 패널 내부가 아닌 경우 모든 패널 닫기
      const isClickOnBadgeOrPanel = event.target.closest('[data-panel-trigger]') || 
                                    event.target.closest('[data-panel-content]');
      
      if (!isClickOnBadgeOrPanel && (openPanels.size > 0 || openSubPanels.size > 0)) {
        setOpenPanels(new Set());
        setOpenSubPanels(new Set());
      }
    };

    const handleEscapeKey = (event) => {
      // 모달이 열려있는 경우 트리 패널은 닫지 않음 (모달이 먼저 닫혀야 함)
      const isModalOpen = document.querySelector('[role="dialog"]') || 
                          document.querySelector('.modal') ||
                          document.querySelector('[data-modal]');
      
      if (isModalOpen) {
        return;
      }

      if (event.key === 'Escape' && (openPanels.size > 0 || openSubPanels.size > 0)) {
        setOpenPanels(new Set());
        setOpenSubPanels(new Set());
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // 클린업
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [openPanels.size, openSubPanels.size]);

  return {
    openPanels,
    openSubPanels,
    togglePanel,
    toggleSubPanel,
    currentPath,
    pathHistory,
    navigateToFolder,
    navigateBack,
    navigateToPathIndex,
    getCurrentLevelChildren
  };
};