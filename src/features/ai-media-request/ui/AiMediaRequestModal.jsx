/**
 * AI 미디어 제작 요청 모달 컴포넌트 (플랫폼 지원 확장)
 * YouTube와 Reddit 플랫폼을 지원하는 통합 미디어 제작 요청 모달
 */

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/common/ui/button';
import SuccessModal from '@/common/ui/success-modal';
import PlatformSelector from '@/common/ui/PlatformSelector';
import LocationSelector from '@/common/ui/location-selector';
import ImageUploader from '@/common/ui/image-uploader';
import NaturalPromptInput from '@/common/ui/natural-prompt-input';
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
const AIMediaRequestModal = ({ is_open, on_close, isPriority = false, selectedVideoData = null, on_request_success = null, testModeData = null }) => {
  // 플랫폼 선택 상태
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');

  // YouTube 폼 상태 관리 커스텀 훅 사용 (테스트 모드 지원)
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
  } = useMediaRequestForm(
    on_close, 
    isPriority, 
    selectedVideoData, 
    on_request_success, 
    selectedPlatform, 
    testModeData?.testMode || false // 테스트 모드 전달
  );

  // 플랫폼 변경 핸들러
  const handlePlatformChange = useCallback((platform) => {
    setSelectedPlatform(platform);
  }, []);

  // 모달 닫기 핸들러
  const handle_close = useCallback(() => {
    if (is_submitting) return;
    setSelectedPlatform('youtube'); // 플랫폼 초기화
    autoSubmitExecutedRef.current = false; // 자동 제출 플래그 초기화
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

  // 자동 제출 상태 추적을 위한 ref
  const autoSubmitExecutedRef = useRef(false);
  
  // 🧪 TEST: 테스트 모드 자동 입력 처리 (의존성 배열 최적화)
  useEffect(() => {
    if (is_open && testModeData?.testMode && testModeData?.autoFill) {
      // 이미 자동 제출이 실행되었다면 중복 실행 방지
      if (autoSubmitExecutedRef.current) {
        return;
      }
      
      // 플랫폼 설정
      if (testModeData.platform) {
        setSelectedPlatform(testModeData.platform);
      }
      
      // 즉시 테스트용 위치 선택 (타이밍 문제 해결)
      
      const testLocation = {
        poi_id: "POI001", // 백엔드 API 호환성을 위한 poi_id 사용
        name: "강남역",
        address: "서울특별시 강남구",
        district: "강남구",
        coordinates: { lat: 37.498095, lng: 127.027610 }
      };
      
      // 위치 즉시 설정 (지연 없이)
      handle_location_select(testLocation);
      
      
      // 나머지 데이터는 약간의 지연 후 설정
      setTimeout(() => {
        // 테스트용 이미지 파일 생성
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = testModeData.platform === 'youtube' ? '#FF0000' : '#FF4500';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('테스트 이미지', 100, 100);
        ctx.fillText(testModeData.platform.toUpperCase(), 100, 120);
        
        canvas.toBlob((blob) => {
          const testFile = new File([blob], `test-${testModeData.platform}.png`, {
            type: 'image/png'
          });
          handle_file_change(testFile);
          
        });
        
        // 테스트용 프롬프트 입력
        const testPrompt = `🧪 테스트 모드로 생성된 ${testModeData.platform === 'youtube' ? '영상' : '이미지'} 콘텐츠입니다.`;
        handle_prompt_change(testPrompt);
        
        
        // 자동 제출 모드라면 추가 지연 후 제출 (중복 방지)
        if (testModeData.autoSubmit && !autoSubmitExecutedRef.current) {
          setTimeout(() => {
            
            autoSubmitExecutedRef.current = true; // 실행 플래그 설정
            handle_submit();
          }, 1000);
        }
      }, 200);
    }
  }, [is_open, testModeData?.testMode, testModeData?.autoFill, testModeData?.autoSubmit, testModeData?.platform]); // handle_submit 제거

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

            {/* 플랫폼 선택 시 공통 폼 렌더링 */}
            {selectedPlatform && (
              <>
                {/* 공통 폼 - 모든 플랫폼에서 사용 */}
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

                {/* Reddit 전용 필드 */}
                {selectedPlatform === 'reddit' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Subreddit 설정
                      </h3>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        게시할 Subreddit
                      </label>
                      <input
                        type="text"
                        placeholder="예: funny, pics, videos (r/ 없이 입력)"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        게시할 서브레딧의 이름을 입력하세요.
                      </p>
                    </div>
                  </div>
                )}
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
            
            {/* 통합 제출 버튼 */}
            <Button
              onClick={handle_submit}
              disabled={!is_form_valid}
              className={`font-semibold disabled:opacity-50 ${
                selectedPlatform === 'youtube'
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30'
                  : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30'
              } text-gray-800 dark:text-white`}
            >
              {is_submitting 
                ? '요청 중...' 
                : selectedPlatform === 'youtube' 
                  ? '동영상 생성 요청' 
                  : '이미지 생성 요청'
              }
            </Button>
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
