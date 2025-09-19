/**
 * ContentTreeView 컴포넌트
 * 콘텐츠의 트리 구조(버전 히스토리)를 표시하는 컴포넌트
 * 백엔드 API의 result_id + children 중첩 구조를 재귀적으로 렌더링
 * 버전 3개 이후부터는 가로 스크롤 캐러셀 UI 적용
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentItemCard from '@/features/content-management/ui/ContentItemCard';
import VersionsBadgeWithPreview from './VersionsBadgeWithPreview';
import { usePanelState } from '../logic/use-panel-state';
import { convertToTreeData } from '../logic/tree-utils';

/**
 * ContentTreeView 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.tree_data - 중첩된 트리 구조 데이터 (result_id + children)
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Array} props.uploading_items - 업로드 중인 아이템 목록
 * @param {Function} props.on_preview - 미리보기 클릭 핸들러
 * @param {Function} props.on_publish - 게시 클릭 핸들러
 * @returns {JSX.Element} ContentTreeView 컴포넌트
 */
function ContentTreeView({ 
  tree_data = [],
  contents = [], // ProjectHistoryContainer에서 전달하는 평면 리스트 
  dark_mode = false,
  uploading_items = [],
  on_preview,
  on_publish 
}) {
  // 패널 상태 및 폴더 탐색 관리
  const { 
    openPanels, 
    openSubPanels, 
    togglePanel, 
    toggleSubPanel,
    currentPath,
    navigateToFolder,
    navigateBack,
    navigateToPathIndex,
    getCurrentLevelChildren
  } = usePanelState();




  /**
   * 재귀적으로 트리 노드를 렌더링하는 함수
   * @param {Object} node - 트리 노드 (result_id, children 포함)
   * @param {number} depth - 현재 깊이 (0부터 시작)
   * @param {boolean} is_root - 루트 노드 여부
   * @returns {JSX.Element} 렌더링된 트리 노드
   */
  const render_tree_node = (node, depth = 0, is_root = true) => {
    const has_children = node.children && node.children.length > 0;
    const node_id = node.result_id || node.id; // 백엔드는 result_id, 로컬은 id 지원
    
    return (
      <div key={node_id} className={`relative ${depth > 0 ? 'mt-6' : ''}`}>
        {/* 현재 노드 카드 */}
        <div className="flex items-start">
          <div className={`${is_root ? 'w-80' : 'w-64'} ${depth > 1 ? 'w-56' : ''}`}>
            <ContentItemCard
              item={{
                ...node,
                id: node_id // ContentItemCard가 id 필드를 기대하므로 변환
              }}
              dark_mode={dark_mode}
              uploading_items={uploading_items}
              on_preview={on_preview}
              on_publish={on_publish}
            />
          </div>
          
          {/* 자식이 있을 때 버전 뱃지 표시 */}
          {has_children && (
            <div className="ml-4 mt-2">
              <VersionsBadgeWithPreview
                children={node.children}
                node_id={node_id}
                node_version={node.version}
                isOpen={openPanels.has(node_id)}
                dark_mode={dark_mode}
                onToggle={() => togglePanel(node_id)}
                on_preview={on_preview}
                on_publish={on_publish}
                onNavigateToFolder={navigateToFolder}
                onNavigateBack={navigateBack}
                onNavigateToPath={navigateToPathIndex}
                currentPath={currentPath}
                getCurrentLevelChildren={getCurrentLevelChildren}
              />
            </div>
          )}
        </div>

      </div>
    );
  };


  // tree_data 우선, 없으면 contents를 트리로 변환
  const final_tree_data = tree_data && tree_data.length > 0 
    ? tree_data 
    : convertToTreeData(contents);

  // 데이터가 없을 때 빈 상태 표시
  if (!final_tree_data || final_tree_data.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
          이 프로젝트에는 아직 생성된 콘텐츠가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 창작의 역사 지도 헤더 */}
      <div className="mb-4">
        <h3 className={`text-sm ${dark_mode ? 'text-gray-400' : 'text-gray-600'}`}>
          창작의 역사 지도
        </h3>
      </div>

      {/* 트리 구조 재귀 렌더링 */}
      <div className="space-y-8">
        {final_tree_data.map((root_node) => render_tree_node(root_node, 0, true))}
      </div>
    </div>
  );
}

export default React.memo(ContentTreeView);