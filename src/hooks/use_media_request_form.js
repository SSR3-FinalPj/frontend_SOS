/**
 * AI 미디어 요청 폼 상태 관리 커스텀 훅
 * 폼의 모든 상태와 핸들러들을 관리
 */

import { useState, useCallback, useEffect } from 'react';
import { use_content_launch } from './use_content_launch.jsx';
import { apiFetch } from '../lib/api.js';

/**
 * useMediaRequestForm 커스텀 훅
 * @param {Function} on_close - 모달 닫기 함수
 * @param {boolean} isPriority - 우선순위 재생성 모드 여부
 * @param {Object|null} selectedVideoData - 선택된 영상 데이터 (자동 import용)
 * @param {Function|null} on_request_success - 요청 성공 콜백 함수
 * @returns {Object} 폼 상태와 핸들러들
 */
export const useMediaRequestForm = (on_close, isPriority = false, selectedVideoData = null, on_request_success = null) => {
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

  // 폼 제출 핸들러
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

    set_is_submitting(true);

    try {
      // 백엔드 전송 데이터 구성
      const form_data = new FormData();
      form_data.append('location_id', selected_location.poi_id);
      
      // 프롬프트가 있을 때만 user_request에 포함
      if (prompt_text && prompt_text.trim()) {
        form_data.append('user_request', JSON.stringify({ prompt: prompt_text.trim() }));
      } else {
        // 프롬프트 없을 시에는 빈 객체 전송
        form_data.append('user_request', JSON.stringify({}));
      }
      
      form_data.append('reference_image', uploaded_file);

      // 이미지를 Base64로 변환
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
      
      // 영상 데이터 구성
      const video_data = {
        title: `${selected_location.name} AI 영상`,
        location_id: selected_location.poi_id,
        location_name: selected_location.name,
        image_url: image_url,
        user_request: prompt_text && prompt_text.trim() ? prompt_text.trim() : null
      };
      
      // 마지막 요청 정보를 localStorage에 저장 (자동 생성용)
      const last_request_info = {
        location: selected_location,
        image_url: image_url, // base64 이미지 URL 저장 (파일 객체 대신)
        prompt: prompt_text && prompt_text.trim() ? prompt_text.trim() : null,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('last_video_request', JSON.stringify(last_request_info));
      
      // on_request_success 콜백이 있으면 호출, 없으면 기존 로직 사용
      if (on_request_success) {
        // 새로운 방식: 성공 콜백으로 데이터 전달
        on_request_success({
          video_data,
          creation_date,
          isPriority
        });
      } else {
        // 기존 방식: 직접 Zustand 스토어 호출
        if (isPriority) {
          use_content_launch.getState().replace_processing_video(video_data, creation_date);
        } else {
          use_content_launch.getState().add_pending_video(video_data, creation_date);
        }
      }
      
      // S3 Presigned URL을 이용한 2단계 업로드
      // 1단계: 백엔드에서 presigned URL 가져오기
// 1) presign 호출
const presignRes = await apiFetch('/api/images/presign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // Authorization은 apiFetch가 자동 추가
  body: JSON.stringify({ contentType: uploaded_file.type })
});

if (!presignRes.ok) {
  const errText = await presignRes.text().catch(() => '');
  throw new Error(`Presigned URL 요청 실패: ${presignRes.status} ${errText}`);
}

// 2) presign 결과 파싱 + 로그
const presign = await presignRes.json(); // { url, key, contentType }
const { url, key, contentType } = presign;

// 보안상 쿼리(서명) 없이 경로만 보고 싶으면:
try {
  const u = new URL(url);
} catch { /* url 파싱 실패해도 무시 */ }

// 표로 깔끔하게 보고 싶으면:


      // 2단계: S3에 직접 파일 업로드
const uploadRes = await fetch(url, {
  method: 'PUT',
  headers: { 'Content-Type': contentType }, // presign에 사용한 값과 완전히 동일!
  body: uploaded_file
});

if (!uploadRes.ok) {
  const errText = await uploadRes.text().catch(() => '');
  throw new Error(`S3 업로드 실패: ${uploadRes.status} ${errText}`);
}

      // 3단계: 백엔드에 업로드 완료 알림
const notifyRes = await apiFetch('/api/images/confirm', {
  method: 'POST', // ✅ 서버는 POST로 받음
  headers: { 'Content-Type': 'application/json' }, // Authorization은 apiFetch가 자동 추가
  body: JSON.stringify({
    key, // presign에서 받은 key 그대로
    locationCode: selected_location.poi_id
  })
});

if (!notifyRes.ok) {
  const errText = await notifyRes.text().catch(() => '');
  throw new Error(`업로드 완료 알림 실패: ${notifyRes.status} ${errText}`);
}

const confirmJson = await notifyRes.json().catch(() => ({}));

      // 성공 처리
      if (!on_request_success) {
        // 기존 방식: 직접 성공 모달 표시
        set_is_success_modal_open(true);
      }
      reset_form();
      
    } catch (error) {
      alert('요청 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      set_is_submitting(false);
    }
  }, [selected_location, uploaded_file, prompt_text, reset_form]);

  // 폼 검증 상태
  const is_form_valid = selected_location && uploaded_file && !is_submitting;

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