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
  if (!flat_contents || flat_contents.length === 0) return [];

  // 캐노니컬 ID 유틸
  const cid = (item) => item?.result_id || item?.id || item?.resultId || item?.temp_id || null;
  const pid = (item) => item?.parent_video_id || item?.parentId || item?.parent_id || item?.parentResultId || item?.parent_temp_id || null;

  // 1패스: 노드 맵 구성 (ID 보정 + children 초기화)
  const nodeMap = new Map();
  flat_contents.forEach((raw) => {
    const id = cid(raw);
    const base = {
      ...raw,
      result_id: raw?.result_id || id, // result_id 보정
      children: []
    };
    if (id != null) {
      nodeMap.set(String(id), base);
    } else {
      // ID가 전혀 없는 경우에도 고립 루트로 취급하도록 임시 ID 부여
      const fallback = String(Date.now() + Math.random());
      nodeMap.set(fallback, { ...base, result_id: fallback });
    }
  });

  // 2패스: 부모-자식 링크
  const roots = [];
  nodeMap.forEach((node, key) => {
    const parentKey = pid(node);
    if (parentKey != null && nodeMap.has(String(parentKey))) {
      const parent = nodeMap.get(String(parentKey));
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
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
