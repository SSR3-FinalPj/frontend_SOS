/**
 * ContentTreeView 컴포넌트
 * 콘텐츠의 트리 구조(버전 히스토리)를 표시하는 컴포넌트
 * 백엔드 API의 result_id + children 중첩 구조를 재귀적으로 렌더링
 * 버전 3개 이후부터는 가로 스크롤 캐러셀 UI 적용
 */

import React, { useState, useRef, useEffect } from 'react';
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
  // 열린 패널들의 상태를 관리 (여러 패널 동시 열기 가능)
  const [openPanels, setOpenPanels] = useState(new Set());
  // 서브 패널들의 상태를 관리 (2레벨+ 자식 표시용)
  const [openSubPanels, setOpenSubPanels] = useState(new Set());

  // 외부 클릭 및 ESC 키로 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 모달이 열려있는 경우 트리 패널 닫지 않음
      const isModalOpen = document.querySelector('[role="dialog"]') || 
                          document.querySelector('.modal') ||
                          document.querySelector('[data-modal]');
      
      if (isModalOpen) {
        return;
      }

      // 클릭한 요소가 뱃지나 패널 내부가 아닌 경우 모든 패널 닫기
      const isClickOnBadgeOrPanel = event.target.closest('[data-panel-trigger]') || 
                                    event.target.closest('[data-panel-content]');
      
      if (!isClickOnBadgeOrPanel && (openPanels.size > 0 || openSubPanels.size > 0)) {
        setOpenPanels(new Set());
        setOpenSubPanels(new Set());
      }
    };

    const handleEscapeKey = (event) => {
      // 모달이 열려있는 경우 트리 패널은 닫지 않음 (모달이 먼저 닫혀야 함)
      const isModalOpen = document.querySelector('[role="dialog"]') || 
                          document.querySelector('.modal') ||
                          document.querySelector('[data-modal]');
      
      if (isModalOpen) {
        return;
      }

      if (event.key === 'Escape' && (openPanels.size > 0 || openSubPanels.size > 0)) {
        setOpenPanels(new Set());
        setOpenSubPanels(new Set());
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // 클린업
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [openPanels.size, openSubPanels.size]);


  /**
   * 서브 버전 패널 컴포넌트 - 2레벨+ 자식들을 표시
   */
  const SubVersionsPanel = ({ children, node_id, dark_mode, on_preview, on_publish }) => {
    const isOpen = openSubPanels.has(node_id);
    
    // 중첩된 자식들을 플랫하게 변환
    const flattenSubChildren = (nodes) => {
      let flattened = [];
      nodes.forEach(node => {
        flattened.push(node);
        if (node.children && node.children.length > 0) {
          flattened.push(...flattenSubChildren(node.children));
        }
      });
      return flattened;
    };
    
    const subChildren = children ? flattenSubChildren(children) : [];
    
    if (!isOpen || subChildren.length === 0) return null;
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25
          }}
          className={`mt-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg ${
            dark_mode 
              ? 'bg-gray-900/90 border-gray-700/50' 
              : 'bg-white/90 border-gray-200/50'
          }`}
          style={{ maxWidth: '400px' }}
          onClick={(e) => e.stopPropagation()}
          data-panel-content="true"
        >
          {/* 서브 패널 헤더 */}
          <div className={`text-sm font-semibold mb-3 flex items-center justify-between ${
            dark_mode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <span>하위 버전들</span>
            <button
              onClick={() => toggleSubPanel(node_id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                dark_mode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="w-3 h-3 flex items-center justify-center text-sm font-light">✕</div>
            </button>
          </div>
          
          {/* 서브헤더 */}
          <div className={`text-xs mb-3 ${
            dark_mode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {subChildren.length}개의 하위 버전
          </div>
          
          {/* 서브 버전 카드들 */}
          <motion.div 
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
            className="space-y-2"
          >
            {subChildren.map((child) => (
              <motion.div
                key={child.result_id || child.id}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  dark_mode 
                    ? 'hover:bg-gray-800/50 border border-gray-700/30' 
                    : 'hover:bg-gray-50 border border-gray-200/30'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  on_preview?.(child);
                }}
              >
                {/* 미니 썸네일 */}
                <div className="w-12 h-8 rounded-md overflow-hidden flex-shrink-0">
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
                      <Eye className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium truncate ${
                    dark_mode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    v{child.version || '1.0'} - {child.title || '제목 없음'}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    child.status === 'completed' ? 'text-green-500' : 
                    child.status === 'processing' ? 'text-yellow-500' : 
                    'text-gray-500'
                  }`}>
                    {child.status === 'completed' ? '완료' : 
                     child.status === 'processing' ? '처리중' : '대기'}
                  </div>
                </div>
                
                {/* 클릭 힌트 */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  /**
   * 서브 뱃지 컴포넌트 - 2레벨+ 자식이 있을 때 표시
   */
  const SubVersionsBadge = ({ childrenCount, onClick, dark_mode }) => {
    if (!childrenCount || childrenCount === 0) return null;
    
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={`mt-3 px-3 py-1 text-xs rounded-full transition-all duration-200 flex items-center gap-1 ${
          dark_mode 
            ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700/50' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/50'
        }`}
      >
        <span>{childrenCount}개 하위버전</span>
        <span className="text-xs opacity-60">›</span>
      </motion.button>
    );
  };

  /**
   * 컴팩트한 버전 카드 컴포넌트 - Apple 스타일 적용
   */
  const CompactVersionCard = ({ child, dark_mode, on_preview, on_publish, level = 1 }) => {
    const child_id = child.result_id || child.id;
    const hasSubChildren = child.children && child.children.length > 0;
    
    // 단순한 Apple 스타일 색상
    const cardStyles = {
      bgColor: dark_mode ? 'bg-gray-800/80' : 'bg-white/80',
      borderColor: 'border-gray-300/30',
      hoverBorder: dark_mode ? 'hover:border-gray-500/50' : 'hover:border-gray-400/50'
    };
    
    return (
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-3 rounded-xl border backdrop-blur-sm cursor-pointer group transition-all duration-200 ${
            cardStyles.bgColor
          } ${cardStyles.borderColor} ${cardStyles.hoverBorder}`}
          style={{ minWidth: '180px' }}
          onClick={(e) => {
            e.stopPropagation();
            on_preview?.(child);
          }}
        >
        {/* 썸네일 */}
        <div className="relative w-full h-20 rounded-lg overflow-hidden mb-2">
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
          
          {/* 레벨별 버전 뱃지 */}
          <div className="absolute top-1 right-1">
            <Badge className={`text-xs ${
              dark_mode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
            }`}>
              v{child.version || '1.0'}
            </Badge>
          </div>
        </div>

        {/* 제목 */}
        <div className={`text-sm font-medium mb-2 truncate ${
          dark_mode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {child.title || '제목 없음'}
        </div>

        {/* 상태 */}
        <div className="flex items-center justify-between mb-2">
          <div className={`text-xs ${
            child.status === 'completed' ? 'text-green-500' : 
            child.status === 'processing' ? 'text-yellow-500' : 
            'text-gray-500'
          }`}>
            {child.status === 'completed' ? '완료' : 
             child.status === 'processing' ? '처리중' : '대기'}
          </div>
          
          {/* 클릭 힌트 아이콘 */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* 서브 버전 뱃지 (하위 자식이 있을 때만) */}
        {hasSubChildren && (
          <SubVersionsBadge 
            childrenCount={child.children.length}
            onClick={() => {
              toggleSubPanel(child_id);
            }}
            dark_mode={dark_mode}
          />
        )}
        </motion.div>
        
        {/* 서브 버전 패널 (하위 자식이 있을 때만 렌더링) */}
        {hasSubChildren && (
          <SubVersionsPanel
            children={child.children}
            node_id={child_id}
            dark_mode={dark_mode}
            on_preview={on_preview}
            on_publish={on_publish}
          />
        )}
      </div>
    );
  };

  /**
   * 패널 토글 함수
   */
  const togglePanel = (nodeId) => {
    setOpenPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  /**
   * 서브 패널 토글 함수 (2레벨+ 자식용)
   */
  const toggleSubPanel = (nodeId) => {
    setOpenSubPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };


  /**
   * 버전 뱃지 + 클릭 패널 컴포넌트 (계층적 확장 방식)
   */
  const VersionsBadgeWithPreview = ({ children, node_id, node_version, dark_mode, on_preview, on_publish }) => {
    const isOpen = openPanels.has(node_id);
    const panelRef = useRef(null);
    
    // 1레벨 자식만 표시하도록 수정 (깊은 자식들은 서브 뱃지로 처리)
    const directChildren = children || [];
    const totalCount = directChildren.length;
    
    return (
      <div className="relative">
        {/* 클릭 가능한 버전 뱃지 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1 cursor-pointer"
          onClick={() => togglePanel(node_id)}
          data-panel-trigger="true"
        >
          <div 
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
              isOpen 
                ? dark_mode
                  ? 'bg-gray-700 text-gray-200 shadow-sm'
                  : 'bg-gray-100 text-gray-700 shadow-sm'
                : dark_mode 
                  ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80' 
                  : 'bg-gray-50/60 text-gray-600 hover:bg-gray-100/80'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>{totalCount}개 버전</span>
            {/* 토글 화살표 */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              ▼
            </motion.div>
          </div>
        </motion.div>

        {/* 클릭 패널 (호버 대신 클릭으로 변경) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25
              }}
              className={`absolute top-full left-0 mt-3 z-50 p-6 rounded-2xl border backdrop-blur-xl shadow-xl ${
                dark_mode 
                  ? 'bg-gray-900/95 border-gray-700/50' 
                  : 'bg-white/95 border-gray-200/50'
              }`}
              style={{ minWidth: '420px', maxWidth: '500px' }}
              onClick={(e) => e.stopPropagation()} // 패널 내부 클릭 시 이벤트 버블링 방지
              data-panel-content="true"
            >
              {/* Apple 스타일 헤더 */}
              <div className={`text-base font-semibold mb-4 flex items-center justify-between ${
                dark_mode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                <span>버전 히스토리</span>
                <button
                  onClick={() => togglePanel(node_id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                    dark_mode 
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center text-lg font-light">✕</div>
                </button>
              </div>

              {/* 1레벨 자식 카드들만 표시 */}
              <motion.div 
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
                {/* 단순한 서브헤더 */}
                <div className={`text-sm mb-4 ${
                  dark_mode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {totalCount}개의 버전
                </div>
                
                {/* 1레벨 자식 카드들 */}
                <div className="grid grid-cols-2 gap-4">
                  {directChildren.map((child) => (
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
                        level={1}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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