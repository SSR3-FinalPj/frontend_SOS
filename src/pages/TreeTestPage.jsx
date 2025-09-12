import React, { useMemo, useState } from 'react';
import { normalizeResultsTree } from '@/domain/tree/logic/normalize-results-tree';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';

// Minimal recursive tree renderer for testing
function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="text-sm">
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => hasChildren && setExpanded((v) => !v)}
        style={{ paddingLeft: depth * 12 }}
      >
        <span className="mr-1 text-gray-400">
          {hasChildren ? (expanded ? '▾' : '▸') : '•'}
        </span>
        <span className="text-gray-800 dark:text-gray-100">{node.title}</span>
        <span className="ml-2 text-xs text-gray-400">(id: {node.id})</span>
      </div>
      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeTestPage() {
  const results_tree = use_content_launch((s) => s.results_tree);
  // Mock backend response from user sample
  const apiResponse = [
    {
      result_id: 1,
      children: [
        { result_id: 3, children: [] },
        { result_id: 4, children: [ { result_id: 6, children: [] } ] },
        { result_id: 5, children: [] },
      ],
    },
    {
      result_id: 2,
      children: [],
    },
  ];

  const labelMap = {
    '1': '강남역 AI 영상',
    '2': '보조 영상',
    '3': '수정본 v3',
    '4': '수정본 v4',
    '5': '수정본 v5',
    '6': '수정본 v6',
  };

  // If store has a real tree, use it; otherwise fall back to sample
  const fallbackData = useMemo(() => normalizeResultsTree(apiResponse, { labelMap }), [apiResponse]);
  const treeData = results_tree && results_tree.length > 0 ? results_tree : fallbackData;

  const totalCount = useMemo(() => {
    let count = 0;
    const walk = (nodes) => {
      for (const n of nodes) {
        count += 1;
        if (n.children?.length) walk(n.children);
      }
    };
    walk(treeData);
    return count;
  }, [treeData]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Tree Test</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          소스: {results_tree?.length ? 'store(results_tree)' : 'sample(fallback)'} · 총 노드 수: {totalCount}
        </p>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
          {treeData.map((root) => (
            <TreeNode key={root.id} node={root} />
          ))}
        </div>
      </div>
    </div>
  );
}
