// Normalize backend results tree into UI-friendly tree nodes
// Input example:
// [
//   { result_id: 1, children: [ { result_id: 3, children: [] } ] },
//   { result_id: 2, children: [] }
// ]

export function normalizeResultsTree(items, { labelMap } = {}) {
  const toNode = (node) => {
    const id = String(node?.result_id ?? "");
    const children = Array.isArray(node?.children) ? node.children.map(toNode) : [];
    return {
      id,
      title: labelMap?.[id] ?? `영상 ${id}`,
      children,
    };
  };

  return Array.isArray(items) ? items.map(toNode) : [];
}

