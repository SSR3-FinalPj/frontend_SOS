/**
 * AI 미디어 제작 요청 모달 컴포넌트 (리팩토링됨)
 * 재사용 가능한 컴포넌트들로 구성되어 더 나은 유지보수성과 재사용성을 제공
 */

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import SuccessModal from '../ui/success_modal.jsx';
import LocationSelector from '../ui/location_selector.jsx';
import ImageUploader from '../ui/image_uploader.jsx';
import CategoryAccordion from '../ui/category_accordion.jsx';
import { useMediaRequestForm } from '../../hooks/use_media_request_form.js';

/**
 * AI 미디어 제작 요청 모달 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.is_open - 모달 열림 상태
 * @param {Function} props.on_close - 모달 닫기 함수
 * @returns {JSX.Element} AI 미디어 제작 요청 모달 컴포넌트
 */
const AIMediaRequestModal = ({ is_open, on_close }) => {
  // 폼 상태 관리 커스텀 훅 사용
  const {
    selected_location,
    uploaded_file,
    request_categories,
    expanded_categories,
    is_submitting,
    is_success_modal_open,
    is_form_valid,
    handle_location_select,
    handle_file_change,
    handle_category_change,
    handle_toggle_category,
    handle_submit,
    handle_success_modal_close
  } = useMediaRequestForm(on_close);

  // 모달 닫기 핸들러
  const handle_close = useCallback(() => {
    if (is_submitting) return;
    on_close();
  }, [is_submitting, on_close]);

  // ESC 키 핸들러
  const handle_key_down = useCallback((e) => {
    if (e.key === 'Escape') {
      handle_close();
    }
  }, [handle_close]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (is_open) {
      document.addEventListener('keydown', handle_key_down);
      return () => {
        document.removeEventListener('keydown', handle_key_down);
      };
    }
  }, [is_open, handle_key_down]);

  if (!is_open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
        onClick={handle_close}
        onKeyDown={handle_key_down}
        tabIndex={-1}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              AI 미디어 제작 요청
            </h2>
            <button
              onClick={handle_close}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              disabled={is_submitting}
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6 space-y-5 max-h-[calc(95vh-140px)] overflow-y-auto">
            {/* 위치 선택 컴포넌트 */}
            <LocationSelector
              selected_location={selected_location}
              on_location_select={handle_location_select}
            />

            {/* 이미지 업로드 컴포넌트 */}
            <ImageUploader
              uploaded_file={uploaded_file}
              on_file_change={handle_file_change}
            />

            {/* 카테고리 선택 컴포넌트 */}
            <CategoryAccordion
              request_categories={request_categories}
              on_category_change={handle_category_change}
              expanded_categories={expanded_categories}
              on_toggle_category={handle_toggle_category}
            />
          </div>

          {/* 푸터 */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handle_close}
              disabled={is_submitting}
            >
              취소
            </Button>
            
            <Button
              onClick={handle_submit}
              disabled={!is_form_valid}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold"
            >
              {is_submitting ? '요청 중...' : '제작 요청하기'}
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* 성공 모달 */}
      <SuccessModal
        is_open={is_success_modal_open}
        on_close={handle_success_modal_close}
        message="AI 미디어 제작 요청이 성공적으로 전송되었습니다!"
        title="요청 완료"
      />
    </AnimatePresence>,
    document.body
  );
};

export default AIMediaRequestModal;