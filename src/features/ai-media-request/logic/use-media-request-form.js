/**
 * AI 미디어 요청 폼 상태 관리 커스텀 훅
 * 폼의 모든 상태와 핸들러들을 관리
 */

import { useState, useCallback, useEffect } from 'react';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { uploadImageToS3Complete, regenerateVideo } from '@/common/api/api';
import { useNotificationStore } from '@/features/real-time-notifications/logic/notification-store';

/**
 * useMediaRequestForm 커스텀 훅
 * @param {Function} on_close - 모달 닫기 함수
 * @param {boolean} isPriority - 우선순위 재생성 모드 여부
 * @param {Object|null} selectedVideoData - 선택된 영상 데이터 (자동 import용)
 * @param {Function|null} on_request_success - 요청 성공 콜백 함수
 * @param {string} selectedPlatform - 선택된 플랫폼 ('youtube' | 'reddit')
 * @returns {Object} 폼 상태와 핸들러들
 */
export const useMediaRequestForm = (on_close, isPriority = false, selectedVideoData = null, on_request_success = null, selectedPlatform = 'youtube') => {
  // 기본 폼 상태
  const [selected_location, set_selected_location] = useState(null);
  const [uploaded_file, set_uploaded_file] = useState(null);
  const [is_submitting, set_is_submitting] = useState(false);
  
  // 자연어 프롬프트 상태
  const [prompt_text, set_prompt_text] = useState('');
  
  // 성공 모달 상태
  const [is_success_modal_open, set_is_success_modal_open] = useState(false);

  // 위치 선택 핸들러
  const handle_location_select = useCallback((location) => {
    set_selected_location(location);
  }, []);

  // 파일 변경 핸들러
  const handle_file_change = useCallback((file) => {
    set_uploaded_file(file);
  }, []);

  // 프롬프트 변경 핸들러
  const handle_prompt_change = useCallback((value) => {
    set_prompt_text(value);
  }, []);

  // 성공 모달 닫기 핸들러
  const handle_success_modal_close = useCallback(() => {
    set_is_success_modal_open(false);
    on_close();
  }, [on_close]);

  // 폼 초기화 함수
  const reset_form = useCallback(() => {
    set_selected_location(null);
    set_uploaded_file(null);
    set_prompt_text('');
  }, []);

  // 선택된 영상 데이터로 폼 자동 초기화
  useEffect(() => {
    if (selectedVideoData) {
      //console.log('선택된 영상 데이터로 폼 자동 초기화:', selectedVideoData);
      
      // 위치 정보 자동 설정
      if (selectedVideoData.location_name || selectedVideoData.location_id) {
        const auto_location = {
          poi_id: selectedVideoData.location_id,
          name: selectedVideoData.location_name || '선택된 위치',
          // 추가 위치 정보가 있다면 여기에 포함
        };
        set_selected_location(auto_location);
      }
      
      // 이미지 자동 설정 (image_url이 있는 경우)
      if (selectedVideoData.image_url) {
        // URL을 File 객체로 변환하는 로직
        fetch(selectedVideoData.image_url)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], `${selectedVideoData.title || 'selected'}_image.jpg`, {
              type: blob.type || 'image/jpeg'
            });
            set_uploaded_file(file);
          })
          .catch(error => {
            console.warn('이미지 자동 로드 실패:', error);
          });
      }
      
      // 프롬프트 자동 설정
      const auto_prompt = selectedVideoData.title 
        ? `"${selectedVideoData.title}"과 유사한 영상을 생성해주세요.`
        : '선택한 영상과 유사한 새로운 영상을 생성해주세요.';
      set_prompt_text(auto_prompt);
    } else {
      // 선택된 영상이 없으면 폼 초기화
      reset_form();
    }
  }, [selectedVideoData, reset_form]);

  // 폼 제출 핸들러 (다중 플랫폼 병렬 처리)
  const handle_submit = useCallback(async () => {
    // 필수 항목 검증
    if (!selected_location) {
      alert('위치를 선택해주세요.');
      return;
    }

    if (!uploaded_file) {
      alert('참고 이미지를 업로드해주세요.');
      return;
    }

    if (!selectedPlatform) {
      alert('플랫폼을 선택해주세요.');
      return;
    }

    set_is_submitting(true);

    try {
      // 이미지 URL 생성 (UI 표시용)
      const image_url = URL.createObjectURL(uploaded_file);
      
      // 현재 날짜 생성 (YYYY-MM-DD 형식)
      const creation_date = new Date().toISOString().split('T')[0];
      
      // 마지막 요청 정보를 localStorage에 저장 (자동 생성용)
      const last_request_info = {
        location: selected_location,
        image_url: null,
        prompt: prompt_text && prompt_text.trim() ? prompt_text.trim() : null,
        platform: selectedPlatform,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('last_video_request', JSON.stringify(last_request_info));
      
      // 🚀 영상 데이터 생성 및 낙관적 UI 적용
      const video_temp_id = `temp-${Date.now()}`;
      const video_data = {
        temp_id: video_temp_id,
        title: `${selected_location.name} AI ${selectedPlatform === 'youtube' ? '영상' : '이미지'}`,
        location_id: selected_location.poi_id,
        location_name: selected_location.name,
        image_url: image_url,
        user_request: prompt_text && prompt_text.trim() ? prompt_text.trim() : null,
        platform: selectedPlatform
      };

      // 낙관적 UI: 즉시 UI에 반영
      if (on_request_success) {
        on_request_success({
          video_data,
          creation_date,
          isPriority
        });
      } else {
        if (isPriority) {
          use_content_launch.getState().replace_processing_video(video_data, creation_date);
        } else {
          use_content_launch.getState().add_pending_video(video_data, creation_date);
        }
      }

      // 폼 초기화
      reset_form();
      
      // 기존 방식에서 성공 모달 표시
      if (!on_request_success) {
        set_is_success_modal_open(true);
      }
      
      // 🔄 백그라운드 처리: S3 업로드를 비동기로 실행
      (async () => {
        try {
          // S3 통합 업로드 함수 사용 - selectedPlatform 전달
          const uploadResult = await uploadImageToS3Complete(
            uploaded_file,
            selected_location.poi_id,
            prompt_text && prompt_text.trim() ? prompt_text.trim() : "",
            selectedPlatform
          );
          
          // ✅ jobId를 영상 데이터에 추가 (백엔드에서 받은 jobId 사용)
          if (uploadResult.jobId) {
            use_content_launch.getState().update_video_job_info(video_temp_id, {
              jobId: uploadResult.jobId,
              job_id: uploadResult.jobId, // YouTube/Reddit 업로드에서 사용하는 필드명
              s3Key: uploadResult.s3Key
            });
          }
          
        } catch (background_error) {
          // 백그라운드 작업 실패 시 영상을 실패 상태로 전환
          use_content_launch.getState().transition_to_failed(video_temp_id);
          
          // 사용자에게 실패 알림
          useNotificationStore.getState().add_notification({
            type: 'error',
            message: `${selectedPlatform.toUpperCase()} 업로드에 실패했습니다: ${background_error.message}`,
            data: { 
              platform: selectedPlatform,
              error: background_error.message,
              temp_id: video_temp_id,
              failed_at: new Date().toISOString()
            }
          });
        }
      })();
      
    } catch (error) {
      alert('요청 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      set_is_submitting(false);
    }
  }, [selected_location, uploaded_file, prompt_text, selectedPlatform, reset_form, on_request_success, isPriority]);

  // 영상 재생성 핸들러
  const handle_regenerate = useCallback(async () => {
    // selectedVideoData가 있는지 확인
    if (!selectedVideoData) {
      alert('재생성할 영상이 선택되지 않았습니다.');
      return;
    }

    // 프롬프트 텍스트 검증
    if (!prompt_text || !prompt_text.trim()) {
      alert('재생성할 프롬프트를 입력해주세요.');
      return;
    }

    set_is_submitting(true);

    try {
      // selectedVideoData에서 videoId 추출 (video_id, temp_id, id 순으로 우선순위)
      const videoId = selectedVideoData.video_id || selectedVideoData.temp_id || selectedVideoData.id;
      
      if (!videoId) {
        throw new Error('영상 ID를 찾을 수 없습니다.');
      }

      console.log('영상 재생성 요청:', {
        videoId,
        prompt: prompt_text.trim(),
        selectedVideoData
      });

      // 영상 재생성 API 호출
      const result = await regenerateVideo(videoId, prompt_text.trim());

      // 성공 시 폼 초기화 및 모달 닫기
      reset_form();
      
      // 성공 알림
      useNotificationStore.getState().add_notification({
        type: 'success',
        message: '영상 재생성 요청이 성공적으로 전송되었습니다.',
        data: { 
          videoId,
          result
        }
      });

      // 모달 닫기
      on_close();
      
    } catch (error) {
      console.error('영상 재생성 실패:', error);
      alert(`영상 재생성에 실패했습니다: ${error.message}`);
    } finally {
      set_is_submitting(false);
    }
  }, [selectedVideoData, prompt_text, reset_form, on_close]);

  // 폼 검증 상태 (플랫폼 선택 포함)
  const is_form_valid = selected_location && uploaded_file && selectedPlatform && !is_submitting;

  return {
    // 상태
    selected_location,
    uploaded_file,
    prompt_text,
    is_submitting,
    is_success_modal_open,
    is_form_valid,
    
    // 핸들러
    handle_location_select,
    handle_file_change,
    handle_prompt_change,
    handle_submit,
    handle_regenerate,
    handle_success_modal_close,
    reset_form
  };
};