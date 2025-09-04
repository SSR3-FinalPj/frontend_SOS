/**
 * AI 미디어 요청 폼 상태 관리 커스텀 훅
 * 폼의 모든 상태와 핸들러들을 관리
 */

import { useState, useCallback, useEffect } from 'react';
import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { uploadImageToS3Complete } from '@/common/api/api';
import { useNotificationStore } from '@/features/real-time-notifications/logic/notification-store';

/**
 * useMediaRequestForm 커스텀 훅
 * @param {Function} on_close - 모달 닫기 함수
 * @param {boolean} isPriority - 우선순위 재생성 모드 여부
 * @param {Object|null} selectedVideoData - 선택된 영상 데이터 (자동 import용)
 * @param {Function|null} on_request_success - 요청 성공 콜백 함수
 * @param {Array} selectedPlatforms - 선택된 플랫폼 배열
 * @returns {Object} 폼 상태와 핸들러들
 */
export const useMediaRequestForm = (on_close, isPriority = false, selectedVideoData = null, on_request_success = null, selectedPlatforms = []) => {
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

    if (selectedPlatforms.length === 0) {
      alert('하나 이상의 플랫폼을 선택해주세요.');
      return;
    }

    set_is_submitting(true);

    try {
      // 이미지를 Base64로 변환 (UI 표시용)
      const convert_to_base64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      };

      const image_url = await convert_to_base64(uploaded_file);
      
      // 현재 날짜 생성 (YYYY-MM-DD 형식)
      const creation_date = new Date().toISOString().split('T')[0];
      
      // 마지막 요청 정보를 localStorage에 저장 (자동 생성용)
      const last_request_info = {
        location: selected_location,
        image_url: image_url,
        prompt: prompt_text && prompt_text.trim() ? prompt_text.trim() : null,
        platforms: selectedPlatforms,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('last_video_request', JSON.stringify(last_request_info));
      
      // 🚀 각 플랫폼별로 영상 데이터 생성 및 낙관적 UI 적용
      const platform_videos = selectedPlatforms.map((platform, index) => {
        const video_temp_id = `temp-${Date.now()}-${platform}-${index}`;
        const video_data = {
          temp_id: video_temp_id,
          title: `${selected_location.name} AI ${platform === 'youtube' ? '영상' : '이미지'}`,
          location_id: selected_location.poi_id,
          location_name: selected_location.name,
          image_url: image_url,
          user_request: prompt_text && prompt_text.trim() ? prompt_text.trim() : null,
          platform: platform
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

        return { platform, video_temp_id, video_data };
      });

      // 폼 초기화
      reset_form();
      
      // 기존 방식에서 성공 모달 표시
      if (!on_request_success) {
        set_is_success_modal_open(true);
      }
      
      // 🔄 백그라운드 처리: 모든 플랫폼에 병렬 업로드
      (async () => {
        try {
          // 모든 플랫폼에 대한 업로드 프로미스 생성
          const uploadPromises = platform_videos.map(({ platform, video_temp_id }) => ({
            platform,
            video_temp_id,
            promise: uploadImageToS3Complete(
              uploaded_file,
              selected_location.poi_id,
              prompt_text && prompt_text.trim() ? prompt_text.trim() : "",
              platform
            )
          }));

          // 모든 업로드를 병렬로 실행
          const settledResults = await Promise.allSettled(
            uploadPromises.map(({ promise }) => promise)
          );

          // 각 플랫폼별 결과 처리
          settledResults.forEach((result, index) => {
            const { platform, video_temp_id } = uploadPromises[index];
            
            if (result.status === 'fulfilled') {
              // 성공한 경우
              const uploadResult = result.value;
              
              if (uploadResult.jobId) {
                use_content_launch.getState().update_video_job_info(video_temp_id, {
                  jobId: uploadResult.jobId,
                  job_id: uploadResult.jobId,
                  s3Key: uploadResult.s3Key
                });
              }
              
              // 개별 성공 알림
              useNotificationStore.getState().add_notification({
                type: 'success',
                message: `${platform.toUpperCase()} 업로드가 성공했습니다.`,
                data: {
                  platform,
                  temp_id: video_temp_id,
                  jobId: uploadResult.jobId
                }
              });
              
            } else {
              // 실패한 경우
              const error = result.reason;
              
              use_content_launch.getState().transition_to_failed(video_temp_id);
              
              // 개별 실패 알림
              useNotificationStore.getState().add_notification({
                type: 'error',
                message: `${platform.toUpperCase()} 업로드에 실패했습니다: ${error.message}`,
                data: { 
                  platform,
                  error: error.message,
                  temp_id: video_temp_id,
                  failed_at: new Date().toISOString()
                }
              });
            }
          });
          
        } catch (background_error) {
          // 전체적인 백그라운드 처리 실패
          console.error('Background upload processing failed:', background_error);
          
          // 모든 영상을 실패 상태로 전환
          platform_videos.forEach(({ video_temp_id }) => {
            use_content_launch.getState().transition_to_failed(video_temp_id);
          });
          
          useNotificationStore.getState().add_notification({
            type: 'error',
            message: `업로드 처리 중 오류가 발생했습니다: ${background_error.message}`,
            data: { 
              error: background_error.message,
              platforms: selectedPlatforms,
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
  }, [selected_location, uploaded_file, prompt_text, selectedPlatforms, reset_form, on_request_success, isPriority]);

  // 폼 검증 상태 (플랫폼 선택 포함)
  const is_form_valid = selected_location && uploaded_file && selectedPlatforms.length > 0 && !is_submitting;

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
    handle_success_modal_close,
    reset_form
  };
};