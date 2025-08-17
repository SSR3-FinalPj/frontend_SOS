/**
 * 콘텐츠 론칭 상태 관리 커스텀 훅
 */

import { useState } from 'react';

/**
 * 콘텐츠 론칭 관련 상태와 액션을 제공하는 훅
 * @returns {Object} 콘텐츠 론칭 상태와 액션 함수들
 */
export const use_content_launch = () => {
  const [open_folders, set_open_folders] = useState(['2024-12-13']);
  const [uploading_items, set_uploading_items] = useState([]);

  /**
   * 폴더 열기/닫기 토글
   * @param {string} date - 날짜 문자열
   */
  const toggle_folder = (date) => {
    set_open_folders(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  /**
   * 아이템 업로드 시작
   * @param {string} item_id - 아이템 ID
   */
  const start_upload = (item_id) => {
    set_uploading_items(prev => [...prev, item_id]);
  };

  /**
   * 아이템 업로드 완료
   * @param {string} item_id - 아이템 ID
   */
  const finish_upload = (item_id) => {
    set_uploading_items(prev => prev.filter(id => id !== item_id));
  };

  /**
   * 업로드 시뮬레이션
   * @param {string} item_id - 아이템 ID
   * @param {number} delay - 지연 시간 (기본값: 3000ms)
   */
  const simulate_upload = async (item_id, delay = 3000) => {
    start_upload(item_id);
    await new Promise(resolve => setTimeout(resolve, delay));
    finish_upload(item_id);
  };

  return {
    open_folders,
    uploading_items,
    toggle_folder,
    start_upload,
    finish_upload,
    simulate_upload
  };
};