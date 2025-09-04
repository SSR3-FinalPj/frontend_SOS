/**
 * 콘텐츠 론칭 모달 상태 관리 커스텀 훅
 */

import { useState } from 'react';

/**
 * 콘텐츠 모달 관련 상태와 액션을 제공하는 훅
 * @returns {Object} 모달 상태와 액션 함수들
 */
export const use_content_modals = () => {
  const [preview_modal, set_preview_modal] = useState({
    open: false,
    item: null
  });

  const [publish_modal, set_publish_modal] = useState({
    open: false,
    item: null
  });

  const [publish_form, set_publish_form] = useState({
    platforms: [],
    title: '',
    description: '',
    tags: '',
    scheduled_time: '',
    // YouTube API 새로운 필드들
    privacyStatus: 'private',
    categoryId: '22', // People & Blogs
    madeForKids: false,
    // Reddit API 필드
    subreddit: ''
  });

  /**
   * 미리보기 모달 열기
   * @param {Object} item - 콘텐츠 아이템
   */
  const open_preview_modal = (item) => {
    set_preview_modal({ open: true, item });
  };

  /**
   * 미리보기 모달 닫기
   */
  const close_preview_modal = () => {
    set_preview_modal({ open: false, item: null });
  };

  /**
   * 게시 모달 열기
   * @param {Object} item - 콘텐츠 아이템
   */
  const open_publish_modal = (item) => {
    set_publish_form({
      platforms: [], // 사용자가 직접 플랫폼을 선택하도록 빈 배열로 초기화
      title: item.title || '',
      description: item.description || '',
      tags: '',
      scheduled_time: '',
      // YouTube API 새로운 필드들
      privacyStatus: 'private',
      categoryId: '22', // People & Blogs
      madeForKids: false,
      // Reddit API 필드
      subreddit: ''
    });
    set_publish_modal({ open: true, item });
  };

  /**
   * 게시 모달 닫기
   */
  const close_publish_modal = () => {
    set_publish_modal({ open: false, item: null });
    set_publish_form({
      platforms: [],
      title: '',
      description: '',
      tags: '',
      scheduled_time: '',
      // YouTube API 새로운 필드들 초기화
      privacyStatus: 'private',
      categoryId: '22', // People & Blogs
      madeForKids: false,
      // Reddit API 필드 초기화
      subreddit: ''
    });
  };

  /**
   * 플랫폼 선택 토글
   * @param {string} platform - 플랫폼 이름
   */
  const toggle_platform = (platform) => {
    set_publish_form(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  /**
   * 게시 폼 필드 업데이트
   * @param {string} field - 필드 이름
   * @param {string} value - 값
   */
  const update_publish_form = (field, value) => {
    set_publish_form(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    preview_modal,
    publish_modal,
    publish_form,
    open_preview_modal,
    close_preview_modal,
    open_publish_modal,
    close_publish_modal,
    toggle_platform,
    update_publish_form
  };
};