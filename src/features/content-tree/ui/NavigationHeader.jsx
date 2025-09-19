/**
 * NavigationHeader 컴포넌트
 * 폴더 탐색을 위한 네비게이션 헤더
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 네비게이션 헤더 컴포넌트 - macOS Finder 스타일
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.currentPath - 현재 경로 스택
 * @param {boolean} props.dark_mode - 다크모드 여부
 * @param {Function} props.onNavigateBack - 뒤로가기 핸들러
 * @param {Function} props.onNavigateToPath - 특정 경로로 이동 핸들러
 * @returns {JSX.Element} NavigationHeader 컴포넌트
 */
const NavigationHeader = ({ currentPath, dark_mode, onNavigateBack, onNavigateToPath }) => {
  const canGoBack = currentPath.length > 0;
  
  return (
    <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg transition-all duration-200 ${
      dark_mode 
        ? 'bg-gray-800/50 border border-gray-700/30' 
        : 'bg-gray-50/50 border border-gray-200/30'
    }`}>
      {/* 뒤로가기 버튼 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNavigateBack}
        disabled={!canGoBack}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
          canGoBack
            ? dark_mode
              ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700/50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
            : dark_mode
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>뒤로</span>
      </motion.button>
      
      {/* 브레드크럼 네비게이션 */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        {/* 루트 경로 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigateToPath?.(-1)} // -1은 루트를 의미
          className={`px-2 py-1 text-sm rounded-md transition-all duration-200 truncate ${
            currentPath.length === 0
              ? dark_mode
                ? 'text-gray-200 bg-gray-700/50'
                : 'text-gray-800 bg-gray-200/50'
              : dark_mode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/30'
          }`}
        >
          버전 히스토리
        </motion.button>
        
        {/* 경로 구분자 및 중간 경로들 */}
        {currentPath.map((pathNode, index) => (
          <React.Fragment key={pathNode.id}>
            {/* 구분자 */}
            <ChevronRight className={`w-3 h-3 flex-shrink-0 ${
              dark_mode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            
            {/* 경로 노드 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigateToPath?.(index)}
              className={`px-2 py-1 text-sm rounded-md transition-all duration-200 truncate ${
                index === currentPath.length - 1 // 현재 위치
                  ? dark_mode
                    ? 'text-gray-200 bg-gray-700/50'
                    : 'text-gray-800 bg-gray-200/50'
                  : dark_mode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/30'
              }`}
            >
              v{pathNode.version || '1.0'}
              {pathNode.title && (
                <span className="ml-1 text-xs opacity-75">
                  {pathNode.title.length > 10 
                    ? `${pathNode.title.substring(0, 10)}...` 
                    : pathNode.title
                  }
                </span>
              )}
            </motion.button>
          </React.Fragment>
        ))}
      </div>
      
      {/* 현재 위치 정보 */}
      <div className={`text-xs px-2 py-1 rounded-md ${
        dark_mode 
          ? 'text-gray-400 bg-gray-800/30' 
          : 'text-gray-500 bg-gray-100/30'
      }`}>
        {currentPath.length > 0 
          ? `레벨 ${currentPath.length + 1}`
          : '루트'
        }
      </div>
    </div>
  );
};

export default React.memo(NavigationHeader);