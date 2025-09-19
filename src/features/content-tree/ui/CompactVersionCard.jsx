/**
 * CompactVersionCard 컴포넌트
 * 개별 버전을 표시하는 재사용 가능한 카드 컴포넌트
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Folder } from 'lucide-react';
import { Badge } from '@/common/ui/badge';

/**
 * 컴팩트한 버전 카드 컴포넌트 - Apple 스타일 적용
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.child - 자식 노드 데이터
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Function} props.on_preview - 미리보기 클릭 핸들러
 * @param {Function} props.on_publish - 게시 클릭 핸들러
 * @param {number} props.level - 노드 레벨 (기본값: 1)
 * @param {boolean} props.isSubPanelOpen - 서브 패널 열림 상태
 * @param {Function} props.onSubPanelToggle - 서브 패널 토글 핸들러
 * @returns {JSX.Element} CompactVersionCard 컴포넌트
 */
const CompactVersionCard = ({ 
  child, 
  dark_mode, 
  on_preview, 
  on_publish, 
  level = 1,
  isSubPanelOpen,
  onSubPanelToggle 
}) => {
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
          
          {/* 버전 뱃지 */}
          <div className="absolute top-1 right-1">
            <Badge className={`text-xs ${
              dark_mode ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100/80 text-gray-600'
            }`}>
              v{child.version || '1.0'}
            </Badge>
          </div>
          
          {/* 폴더 아이콘 (하위 자식이 있을 때) */}
          {hasSubChildren && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onSubPanelToggle?.();
              }}
              className={`absolute bottom-1 right-1 p-1 rounded-md transition-all duration-200 ${
                dark_mode 
                  ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-gray-100' 
                  : 'bg-white/80 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } backdrop-blur-sm shadow-sm`}
              title={`${child.children.length}개 하위버전 보기`}
            >
              <Folder className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        {/* 제목 */}
        <div className={`text-sm font-medium mb-2 truncate ${
          dark_mode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {child.title || '제목 없음'}
        </div>

        {/* 상태 및 하위 버전 정보 */}
        <div className="flex items-center justify-between">
          <div className={`text-xs ${
            (child.status === 'completed' || child.status === 'COMPLETED') ? 'text-green-500' : 
            (child.status === 'processing' || child.status === 'PROCESSING') ? 'text-yellow-500' : 
            'text-gray-500'
          }`}>
            {(child.status === 'completed' || child.status === 'COMPLETED') ? '완료' : 
             (child.status === 'processing' || child.status === 'PROCESSING') ? '처리중' : '대기'}
          </div>
          
          <div className="flex items-center gap-2">
            {/* 하위 버전 수 표시 */}
            {hasSubChildren && (
              <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                dark_mode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100/50 text-gray-500'
              }`}>
                +{child.children.length}
              </div>
            )}
            
            {/* 클릭 힌트 아이콘 */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(CompactVersionCard);
