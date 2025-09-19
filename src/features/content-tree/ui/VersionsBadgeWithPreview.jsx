/**
 * VersionsBadgeWithPreview 컴포넌트
 * 버전 뱃지와 클릭 가능한 프리뷰 패널을 포함하는 컴포넌트
 */

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch } from 'lucide-react';
import CompactVersionCard from './CompactVersionCard';
import NavigationHeader from './NavigationHeader';

/**
 * 버전 뱃지 + 클릭 패널 컴포넌트 (계층적 확장 방식)
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.children - 자식 노드들
 * @param {string} props.node_id - 노드 ID
 * @param {string} props.node_version - 노드 버전
 * @param {boolean} props.isOpen - 패널 열림 상태
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Function} props.onToggle - 패널 토글 핸들러
 * @param {Function} props.on_preview - 미리보기 클릭 핸들러
 * @param {Function} props.on_publish - 게시 클릭 핸들러
 * @param {Function} props.onNavigateToFolder - 폴더 진입 핸들러
 * @param {Function} props.onNavigateBack - 뒤로가기 핸들러
 * @param {Function} props.onNavigateToPath - 경로 이동 핸들러
 * @param {Array} props.currentPath - 현재 경로 스택
 * @param {Function} props.getCurrentLevelChildren - 현재 레벨 자식 가져오기
 * @returns {JSX.Element} VersionsBadgeWithPreview 컴포넌트
 */
const VersionsBadgeWithPreview = ({ 
  children, 
  node_id, 
  node_version, 
  isOpen,
  dark_mode, 
  onToggle,
  on_preview, 
  on_publish,
  onNavigateToFolder,
  onNavigateBack,
  onNavigateToPath,
  currentPath,
  getCurrentLevelChildren
}) => {
  const panelRef = useRef(null);
  
  // 현재 레벨의 자식들을 가져오기 (폴더 탐색 방식)
  const currentLevelChildren = getCurrentLevelChildren ? getCurrentLevelChildren(children || []) : (children || []);
  const totalCount = currentLevelChildren.length;
  
  return (
    <div className="relative">
      {/* 클릭 가능한 버전 뱃지 */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1 cursor-pointer"
        onClick={onToggle}
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

      {/* 클릭 패널 */}
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
            onClick={(e) => e.stopPropagation()}
            data-panel-content="true"
          >
            {/* 네비게이션 헤더 */}
            <NavigationHeader
              currentPath={currentPath || []}
              dark_mode={dark_mode}
              onNavigateBack={onNavigateBack}
              onNavigateToPath={onNavigateToPath}
            />
            
            {/* 닫기 버튼 */}
            <div className="absolute top-4 right-4">
              <button
                onClick={onToggle}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                  dark_mode 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center text-lg font-light">✕</div>
              </button>
            </div>

            {/* 현재 레벨의 자식 카드들 */}
            <motion.div 
              key={currentPath?.length || 0} // 경로 변경 시 애니메이션 리셋
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
              {/* 서브헤더 */}
              <div className={`text-sm mb-4 ${
                dark_mode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {totalCount > 0 ? `${totalCount}개의 버전` : '하위 버전이 없습니다'}
              </div>
              
              {/* 현재 레벨 자식 카드들 */}
              {totalCount > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {currentLevelChildren.map((child) => (
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
                        onSubPanelToggle={() => onNavigateToFolder?.(child)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${
                  dark_mode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <div className="text-sm">이 버전에는 하위 버전이 없습니다.</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(VersionsBadgeWithPreview);