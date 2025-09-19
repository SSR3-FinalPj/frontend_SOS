/**
 * BreadcrumbNavigation 컴포넌트
 * 윈도우 탐색기 스타일의 클릭 가능한 경로 네비게이션
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home, ArrowLeft, MoreHorizontal } from 'lucide-react';

/**
 * BreadcrumbNavigation 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.versionPath - 버전 경로 배열 ["v1.0", "v1.1", "v1.2"]
 * @param {Array} props.currentPath - result_id 경로 배열 [1, 4, 6]
 * @param {Function} props.onNavigateToIndex - 특정 인덱스로 이동하는 함수
 * @param {Function} props.onGoBack - 뒤로가기 함수
 * @param {Function} props.onGoToRoot - 루트로 이동 함수
 * @param {boolean} props.canGoUp - 상위로 이동 가능 여부
 * @param {boolean} props.canGoBack - 뒤로가기 가능 여부
 * @param {boolean} props.darkMode - 다크모드 여부
 * @returns {JSX.Element} BreadcrumbNavigation 컴포넌트
 */
const BreadcrumbNavigation = ({
  versionPath = [],
  currentPath = [],
  nextVersions = [],
  onNavigateToIndex,
  onGoBack,
  onGoToRoot,
  canGoUp = false,
  canGoBack = false,
  darkMode = false
}) => {
  // 경로 축약 상태 관리
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_VISIBLE_SEGMENTS = 4;
  
  // 경로 축약 로직
  const shouldCollapse = versionPath.length > MAX_VISIBLE_SEGMENTS && !isExpanded;
  const displayPath = shouldCollapse 
    ? [
        versionPath[0],
        '...',
        ...versionPath.slice(-2)
      ]
    : versionPath;
  
  // 브레드크럼 세그먼트 클릭 핸들러 - 모든 세그먼트 클릭 가능
  const handleSegmentClick = (displayIndex, originalIndex) => {
    const actualIndex = originalIndex !== undefined ? originalIndex : displayIndex;
    if (onNavigateToIndex) onNavigateToIndex(actualIndex);
  };

  // 확장/축소 토글 핸들러
  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    if (canGoBack && onGoBack) {
      onGoBack();
    }
  };

  // 홈 버튼 클릭 핸들러
  const handleHomeClick = () => {
    if (onGoToRoot) {
      onGoToRoot();
    }
  };

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${
      darkMode 
        ? 'bg-gray-800/50 border-gray-700/50 text-gray-300' 
        : 'bg-gray-50/50 border-gray-200/50 text-gray-700'
    }`}>
      
      {/* 뒤로가기 버튼 */}
      <motion.button
        whileHover={{ scale: canGoBack ? 1.05 : 1 }}
        whileTap={{ scale: canGoBack ? 0.95 : 1 }}
        onClick={handleBackClick}
        disabled={!canGoBack}
        className={`p-1.5 rounded-md transition-colors ${
          canGoBack
            ? darkMode
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-200 text-gray-600'
            : darkMode
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-gray-400 cursor-not-allowed'
        }`}
        title="뒤로가기"
      >
        <ArrowLeft className="w-4 h-4" />
      </motion.button>

      {/* 홈 버튼 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleHomeClick}
        className={`p-1.5 rounded-md transition-colors ${
          darkMode
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-200 text-gray-600'
        }`}
        title="루트로 이동"
      >
        <Home className="w-4 h-4" />
      </motion.button>

      {/* 구분선 */}
      <div className={`w-px h-4 ${
        darkMode ? 'bg-gray-600' : 'bg-gray-300'
      }`} />

      {/* 경로 라벨 */}
      <span className={`text-sm font-medium ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        경로:
      </span>

      {/* 브레드크럼 경로 - 축약 가능한 전체 경로 표시 */}
      <div className="flex items-center gap-1 flex-wrap">
        {displayPath.map((version, displayIndex) => {
          // 축약된 경우 실제 인덱스 계산
          let originalIndex;
          if (shouldCollapse) {
            if (displayIndex === 0) {
              originalIndex = 0; // 첫 번째
            } else if (version === '...') {
              originalIndex = null; // 확장 버튼
            } else if (displayIndex === displayPath.length - 2) {
              originalIndex = versionPath.length - 2; // 마지막에서 두 번째
            } else if (displayIndex === displayPath.length - 1) {
              originalIndex = versionPath.length - 1; // 마지막
            }
          } else {
            originalIndex = displayIndex;
          }

          const isLast = originalIndex === versionPath.length - 1;
          const isExpansionButton = version === '...';
          const isClickable = onNavigateToIndex && !isExpansionButton;

          const basePillClasses = `px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors duration-200 min-w-[72px] text-center ${
            darkMode ? 'backdrop-blur-sm' : ''
          }`;
          const activeClasses = darkMode
            ? 'bg-blue-500/20 border-blue-400/30 text-blue-200 shadow-sm'
            : 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm';
          const inactiveClickableClasses = darkMode
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:text-white'
            : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900';
          const disabledClasses = darkMode
            ? 'border-gray-700 text-gray-500 bg-transparent cursor-default'
            : 'border-gray-200 text-gray-400 bg-transparent cursor-default';

          return (
            <React.Fragment key={isExpansionButton ? 'expansion' : displayIndex}>
              {/* 버전 세그먼트 또는 확장 버튼 */}
              {isExpansionButton ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleExpansion}
                  className={`px-2 py-1 rounded-md text-sm transition-colors cursor-pointer ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                      : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                  title="전체 경로 표시"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={isClickable ? { scale: 1.03 } : {}}
                  whileTap={isClickable ? { scale: 0.97 } : {}}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && handleSegmentClick(displayIndex, originalIndex)}
                  title={isClickable ? `${version}로 이동` : version}
                  className={`${basePillClasses} ${
                    isLast
                      ? activeClasses
                      : isClickable
                        ? inactiveClickableClasses
                        : disabledClasses
                  }`}
                >
                  <span className="font-mono">{version}</span>
                </motion.button>
              )}

              {/* 구분자 화살표 */}
              {displayIndex < displayPath.length - 1 && (
                <ChevronRight className={`w-3 h-3 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
              )}
            </React.Fragment>
          );
        })}
        {nextVersions.length > 0 && nextVersions.map((next) => (
          <React.Fragment key={`next-${next.label}`}>
            <ChevronRight className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => onNavigateToIndex && onNavigateToIndex(next.targetIndex)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors duration-200 min-w-[72px] text-center ${
                darkMode
                  ? 'border-gray-600 text-gray-300 hover:border-blue-400/40 hover:bg-blue-500/15 hover:text-blue-200'
                  : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="font-mono">{next.label}</span>
            </motion.button>
          </React.Fragment>
        ))}
      </div>

      {/* 경로가 비어있을 때 */}
      {versionPath.length === 0 && (
        <span className={`text-sm italic ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          경로 없음
        </span>
      )}

      {/* 디버그 정보 (개발 환경에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`ml-auto text-xs ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {currentPath.join(' → ')}
        </div>
      )}
    </div>
  );
};

export default React.memo(BreadcrumbNavigation);
