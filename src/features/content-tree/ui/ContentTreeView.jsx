/**
 * ContentTreeView 컴포넌트
 * 콘텐츠의 트리 구조(버전 히스토리)를 표시하는 컴포넌트
 * 백엔드 API의 result_id + children 중첩 구조를 재귀적으로 렌더링
 * 버전 3개 이후부터는 가로 스크롤 캐러셀 UI 적용
 */

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, GitBranch } from 'lucide-react';
import { Button } from '@/common/ui/button';
import { Badge } from '@/common/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import ContentItemCard from '@/features/content-management/ui/ContentItemCard';

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

  /**
   * 컴팩트한 버전 카드 컴포넌트 - Hover Preview에서 사용
   */
  const CompactVersionCard = ({ child, dark_mode, on_preview, on_publish }) => {
    const child_id = child.result_id || child.id;
    
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-3 rounded-lg border backdrop-blur-sm cursor-pointer group transition-all duration-200 ${
          dark_mode 
            ? 'bg-gray-800/80 border-gray-600/50 hover:border-blue-400/50' 
            : 'bg-white/80 border-gray-300/50 hover:border-blue-400/50'
        }`}
        style={{ minWidth: '180px' }}
      >
        {/* 썸네일 */}
        <div className="relative w-full h-20 rounded-md overflow-hidden mb-2">
          {child.thumbnail ? (
            <img 
              src={child.thumbnail} 
              alt={child.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              dark_mode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <Eye className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          {/* 버전 뱃지 */}
          <div className="absolute top-1 right-1">
            <Badge className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300">
              v{child.version || '1.0'}
            </Badge>
          </div>
        </div>

        {/* 제목 */}
        <div className={`text-sm font-medium mb-1 truncate ${
          dark_mode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {child.title || '제목 없음'}
        </div>

        {/* 상태 */}
        <div className="flex items-center justify-between">
          <div className={`text-xs ${
            child.status === 'completed' ? 'text-green-500' : 
            child.status === 'processing' ? 'text-yellow-500' : 
            'text-gray-500'
          }`}>
            {child.status === 'completed' ? '완료' : 
             child.status === 'processing' ? '처리중' : '대기'}
          </div>
          
          {/* 액션 버튼들 */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                on_preview?.(child);
              }}
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  /**
   * 버전 뱃지 + Hover Preview 패널 컴포넌트
   */
  const VersionsBadgeWithPreview = ({ children, node_id, node_version, dark_mode, on_preview, on_publish }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    
    // 최대 4개까지만 미리보기에 표시
    const previewChildren = children.slice(0, 4);
    
    return (
      <div 
        className="relative"
        onMouseEnter={() => {
          setIsHovered(true);
          // 약간의 지연 후 패널 표시 (너무 빠른 호버 방지)
          setTimeout(() => setShowPreview(true), 150);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowPreview(false);
        }}
      >
        {/* 버전 뱃지 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1 cursor-pointer"
        >
          <Badge 
            className={`px-2 py-1 text-xs font-medium transition-all duration-200 ${
              isHovered 
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-400/50' 
                : dark_mode 
                  ? 'bg-gray-700/50 text-gray-300 border-gray-600/50' 
                  : 'bg-gray-100/50 text-gray-600 border-gray-300/50'
            }`}
            variant="outline"
          >
            <GitBranch className="w-3 h-3 mr-1" />
            {children.length}개 버전
          </Badge>
        </motion.div>

        {/* Hover Preview 패널 */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                staggerChildren: 0.05
              }}
              className={`absolute top-0 left-full ml-4 z-50 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${
                dark_mode 
                  ? 'bg-gray-800/95 border-gray-600/30' 
                  : 'bg-white/95 border-gray-300/30'
              }`}
              style={{ minWidth: '400px', maxWidth: '600px' }}
            >
              {/* 헤더 */}
              <div className={`text-sm mb-3 flex items-center gap-2 ${
                dark_mode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                파생 버전들 (v{node_version || '1.0'} 기반)
              </div>

              {/* 버전 카드 그리드 */}
              <motion.div 
                className="grid grid-cols-2 gap-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {previewChildren.map((child, index) => (
                  <motion.div
                    key={child.result_id || child.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <CompactVersionCard
                      child={child}
                      dark_mode={dark_mode}
                      on_preview={on_preview}
                      on_publish={on_publish}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* 더 많은 버전이 있을 때 안내 */}
              {children.length > 4 && (
                <motion.div 
                  className={`text-center mt-3 text-xs ${
                    dark_mode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  +{children.length - 4}개 버전 더 있음
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
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
                dark_mode={dark_mode}
                on_preview={on_preview}
                on_publish={on_publish}
              />
            </div>
          )}
        </div>

      </div>
    );
  };

  /**
   * 평면 리스트를 트리 구조로 변환하는 함수
   */
  const convert_to_tree_data = (flat_contents) => {
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

  // tree_data 우선, 없으면 contents를 트리로 변환
  const final_tree_data = tree_data && tree_data.length > 0 
    ? tree_data 
    : convert_to_tree_data(contents);

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