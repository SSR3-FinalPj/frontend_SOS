/**
 * AI 미디어 제작 요청 모달 컴포넌트 (플랫폼 지원 확장)
 * YouTube와 Reddit 플랫폼을 지원하는 통합 미디어 제작 요청 모달
 */

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check } from 'lucide-react';
import { Button } from '@/common/ui/button';
import SuccessModal from '@/common/ui/success-modal';
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
  // 9:16 비율로 고정 (세로형 영상 전용)
  const selectedPlatform = 'youtube';

  // 서울 자치구 마스코트 사용 상태
  const [useMascot, setUseMascot] = useState(false);

  // 서울시 실시간 도시데이터 사용 상태
  const [useCityData, setUseCityData] = useState(true);

  // 마스코트가 있는 서울 자치구 목록 (과천시 포함)
  const DISTRICTS_WITH_MASCOTS = [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구', '과천시'
  ];

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
    testModeData?.testMode || false, // 테스트 모드 전달
    useMascot, // 마스코트 사용 여부 전달
    useCityData // 도시데이터 사용 여부 전달
  );

  // 플랫폼은 고정이므로 변경 핸들러 불필요

  // 마스코트 사용 체크박스 핸들러
  const handleMascotChange = useCallback((event) => {
    setUseMascot(event.target.checked);
  }, []);

  // 도시데이터 사용 체크박스 핸들러
  const handleCityDataChange = useCallback((event) => {
    setUseCityData(event.target.checked);
  }, []);

  // 선택된 구가 마스코트 사용 가능한지 확인
  const isMascotAvailable = useCallback(() => {
    if (!selected_location?.district) return false;
    return DISTRICTS_WITH_MASCOTS.includes(selected_location.district);
  }, [selected_location?.district, DISTRICTS_WITH_MASCOTS]);

  // 선택된 구가 도시데이터 사용 가능한지 확인 (마스코트와 동일한 조건)
  const isCityDataAvailable = useCallback(() => {
    if (!selected_location?.district) return false;
    return DISTRICTS_WITH_MASCOTS.includes(selected_location.district);
  }, [selected_location?.district, DISTRICTS_WITH_MASCOTS]);

  // 위치 변경 시 체크박스 초기화
  useEffect(() => {
    if (!isMascotAvailable()) {
      setUseMascot(false);
    }
    if (!isCityDataAvailable()) {
      setUseCityData(true); // 기본값으로 되돌리기
    }
  }, [isMascotAvailable, isCityDataAvailable]);

  // 모달 닫기 핸들러
  const handle_close = useCallback(() => {
    if (is_submitting) return;
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
      
      // 플랫폼은 youtube로 고정 (테스트 데이터 무시)
      
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
              AI 영상 생성하기
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
            {/* 9:16 비율 세로형 영상 생성 폼 */}
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

            {/* 서울 자치구 마스코트 사용 옵션 */}
            <AnimatePresence>
              {selected_location && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-3 overflow-hidden"
                >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <h4 className="text-md font-medium text-gray-800 dark:text-white">
                          특화 옵션
                        </h4>
                      </div>
                      
                      {/* 마스코트 사용 옵션 */}
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isMascotAvailable() 
                          ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700' 
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={useMascot}
                              onChange={handleMascotChange}
                              disabled={!isMascotAvailable()}
                              className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                                isMascotAvailable()
                                  ? 'border-purple-300 dark:border-purple-600 text-purple-600 focus:ring-purple-500'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                              } focus:ring-2 focus:ring-offset-2`}
                            />
                            {useMascot && isMascotAvailable() && (
                              <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm font-medium ${
                              isMascotAvailable() 
                                ? 'text-gray-800 dark:text-white' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {selected_location.district === '과천시' 
                                ? '과천시 공식 마스코트 사용'
                                : '서울 자치구 공식 마스코트 사용'
                              }
                            </span>
                            <p className={`text-xs mt-1 ${
                              isMascotAvailable() 
                                ? 'text-gray-600 dark:text-gray-300' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {isMascotAvailable() 
                                ? selected_location.district === '과천시'
                                  ? '과천시의 공식 마스코트를 영상에 포함시킵니다.'
                                  : `${selected_location.district}의 공식 마스코트를 영상에 포함시킵니다. (없을 시 서울시 마스코트 적용)`
                                : '선택된 지역에서는 마스코트 사용이 불가능합니다.'
                              }
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* 도시데이터 사용 옵션 */}
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isCityDataAvailable() 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' 
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={useCityData}
                              onChange={handleCityDataChange}
                              disabled={!isCityDataAvailable()}
                              className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                                isCityDataAvailable()
                                  ? 'border-blue-300 dark:border-blue-600 text-blue-600 focus:ring-blue-500'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                              } focus:ring-2 focus:ring-offset-2`}
                            />
                            {useCityData && isCityDataAvailable() && (
                              <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm font-medium ${
                              isCityDataAvailable() 
                                ? 'text-gray-800 dark:text-white' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {selected_location.district === '과천시' 
                                ? '과천시 실시간 도시데이터 사용'
                                : '서울시 실시간 도시데이터 사용'
                              }
                            </span>
                            <p className={`text-xs mt-1 ${
                              isCityDataAvailable() 
                                ? 'text-gray-600 dark:text-gray-300' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {isCityDataAvailable() 
                                ? selected_location.district === '과천시'
                                  ? '과천시의 실시간 교통, 날씨, 이벤트 등의 도시데이터를 영상에 반영합니다.'
                                  : '서울시의 실시간 교통, 날씨, 이벤트 등의 도시데이터를 영상에 반영합니다.'
                                : '선택된 지역에서는 실시간 도시데이터 사용이 불가능합니다.'
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

            
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
            
            {/* 영상 생성 요청 버튼 */}
            <Button
              onClick={handle_submit}
              disabled={!is_form_valid}
              className="font-semibold disabled:opacity-50 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-800 dark:text-white"
            >
              {is_submitting ? '영상 생성 중...' : '영상 생성'}
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* 성공 모달 */}
      <SuccessModal
        key="success-modal"
        is_open={is_success_modal_open}
        on_close={handle_success_modal_close}
        message="9:16 세로형 영상 생성 요청이 성공적으로 전송되었습니다!"
        title="요청 완료"
      />
    </AnimatePresence>,
    document.body
  );
};

export default AIMediaRequestModal;
