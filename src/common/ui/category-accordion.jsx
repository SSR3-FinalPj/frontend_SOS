/**
 * 카테고리 선택 아코디언 컴포넌트
 * 영상 제작 요청사항을 아코디언 형태로 표시하고 선택할 수 있는 컴포넌트
 */

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  CATEGORY_METADATA, 
  CATEGORY_OPTIONS, 
  CATEGORY_COLOR_CLASSES 
} from '@/common/utils/media-request-constants';

/**
 * CategoryAccordion 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.request_categories - 선택된 카테고리 값들
 * @param {Function} props.on_category_change - 카테고리 변경 콜백 함수
 * @param {Object} props.expanded_categories - 아코디언 확장 상태
 * @param {Function} props.on_toggle_category - 아코디언 토글 콜백 함수
 * @returns {JSX.Element} CategoryAccordion 컴포넌트
 */
const CategoryAccordion = ({ 
  request_categories, 
  on_category_change,
  expanded_categories,
  on_toggle_category 
}) => {
  
  // 카테고리 선택 핸들러
  const handle_category_select = useCallback((category, value) => {
    on_category_change(category, value);
  }, [on_category_change]);
  
  // 아코디언 토글 핸들러
  const toggle_category = useCallback((category) => {
    on_toggle_category(category);
  }, [on_toggle_category]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            영상 제작 요청 사항 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(선택사항)</span>
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          첫 번째 영상은 실시간 날씨와 인구 데이터를 기반으로 자동 생성됩니다. 
          특별한 요구사항이 있다면 아래 옵션들을 선택해주세요.
        </p>
      </div>

      {/* 아코디언 카테고리들 */}
      {Object.entries(CATEGORY_METADATA).map(([category_key, metadata]) => {
        const IconComponent = metadata.icon;
        const is_expanded = expanded_categories[category_key];
        const selected_value = request_categories[category_key];
        const color_classes = CATEGORY_COLOR_CLASSES[category_key];
        
        return (
          <div key={category_key} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* 아코디언 헤더 */}
            <button
              onClick={() => toggle_category(category_key)}
              className={`w-full px-4 py-3 flex items-center justify-between text-left transition-all duration-200 ${
                is_expanded 
                  ? 'bg-gray-50 dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4 h-4 ${color_classes.icon}`} />
                <span className="font-medium text-gray-800 dark:text-white">
                  {metadata.title}
                </span>
                {selected_value && (
                  <span className={`text-xs px-2 py-1 rounded-full ${color_classes.badge}`}>
                    선택됨
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selected_value && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 max-w-32 truncate">
                    {selected_value}
                  </span>
                )}
                {is_expanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* 아코디언 콘텐츠 */}
            <AnimatePresence>
              {is_expanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CATEGORY_OPTIONS[category_key].map((option) => (
                        <button
                          key={option}
                          onClick={() => handle_category_select(category_key, option)}
                          className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 text-left ${
                            request_categories[category_key] === option
                              ? color_classes.selected
                              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryAccordion;