/**
 * tree-utils.js
 * 트리 구조 변환 및 처리를 위한 유틸리티 함수들
 */

/**
 * 평면 리스트를 트리 구조로 변환하는 함수
 * @param {Array} flat_contents - 평면 리스트
 * @returns {Array} 트리 구조
 */
export const convertToTreeData = (flat_contents) => {
  if (!flat_contents || flat_contents.length === 0) {
    return [];
  }
  
  // parentId가 null인 루트 노드들을 찾아서 트리 구조 생성
  const buildTree = (items, parent_id = null) => {
    return items
      .filter(item => (item.parentId || null) === parent_id)
      .map(item => ({
        ...item,
        result_id: item.id || item.result_id || item.resultId, // result_id 필드 보장
        children: buildTree(items, item.id)
      }));
  };
  
  const tree = buildTree(flat_contents);
  
  // 항상 유효한 트리를 반환하도록 개선
  if (tree.length === 0 && flat_contents.length > 0) {
    // 모든 아이템을 루트로 처리 (단일 영상 지원)
    return flat_contents.map(item => ({
      ...item,
      result_id: item.id || item.result_id || item.resultId || Date.now(), // 안전한 ID 보장
      children: [] // 단일 노드는 자식이 없음
    }));
  }
  
  // 빈 배열이 아닌 경우에도 result_id가 없는 노드들을 보정
  const ensureResultIds = (nodes) => {
    return nodes.map(node => ({
      ...node,
      result_id: node.result_id || node.id || node.resultId || Date.now(),
      children: node.children ? ensureResultIds(node.children) : []
    }));
  };
  
  return ensureResultIds(tree);
};

/**
 * 중첩된 자식들을 플랫하게 변환하는 함수
 * @param {Array} nodes - 중첩된 노드들
 * @returns {Array} 플랫한 노드들
 */
export const flattenSubChildren = (nodes) => {
  let flattened = [];
  nodes.forEach(node => {
    flattened.push(node);
    if (node.children && node.children.length > 0) {
      flattened.push(...flattenSubChildren(node.children));
    }
  });
  return flattened;
};