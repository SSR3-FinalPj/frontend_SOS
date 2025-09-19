/**
 * 버전 트리 탐색 및 조작을 위한 유틸리티 함수들
 * 백엔드에서 result_id + children 구조로 들어오는 데이터를 처리
 */

/**
 * result_id로 트리에서 노드를 찾는 함수
 * @param {Array} treeData - 트리 데이터 배열
 * @param {number} targetResultId - 찾을 result_id
 * @returns {Object|null} 찾은 노드 또는 null
 */
export const findNodeByResultId = (treeData, targetResultId) => {
  for (const node of treeData) {
    if (node.result_id === targetResultId) {
      return node;
    }
    
    if (node.children && node.children.length > 0) {
      const found = findNodeByResultId(node.children, targetResultId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 경로 배열을 따라 노드를 찾는 함수
 * @param {Array} treeData - 트리 데이터 배열  
 * @param {Array} path - result_id 경로 배열 [1, 4, 6]
 * @returns {Object|null} 찾은 노드 또는 null
 */
export const getNodeByPath = (treeData, path) => {
  if (!path || path.length === 0) return null;
  
  let currentLevel = treeData;
  let currentNode = null;
  
  for (const resultId of path) {
    currentNode = currentLevel.find(node => node.result_id === resultId);
    if (!currentNode) return null;
    
    // 마지막 경로가 아니라면 children으로 이동
    if (path.indexOf(resultId) < path.length - 1) {
      currentLevel = currentNode.children || [];
    }
  }
  
  return currentNode;
};

/**
 * 노드에서 루트까지의 경로를 구성하는 함수
 * @param {Array} treeData - 트리 데이터 배열
 * @param {number} targetResultId - 대상 result_id
 * @returns {Array} result_id 경로 배열
 */
export const buildPathToNode = (treeData, targetResultId) => {
  const findPath = (nodes, target, currentPath = []) => {
    for (const node of nodes) {
      const newPath = [...currentPath, node.result_id];
      
      if (node.result_id === target) {
        return newPath;
      }
      
      if (node.children && node.children.length > 0) {
        const found = findPath(node.children, target, newPath);
        if (found) return found;
      }
    }
    return null;
  };
  
  return findPath(treeData, targetResultId) || [];
};

/**
 * 노드의 모든 가용한 자식들을 가져오는 함수
 * @param {Object} node - 대상 노드
 * @returns {Array} 자식 노드 배열
 */
export const getAvailableChildren = (node) => {
  if (!node || !node.children) return [];
  return node.children;
};

/**
 * 트리에서 특정 노드의 부모를 찾는 함수
 * @param {Array} treeData - 트리 데이터 배열
 * @param {number} targetResultId - 자식 노드의 result_id
 * @returns {Object|null} 부모 노드 또는 null (루트인 경우)
 */
export const findParentNode = (treeData, targetResultId) => {
  const findParent = (nodes, target, parent = null) => {
    for (const node of nodes) {
      if (node.result_id === target) {
        return parent;
      }
      
      if (node.children && node.children.length > 0) {
        const found = findParent(node.children, target, node);
        if (found !== undefined) return found;
      }
    }
    return undefined;
  };
  
  const result = findParent(treeData, targetResultId);
  return result === undefined ? null : result;
};

/**
 * 경로를 버전 문자열로 변환하는 함수
 * @param {Array} path - result_id 경로 배열
 * @param {Array} treeData - 트리 데이터 (버전 정보 조회용)
 * @returns {Array} 버전 문자열 배열 ["v1.0", "v1.1", "v1.2"]
 */
export const pathToVersionStrings = (path, treeData) => {
  if (!path || path.length === 0) return [];
  
  return path.map((resultId, index) => {
    const partialPath = path.slice(0, index + 1);
    const node = getNodeByPath(treeData, partialPath);
    
    // 노드에 version 정보가 있으면 사용, 없으면 기본 형식
    if (node && node.version) {
      return `v${node.version}`;
    }
    
    // 기본적으로 깊이 기반 버전 생성
    const major = 1;
    const minor = index;
    return `v${major}.${minor}`;
  });
};

/**
 * 트리 데이터가 유효한지 검증하는 함수
 * @param {Array} treeData - 검증할 트리 데이터
 * @returns {boolean} 유효성 여부
 */
export const validateTreeData = (treeData) => {
  if (!Array.isArray(treeData)) return false;
  
  const validateNode = (node) => {
    if (!node || typeof node !== 'object') return false;
    if (!node.result_id || typeof node.result_id !== 'number') return false;
    
    if (node.children) {
      if (!Array.isArray(node.children)) return false;
      return node.children.every(validateNode);
    }
    
    return true;
  };
  
  return treeData.every(validateNode);
};

/**
 * 트리의 최대 깊이를 계산하는 함수
 * @param {Array} treeData - 트리 데이터 배열
 * @returns {number} 최대 깊이
 */
export const getMaxDepth = (treeData) => {
  if (!treeData || treeData.length === 0) return 0;
  
  const calculateDepth = (nodes, currentDepth = 0) => {
    let maxDepth = currentDepth;
    
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const childDepth = calculateDepth(node.children, currentDepth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    }
    
    return maxDepth;
  };
  
  return calculateDepth(treeData) + 1; // +1 because we start from 0
};