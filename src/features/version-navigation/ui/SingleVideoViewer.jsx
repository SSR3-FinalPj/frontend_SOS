/**
 * SingleVideoViewer 컴포넌트
 * 현재 선택된 버전의 영상만 표시하는 단일 뷰어
 * 하위 버전이 있으면 탐색 버튼 제공
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GitBranch, Play, Edit, Share2, Eye } from 'lucide-react';
import { Button } from '@/common/ui/Button';
import ContentItemCard from '@/features/content-management/ui/ContentItemCard';

// 하위 버전 패널 컴포넌트 제거됨 - 브레드크럼 네비게이션으로 대체

/**
 * SingleVideoViewer 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.currentNode - 현재 표시할 노드 데이터
 * @param {Array} props.availableChildren - 하위 버전 배열
 * @param {Function} props.onNavigateToChild - 하위 버전 선택 함수
 * @param {Function} props.onPreview - 미리보기 함수
 * @param {Function} props.onPublish - 게시 함수
 * @param {Function} props.onEdit - 수정 함수
 * @param {boolean} props.darkMode - 다크모드 여부
 * @param {Array} props.uploadingItems - 업로드 중인 아이템들
 * @returns {JSX.Element} SingleVideoViewer 컴포넌트
 */
const SingleVideoViewer = ({
  currentNode,
  availableChildren = [],
  onNavigateToChild,
  onPreview,
  onPublish,
  onEdit,
  darkMode = false,
  uploadingItems = []
}) => {
  // 하위 패널 상태 제거됨

  // 현재 노드가 없으면 빈 상태 표시
  if (!currentNode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-center py-12 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        <div className="text-lg font-medium mb-2">선택된 버전이 없습니다</div>
        <div className="text-sm">브레드크럼에서 버전을 선택해주세요</div>
      </motion.div>
    );
  }

  // 현재 노드를 ContentItemCard 형식으로 변환
  const cardItem = {
    ...currentNode,
    id: currentNode.result_id || currentNode.id,
    type: 'video'
  };

  return (
    <motion.div
      key={currentNode.result_id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-4"
    >
      {/* 현재 영상 카드 - 축소된 크기 */}
      <div className="w-72 flex-shrink-0">
        <ContentItemCard
          item={cardItem}
          dark_mode={darkMode}
          uploading_items={uploadingItems}
          on_preview={onPreview}
          on_publish={onPublish}
          isCompact={true}
        />
      </div>

      {/* 액션 버튼들 - 세로 배치 */}
      <div className="flex flex-col gap-2">
        {/* 미리보기 버튼 */}
        {onPreview && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(cardItem)}
            className={`flex items-center gap-2 ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-3 h-3" />
            미리보기
          </Button>
        )}

        {/* 수정 버튼 */}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(cardItem)}
            className={`flex items-center gap-2 ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Edit className="w-3 h-3" />
            수정
          </Button>
        )}

        {/* 게시 버튼 */}
        {onPublish && (
          <Button
            size="sm"
            onClick={() => onPublish(cardItem)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Share2 className="w-3 h-3" />
            게시
          </Button>
        )}
      </div>

      {/* 노드 정보 (개발 환경에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`mt-6 p-3 rounded-md text-xs ${
          darkMode 
            ? 'bg-gray-800/50 text-gray-400 border border-gray-700' 
            : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          <div className="font-mono">
            <div>Result ID: {currentNode.result_id}</div>
            <div>Children: {availableChildren.length}</div>
            <div>Title: {currentNode.title || 'N/A'}</div>
            <div>Status: {currentNode.status || 'N/A'}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(SingleVideoViewer);