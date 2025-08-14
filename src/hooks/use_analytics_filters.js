/**
 * 분석 필터 관련 상태 관리 커스텀 훅
 */

import { useState, useRef, useEffect } from 'react';
import { period_options } from '../constants/dashboard_constants.js';
import { format_date } from '../utils/dashboard_utils.js';

/**
 * 분석 필터 관련 상태와 핸들러를 제공하는 훅
 * @returns {Object} 필터 상태와 핸들러들
 */
export const use_analytics_filters = () => {
  const [selected_platform, set_selected_platform] = useState('youtube');
  const [selected_period, set_selected_period] = useState('last30Days');
  const [is_calendar_visible, set_is_calendar_visible] = useState(false);
  const [date_range, set_date_range] = useState({
    from: undefined,
    to: undefined
  });
  const [temp_period_label, set_temp_period_label] = useState('');
  const [period_dropdown_open, set_period_dropdown_open] = useState(false);
  const period_dropdown_ref = useRef(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handle_click_outside = (event) => {
      if (period_dropdown_ref.current && !period_dropdown_ref.current.contains(event.target)) {
        set_period_dropdown_open(false);
      }
    };

    document.addEventListener('mousedown', handle_click_outside);
    return () => document.removeEventListener('mousedown', handle_click_outside);
  }, []);

  /**
   * 선택된 기간 라벨 반환
   * @returns {string} 기간 라벨
   */
  const get_selected_period_label = () => {
    if (selected_period === 'custom' && temp_period_label) {
      return temp_period_label;
    }
    
    const period_labels = {
      'last7Days': '최근 7일',
      'last30Days': '최근 30일',
      'last3Months': '최근 3개월',
      'thisYear': '올해',
      'customPeriod': '사용자 지정'
    };
    
    return period_labels[selected_period] || period_labels.last30Days;
  };

  /**
   * 기간 선택 핸들러
   * @param {string} period_id - 선택된 기간 ID
   */
  const handle_period_select = (period_id) => {
    set_selected_period(period_id);
    set_period_dropdown_open(false);
    
    if (period_id === 'custom') {
      set_is_calendar_visible(true);
    } else {
      set_temp_period_label('');
    }
  };

  /**
   * 날짜 범위 적용 핸들러
   * @param {Object} range - 선택된 날짜 범위
   */
  const handle_apply_date_range = (range) => {
    if (range && range.from && range.to) {
      const from_str = format_date(range.from);
      const to_str = format_date(range.to);
      set_temp_period_label(`${from_str} ~ ${to_str}`);
      set_date_range(range);
    }
    set_is_calendar_visible(false);
  };

  /**
   * 달력 취소 핸들러
   */
  const handle_calendar_cancel = () => {
    set_is_calendar_visible(false);
  };

  /**
   * 달력 범위 선택 핸들러
   * @param {Object} range - 선택된 날짜 범위
   */
  const handle_calendar_range_select = (range) => {
    if (range) {
      set_date_range(range);
    }
  };

  return {
    // 상태값들
    selected_platform,
    selected_period,
    is_calendar_visible,
    date_range,
    temp_period_label,
    period_dropdown_open,
    period_dropdown_ref,
    
    // 상태 변경 함수들
    set_selected_platform,
    set_selected_period,
    set_is_calendar_visible,
    set_date_range,
    set_temp_period_label,
    set_period_dropdown_open,
    
    // 헬퍼 함수들
    get_selected_period_label,
    
    // 핸들러 함수들
    handle_period_select,
    handle_apply_date_range,
    handle_calendar_cancel,
    handle_calendar_range_select
  };
};