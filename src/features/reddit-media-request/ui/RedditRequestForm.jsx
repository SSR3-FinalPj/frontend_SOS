/**
 * Reddit 이미지 생성 요청 폼 컴포넌트
 * 기존 YouTube 폼과 동일한 구조로 구현 (위치, 이미지, 프롬프트)
 */

import React from 'react';
import LocationSelector from '@/common/ui/location-selector';
import ImageUploader from '@/common/ui/image-uploader';
import NaturalPromptInput from '@/common/ui/natural-prompt-input';
import { useRedditRequestForm } from '@/features/reddit-media-request/logic/use-reddit-request-form';

/**
 * Reddit 이미지 생성 요청 폼 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Function} props.onRequestSuccess - 요청 성공 시 콜백 함수
 * @param {Object|null} props.selectedVideoData - 선택된 영상 데이터 (자동 import용)
 * @param {boolean} props.isPriority - 우선순위 재생성 모드 여부
 * @returns {JSX.Element} Reddit 이미지 생성 요청 폼 컴포넌트
 */
const RedditRequestForm = ({ onRequestSuccess = null, selectedVideoData = null, isPriority = false }) => {
  // 폼 상태 관리 커스텀 훅 사용
  const {
    selectedLocation,
    uploadedFile,
    promptText,
    isSubmitting,
    isFormValid,
    handleLocationSelect,
    handleFileChange,
    handlePromptChange,
    handleSubmit
  } = useRedditRequestForm(onRequestSuccess, isPriority, selectedVideoData);

  return (
    <div className="space-y-5">
      {/* 위치 선택 컴포넌트 */}
      <LocationSelector
        selected_location={selectedLocation}
        on_location_select={handleLocationSelect}
      />

      {/* 이미지 업로드 컴포넌트 */}
      <ImageUploader
        uploaded_file={uploadedFile}
        on_file_change={handleFileChange}
      />

      {/* 자연어 프롬프트 입력 컴포넌트 */}
      <NaturalPromptInput
        prompt_text={promptText}
        on_prompt_change={handlePromptChange}
        placeholder="Reddit에 업로드할 이미지를 어떻게 생성할지 설명해주세요..."
      />

      {/* Reddit 준비 중 안내 */}
      <div className="p-4 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/30 dark:border-amber-700/30 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <span className="font-semibold">Reddit 이미지 생성 기능 준비 중</span>
            <br />
            현재 백엔드 API 개발 중입니다. 폼 제출 시 준비 중 메시지가 표시됩니다.
          </p>
        </div>
      </div>

      {/* 제출 버튼 (숨김 - 모달에서 처리) */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="hidden"
        id="reddit-form-submit"
      >
        {isSubmitting ? '요청 중...' : '이미지 생성 요청하기'}
      </button>
    </div>
  );
};

export default RedditRequestForm;