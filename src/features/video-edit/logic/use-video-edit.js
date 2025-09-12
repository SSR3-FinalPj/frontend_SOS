/**
 * 영상 수정 전용 로직 훅
 * 선택된 영상의 resultId와 새 프롬프트를 백엔드에 전송
 */

import { useState, useCallback, useMemo } from 'react';
import { regenerateVideo } from '@/common/api/api';
import { useNotificationStore } from '@/features/real-time-notifications/logic/notification-store';

/**
 * useVideoEdit 커스텀 훅
 * @param {Object} selected_video - 수정할 영상 데이터
 * @param {Function} on_close - 모달 닫기 함수
 * @returns {Object} 수정 관련 상태와 핸들러들
 */
export const useVideoEdit = (selected_video, on_close) => {
  const [prompt_text, set_prompt_text] = useState('');
  const [is_submitting, set_is_submitting] = useState(false);

  // 글자수 계산
  const character_count = useMemo(() => prompt_text.length, [prompt_text]);

  // 프롬프트 변경 핸들러
  const handle_prompt_change = useCallback((value) => {
    if (value.length <= 500) {
      set_prompt_text(value);
    }
  }, []);

  // 폼 초기화
  const reset_form = useCallback(() => {
    set_prompt_text('');
    set_is_submitting(false);
  }, []);

  // 영상 수정 제출 핸들러
  const handle_edit_submit = useCallback(async () => {
    if (!selected_video) {
      alert('수정할 영상이 선택되지 않았습니다.');
      return;
    }

    if (!prompt_text.trim()) {
      alert('수정할 프롬프트를 입력해주세요.');
      return;
    }

    // PROCESSING 상태 영상에 대한 사용자 확인
    if (selected_video.status === 'PROCESSING') {
      const confirmed = window.confirm(
        '현재 생성 중인 영상입니다. 수정 요청 시 기존 생성 작업이 중단될 수 있습니다. 계속하시겠습니까?'
      );
      if (!confirmed) {
        return;
      }
    }

    set_is_submitting(true);

    try {
      // resultId 추출 (우선순위: resultId > video_id > temp_id > id)
      const videoId = selected_video.resultId || 
                     selected_video.video_id || 
                     selected_video.temp_id || 
                     selected_video.id;

      if (!videoId) {
        throw new Error('영상 ID를 찾을 수 없습니다.');
      }

      
        videoId,
        resultId: selected_video.resultId,
        prompt: prompt_text.trim(),
        selected_video_title: selected_video.title
      });

      // API 호출: resultId (또는 videoId) + prompt 전송
      const result = await regenerateVideo(videoId, prompt_text.trim());

      

      // 성공 알림
      useNotificationStore.getState().add_notification({
        type: 'success',
        message: `"${selected_video.title}" 영상 수정 요청이 성공적으로 전송되었습니다.`,
        data: {
          original_video_id: videoId,
          original_title: selected_video.title,
          new_prompt: prompt_text.trim(),
          result,
          timestamp: new Date().toISOString()
        }
      });

      // 폼 초기화 및 모달 닫기
      reset_form();
      on_close();

    } catch (error) {
      console.error('영상 수정 요청 실패:', error);
      
      // 에러 알림
      useNotificationStore.getState().add_notification({
        type: 'error',
        message: `영상 수정 요청에 실패했습니다: ${error.message}`,
        data: {
          error: error.message,
          video_title: selected_video.title,
          attempted_prompt: prompt_text.trim(),
          timestamp: new Date().toISOString()
        }
      });

      // 사용자에게도 알림
      alert(`영상 수정에 실패했습니다: ${error.message}`);
      
    } finally {
      set_is_submitting(false);
    }
  }, [selected_video, prompt_text, reset_form, on_close]);

  // 영상 정보 검증
  const is_video_valid = useMemo(() => {
    if (!selected_video) return false;
    
    const hasId = !!(selected_video.resultId || 
                    selected_video.video_id || 
                    selected_video.temp_id || 
                    selected_video.id);
    
    const hasTitle = !!selected_video.title;
    
    return hasId && hasTitle;
  }, [selected_video]);

  // 폼 검증
  const is_form_valid = useMemo(() => {
    return is_video_valid && 
           prompt_text.trim().length > 0 && 
           character_count <= 500 && 
           !is_submitting;
  }, [is_video_valid, prompt_text, character_count, is_submitting]);

  return {
    // 상태
    prompt_text,
    is_submitting,
    character_count,
    is_form_valid,
    is_video_valid,
    
    // 핸들러
    handle_prompt_change,
    handle_edit_submit,
    reset_form,
    
    // 영상 정보
    video_info: selected_video ? {
      id: selected_video.resultId || selected_video.video_id || selected_video.temp_id || selected_video.id,
      title: selected_video.title,
      platform: selected_video.platform,
      location: selected_video.location_name,
      original_prompt: selected_video.user_request,
      created_at: selected_video.created_at || selected_video.creationTime
    } : null
  };
};
