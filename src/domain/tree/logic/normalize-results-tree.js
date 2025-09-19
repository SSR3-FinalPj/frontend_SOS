// Normalize backend results tree into UI-friendly tree nodes
// Input example:
// [
//   { result_id: 1, children: [ { result_id: 3, children: [] } ] },
//   { result_id: 2, children: [] }
// ]

export function normalizeResultsTree(items, { labelMap } = {}) {
  const toNode = (node) => {
    // Accept both result_id (snake) and resultId (camel) from backend
    const rawId = node?.result_id ?? node?.resultId ?? "";
    const numericId = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
    const safeId = Number.isFinite(numericId) ? numericId : 0;
    const idKey = String(safeId);
    const children = Array.isArray(node?.children) ? node.children.map(toNode) : [];
    return {
      result_id: safeId,
      title: labelMap?.[idKey] ?? `영상 ${idKey}`,
      children,
    };
  };

  return Array.isArray(items) ? items.map(toNode) : [];
}
