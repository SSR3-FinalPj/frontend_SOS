/**
 * ContentTreeView 컴포넌트
 * 콘텐츠의 트리 구조(버전 히스토리)를 표시하는 컴포넌트
 * 기존 ContentItemCard를 재활용하여 구현
 */

import React from 'react';
import ContentItemCard from '@/features/content-management/ui/ContentItemCard';

/**
 * ContentTreeView 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.contents - 콘텐츠 배열 (루트 + 자식)
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Array} props.uploading_items - 업로드 중인 아이템 목록
 * @param {Function} props.on_preview - 미리보기 클릭 핸들러
 * @param {Function} props.on_publish - 게시 클릭 핸들러
 * @returns {JSX.Element} ContentTreeView 컴포넌트
 */
function ContentTreeView({ 
  contents = [], 
  dark_mode = false,
  uploading_items = [],
  on_preview,
  on_publish 
}) {
  // 트리 구조 구성: 루트 노드와 자식 노드 분리
  const root_nodes = contents.filter(content => !content.parentId);
  const child_nodes = contents.filter(content => content.parentId);

  /**
   * 특정 부모 ID의 자식들을 반환
   * @param {string} parent_id - 부모 노드 ID
   * @returns {Array} 자식 노드 배열
   */
  const get_children_of = (parent_id) => {
    return child_nodes.filter(child => child.parentId === parent_id);
  };

  // 콘텐츠가 없을 때 빈 상태 표시
  if (contents.length === 0) {
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

      {/* 트리 구조 렌더링 */}
      <div className="space-y-8">
        {root_nodes.map((root_node) => {
          const children = get_children_of(root_node.id);
          const has_children = children.length > 0;

          return (
            <div key={root_node.id} className="relative">
              {/* 루트 노드 - 기존 ContentItemCard 재활용 */}
              <div className="flex items-start">
                <div className="w-80">
                  <ContentItemCard
                    item={root_node}
                    dark_mode={dark_mode}
                    uploading_items={uploading_items}
                    on_preview={on_preview}
                    on_publish={on_publish}
                  />
                </div>
              </div>

              {/* 자식 노드들이 있으면 파생 버전 섹션 표시 */}
              {has_children && (
                <div className="ml-8 mt-6 relative">
                  {/* 연결선 */}
                  <div className={`absolute -left-4 top-0 bottom-0 w-px ${
                    dark_mode ? 'bg-gray-600/50' : 'bg-gray-300/50'
                  }`}></div>
                  
                  {/* 파생 버전 컨테이너 */}
                  <div className={`relative rounded-lg p-4 border backdrop-blur-sm ${
                    dark_mode 
                      ? 'bg-gray-800/20 border-gray-600/30' 
                      : 'bg-gray-50/20 border-gray-300/30'
                  }`}>
                    {/* 파생 버전 헤더 */}
                    <div className={`text-sm mb-3 flex items-center gap-2 ${
                      dark_mode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      파생 버전들 (v{root_node.version} 기반)
                    </div>

                    {/* 자식 노드들 */}
                    <div className="grid gap-4">
                      {children.map((child) => (
                        <div key={child.id} className="relative flex items-start">
                          {/* 자식 노드 연결선 */}
                          <div className={`absolute -left-8 top-1/2 w-4 h-px ${
                            dark_mode ? 'bg-gray-600/50' : 'bg-gray-300/50'
                          }`}></div>
                          <div className="absolute -left-8 top-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 -translate-x-px -translate-y-px"></div>
                          
                          {/* 자식 노드 카드 - 기존 ContentItemCard 재활용 */}
                          <div className="w-72">
                            <ContentItemCard
                              item={child}
                              dark_mode={dark_mode}
                              uploading_items={uploading_items}
                              on_preview={on_preview}
                              on_publish={on_publish}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(ContentTreeView);