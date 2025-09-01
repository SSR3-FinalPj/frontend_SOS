/**
 * AI 미디어 제작 요청 모달 컴포넌트 (플랫폼 지원 확장)
 * YouTube와 Reddit 플랫폼을 지원하는 통합 미디어 제작 요청 모달
 */

import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/common/ui/button';
import SuccessModal from '@/common/ui/success-modal';
import PlatformSelector from '@/common/ui/PlatformSelector';
import LocationSelector from '@/common/ui/location-selector';
import ImageUploader from '@/common/ui/image-uploader';
import NaturalPromptInput from '@/common/ui/natural-prompt-input';
import RedditRequestForm from '@/features/reddit-media-request/ui/RedditRequestForm';
import { useMediaRequestForm } from '@/features/ai-media-request/logic/use-media-request-form';

/**
 * AI 미디어 제작 요청 모달 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.is_open - 모달 열림 상태
 * @param {Function} props.on_close - 모달 닫기 함수
 * @param {boolean} props.isPriority - 우선순위 재생성 모드 여부
 * @param {Function} props.on_request_success - 요청 성공 시 콜백 함수
 * @returns {JSX.Element} AI 미디어 제작 요청 모달 컴포넌트
 */
const AIMediaRequestModal = ({ is_open, on_close, isPriority = false, selectedVideoData = null, on_request_success = null }) => {
  // 플랫폼 선택 상태
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');

  // YouTube 폼 상태 관리 커스텀 훅 사용
  const {
    selected_location,
    uploaded_file,
    prompt_text,
    is_submitting,
    is_success_modal_open,
    is_form_valid,
    handle_location_select,
    handle_file_change,
    handle_prompt_change,
    handle_submit,
    handle_success_modal_close
  } = useMediaRequestForm(on_close, isPriority, selectedVideoData, on_request_success);

  // 플랫폼 변경 핸들러
  const handlePlatformChange = useCallback((platform) => {
    // Reddit 플랫폼 선택 방지
    if (platform === 'reddit') {
      return;
    }
    setSelectedPlatform(platform);
  }, []);

  // 모달 닫기 핸들러
  const handle_close = useCallback(() => {
    if (is_submitting) return;
    setSelectedPlatform('youtube'); // 플랫폼 초기화
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
          key="main-modal"
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
            {/* 플랫폼 선택 컴포넌트 */}
            <PlatformSelector
              selectedPlatform={selectedPlatform}
              onPlatformChange={handlePlatformChange}
            />

            {/* 플랫폼별 조건부 폼 렌더링 */}
            {selectedPlatform === 'youtube' && (
              <>
                {/* YouTube 폼 - 기존 컴포넌트들 */}
                <LocationSelector
                  selected_location={selected_location}
                  on_location_select={handle_location_select}
                />

                <ImageUploader
                  uploaded_file={uploaded_file}
                  on_file_change={handle_file_change}
                />

                <NaturalPromptInput
                  prompt_text={prompt_text}
                  on_prompt_change={handle_prompt_change}
                />
              </>
            )}

            {selectedPlatform === 'reddit' && (
              <>
                {/* Reddit 폼 - 새로운 컴포넌트 */}
                <RedditRequestForm
                  onRequestSuccess={on_request_success}
                  selectedVideoData={selectedVideoData}
                  isPriority={isPriority}
                />
              </>
            )}
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
            
            {/* YouTube 제출 버튼 */}
            {selectedPlatform === 'youtube' && (
              <Button
                onClick={handle_submit}
                disabled={!is_form_valid}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white disabled:opacity-50 font-semibold"
              >
                {is_submitting ? '요청 중...' : '동영상 생성 요청'}
              </Button>
            )}

            {/* Reddit 제출 버튼 */}
            {selectedPlatform === 'reddit' && (
              <Button
                onClick={() => {
                  // Reddit 기능 비활성화로 인해 아무 동작 안함
                }}
                disabled={true} // 항상 비활성화
                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 text-gray-800 dark:text-white disabled:opacity-50 font-semibold"
              >
                이미지 생성 (준비 중)
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* 성공 모달 */}
      <SuccessModal
        key="success-modal"
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