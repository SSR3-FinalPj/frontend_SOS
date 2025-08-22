/**
 * AI 미디어 요청 폼 상태 관리 커스텀 훅
 * 폼의 모든 상태와 핸들러들을 관리
 */

import { useState, useCallback } from 'react';
import { CATEGORY_TRANSLATIONS } from '../utils/media_request_constants.js';
import { use_content_launch } from './use_content_launch.jsx';

/**
 * useMediaRequestForm 커스텀 훅
 * @param {Function} on_close - 모달 닫기 함수
 * @returns {Object} 폼 상태와 핸들러들
 */
export const useMediaRequestForm = (on_close) => {
  // 기본 폼 상태
  const [selected_location, set_selected_location] = useState(null);
  const [uploaded_file, set_uploaded_file] = useState(null);
  const [is_submitting, set_is_submitting] = useState(false);
  
  // 카테고리별 요청 상태
  const [request_categories, set_request_categories] = useState({
    style: '',
    subject: '',
    motion: '',
    constraints: ''
  });
  
  // 아코디언 상태 관리
  const [expanded_categories, set_expanded_categories] = useState({
    style: false,
    subject: false,
    motion: false,
    constraints: false
  });
  
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

  // 카테고리 선택 핸들러
  const handle_category_change = useCallback((category, value) => {
    set_request_categories(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);
  
  // 아코디언 토글 핸들러
  const handle_toggle_category = useCallback((category) => {
    set_expanded_categories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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
    set_request_categories({
      style: '',
      subject: '',
      motion: '',
      constraints: ''
    });
    set_expanded_categories({
      style: false,
      subject: false,
      motion: false,
      constraints: false
    });
  }, []);

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
      // 선택된 카테고리만 영어로 변환 (빈 값 제외)
      const translated_categories = {};
      
      Object.entries(request_categories).forEach(([key, value]) => {
        if (value && value.trim() && CATEGORY_TRANSLATIONS[key] && CATEGORY_TRANSLATIONS[key][value]) {
          translated_categories[key] = CATEGORY_TRANSLATIONS[key][value];
        }
      });

      // 백엔드 전송 데이터 구성
      const form_data = new FormData();
      form_data.append('location_id', selected_location.poi_id);
      
      // 선택된 카테고리가 있을 때만 user_request에 포함
      if (Object.keys(translated_categories).length > 0) {
        form_data.append('user_request', JSON.stringify({ user: translated_categories }));
      } else {
        // 첫 생성 시에는 빈 객체 전송
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
        user_request: Object.keys(translated_categories).length > 0 ? translated_categories : null
      };
      
      // Zustand 스토어에 '생성 중' 영상 추가
      use_content_launch.getState().add_pending_video(video_data, creation_date);
      
      // TODO: 실제 API 호출 구현

      // 성공 처리
      set_is_success_modal_open(true);
      reset_form();
      
    } catch (error) {
      console.error('제작 요청 전송 실패:', error);
      alert('요청 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      set_is_submitting(false);
    }
  }, [selected_location, uploaded_file, request_categories, reset_form]);

  // 폼 검증 상태
  const is_form_valid = selected_location && uploaded_file && !is_submitting;

  return {
    // 상태
    selected_location,
    uploaded_file,
    request_categories,
    expanded_categories,
    is_submitting,
    is_success_modal_open,
    is_form_valid,
    
    // 핸들러
    handle_location_select,
    handle_file_change,
    handle_category_change,
    handle_toggle_category,
    handle_submit,
    handle_success_modal_close,
    reset_form
  };
};