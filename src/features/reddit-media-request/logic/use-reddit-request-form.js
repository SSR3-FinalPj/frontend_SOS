/**
 * Reddit 이미지 생성 요청 폼 상태 관리 커스텀 훅
 * YouTube 폼과 동일한 구조이지만 Reddit 특화 처리 로직 포함
 */

import { useState, useCallback, useEffect } from 'react';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { useNotificationStore } from '@/features/real-time-notifications/logic/notification-store';

/**
 * useRedditRequestForm 커스텀 훅
 * @param {Function|null} onRequestSuccess - 요청 성공 콜백 함수
 * @param {boolean} isPriority - 우선순위 재생성 모드 여부
 * @param {Object|null} selectedVideoData - 선택된 영상 데이터 (자동 import용)
 * @returns {Object} 폼 상태와 핸들러들
 */
export const useRedditRequestForm = (onRequestSuccess = null, isPriority = false, selectedVideoData = null) => {
  // 기본 폼 상태
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 자연어 프롬프트 상태
  const [promptText, setPromptText] = useState('');

  // 위치 선택 핸들러
  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  // 파일 변경 핸들러
  const handleFileChange = useCallback((file) => {
    setUploadedFile(file);
  }, []);

  // 프롬프트 변경 핸들러
  const handlePromptChange = useCallback((value) => {
    setPromptText(value);
  }, []);

  // 폼 초기화 함수
  const resetForm = useCallback(() => {
    setSelectedLocation(null);
    setUploadedFile(null);
    setPromptText('');
  }, []);

  // 선택된 영상 데이터로 폼 자동 초기화 (YouTube와 동일)
  useEffect(() => {
    if (selectedVideoData) {      
      // 위치 정보 자동 설정
      if (selectedVideoData.location_name || selectedVideoData.location_id) {
        const autoLocation = {
          poi_id: selectedVideoData.location_id,
          name: selectedVideoData.location_name || '선택된 위치',
        };
        setSelectedLocation(autoLocation);
      }
      
      // 이미지 자동 설정 (image_url이 있는 경우)
      if (selectedVideoData.image_url) {
        fetch(selectedVideoData.image_url)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], `${selectedVideoData.title || 'selected'}_image.jpg`, {
              type: blob.type || 'image/jpeg'
            });
            setUploadedFile(file);
          })
          .catch(error => {
            console.warn('이미지 자동 로드 실패:', error);
          });
      }
      
      // 프롬프트 자동 설정 (Reddit용으로 수정)
      const autoPrompt = selectedVideoData.title 
        ? `"${selectedVideoData.title}"과 유사한 이미지를 생성해주세요.`
        : '선택한 영상과 유사한 새로운 이미지를 생성해주세요.';
      setPromptText(autoPrompt);
    } else {
      // 선택된 영상이 없으면 폼 초기화
      resetForm();
    }
  }, [selectedVideoData, resetForm]);

  // 폼 제출 핸들러 (현재는 준비 중 알림만 표시)
  const handleSubmit = useCallback(async () => {
    // 필수 항목 검증
    if (!selectedLocation) {
      alert('위치를 선택해주세요.');
      return;
    }

    if (!uploadedFile) {
      alert('참고 이미지를 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 이미지 URL 생성 (UI 표시용)
      const imageUrl = URL.createObjectURL(uploadedFile);
      
      // 현재 날짜 생성 (YYYY-MM-DD 형식)
      const creationDate = new Date().toISOString().split('T')[0];
      
      // Reddit 이미지 데이터 구성 (temp_id 명시적 생성)
      const imageTempId = `reddit-temp-${Date.now()}`;
      const imageData = {
        temp_id: imageTempId,
        title: `${selectedLocation.name} Reddit 이미지`,
        location_id: selectedLocation.poi_id,
        location_name: selectedLocation.name,
        image_url: imageUrl,
        user_request: promptText && promptText.trim() ? promptText.trim() : null,
        platform: 'reddit' // 플랫폼 구분자 추가
      };
      
      // 🚀 낙관적 UI: on_request_success 콜백을 즉시 실행하여 UI가 먼저 반응
      if (onRequestSuccess) {
        onRequestSuccess({
          video_data: imageData, // 기존 구조 유지를 위해 video_data로 명명
          creation_date: creationDate,
          isPriority
        });
      } else {
        // 기존 방식: 직접 Zustand 스토어 호출
        if (isPriority) {
          use_content_launch.getState().replace_processing_video(imageData, creationDate);
        } else {
          use_content_launch.getState().add_pending_video(imageData, creationDate);
        }
      }
      
      // 폼 초기화
      resetForm();
      
      // Reddit API 준비 중 알림 (실제 API 대신)
      useNotificationStore.getState().add_notification({
        type: 'info',
        message: 'Reddit 이미지 생성 기능이 준비 중입니다. 백엔드 API 개발이 완료되면 실제 처리됩니다.',
        data: { 
          temp_id: imageTempId,
          platform: 'reddit',
          status: 'api_pending'
        }
      });
      
      // TODO: 실제 Reddit 이미지 생성 API가 준비되면 여기에 구현
      // 🔄 백그라운드 처리: Reddit 이미지 생성 API 호출
      // (async () => {
      //   try {
      //     await uploadImageToS3Complete(
      //       uploadedFile,
      //       selectedLocation.poi_id,
      //       promptText && promptText.trim() ? promptText.trim() : "",
      //       "REDDIT"
      //     );
      //   } catch (backgroundError) {
      //     use_content_launch.getState().transition_to_failed(imageTempId);
      //     useNotificationStore.getState().add_notification({
      //       type: 'error',
      //       message: `Reddit 이미지 생성에 실패했습니다: ${backgroundError.message}`,
      //       data: { 
      //         error: backgroundError.message,
      //         temp_id: imageTempId,
      //         failed_at: new Date().toISOString()
      //       }
      //     });
      //   }
      // })();
      
    } catch (error) {
      alert('요청 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLocation, uploadedFile, promptText, resetForm, onRequestSuccess, isPriority]);

  // 폼 검증 상태
  const isFormValid = selectedLocation && uploadedFile && !isSubmitting;

  return {
    // 상태
    selectedLocation,
    uploadedFile,
    promptText,
    isSubmitting,
    isFormValid,
    
    // 핸들러
    handleLocationSelect,
    handleFileChange,
    handlePromptChange,
    handleSubmit,
    resetForm
  };
};