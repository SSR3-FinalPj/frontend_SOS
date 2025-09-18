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

  // 버전 정보 자동 부여: 루트는 1.0, 1레벨 자식부터 1.1, 1.2 ...
  assignVersionByDepth(roots);
  return roots;
};

/**
 * 각 노드에 깊이 기반 버전명을 부여하는 함수
 * @param {Array} nodes - 노드 배열
 * @param {number} depth - 현재 깊이(루트=0)
 */
export const assignVersionByDepth = (nodes, depth = 0) => {
  if (!Array.isArray(nodes)) return;

  const versionForDepth = depth === 0 ? '1.0' : `1.${depth}`;

  nodes.forEach((node) => {
    if (!node) return;

    // 깊이 기반 버전명 부여 (이미 존재하면 유지)
    node.version = node.version || versionForDepth;
    node.version_depth = depth;

    if (Array.isArray(node.children) && node.children.length > 0) {
      assignVersionByDepth(node.children, depth + 1);
    }
  });
};

/**
 * 트리 데이터를 버전 단위(깊이)로 그룹화합니다.
 * version-navigation 전용 구조로 사용됩니다.
 * @param {Array} rootNodes - 트리의 루트 노드 배열
 * @returns {Array} 버전 그룹 배열 (깊이 순)
 */
export const buildVersionGroups = (rootNodes = []) => {
  if (!Array.isArray(rootNodes) || rootNodes.length === 0) return [];

  // 먼저 버전 정보가 없을 경우를 대비해 할당
  assignVersionByDepth(rootNodes, 0);

  const groups = [];
  let currentLevel = rootNodes;
  let depth = 0;

  while (currentLevel.length > 0) {
    const versionValue = depth === 0 ? '1.0' : `1.${depth}`;

    groups.push({
      depth,
      version: versionValue,
      versionLabel: `v${versionValue}`,
      nodes: currentLevel,
    });

    const nextLevel = currentLevel.flatMap((node) => Array.isArray(node.children) ? node.children : []);
    currentLevel = nextLevel;
    depth += 1;
  }

  return groups;
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
