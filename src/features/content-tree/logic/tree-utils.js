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
  // parentId가 null인 루트 노드들을 찾아서 트리 구조 생성
  const buildTree = (items, parent_id = null) => {
    return items
      .filter(item => (item.parentId || null) === parent_id)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }));
  };
  
  return buildTree(flat_contents);
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