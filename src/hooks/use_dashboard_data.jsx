/**
 * 대시보드 데이터 관리 커스텀 훅
 */

import { useState, useMemo } from 'react';
import { 
  latest_content_data, 
  weekly_activity_data 
} from '../constants/dashboard_constants.js';
import { get_platform_data, get_kpi_data } from '../utils/dashboard_utils.js';

/**
 * 대시보드 데이터 관련 상태와 로직을 제공하는 훅
 * @param {Object} t - 번역 객체
 * @returns {Object} 데이터와 상태 관리 함수들
 */
export const use_dashboard_data = (t) => {
  const [current_view, set_current_view] = useState('dashboard');
  const [selected_platform, set_selected_platform] = useState('all');
  const [sort_order, set_sort_order] = useState('latest');

  // 플랫폼 데이터 메모이제이션
  const platform_data = useMemo(() => get_platform_data(), []);

  // 최신 콘텐츠 데이터 메모이제이션
  const content_data = useMemo(() => latest_content_data, []);

  // 주간 활동 데이터 메모이제이션
  const activity_data = useMemo(() => weekly_activity_data, []);

  /**
   * 플랫폼별 KPI 데이터 가져오기
   * @param {string} platform - 플랫폼 ID
   * @returns {Array} KPI 데이터 배열
   */
  const get_platform_kpi_data = (platform) => {
    return get_kpi_data(platform, t);
  };

  /**
   * 필터링된 콘텐츠 데이터 가져오기
   * @param {string} platform_filter - 플랫폼 필터
   * @param {string} sort_filter - 정렬 필터
   * @returns {Array} 필터링된 콘텐츠 배열
   */
  const get_filtered_content = (platform_filter = 'all', sort_filter = 'latest') => {
    let filtered = [...content_data];

    // 플랫폼 필터링 (필요시 확장)
    if (platform_filter !== 'all') {
      // 실제 구현에서는 콘텐츠 데이터에 platform 필드가 있어야 함
    }

    // 정렬
    if (sort_filter === 'latest') {
      filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    } else if (sort_filter === 'oldest') {
      filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
    }

    return filtered;
  };

  /**
   * 커스텀 툴팁 컴포넌트
   * @param {Object} props - 툴팁 props
   * @returns {JSX.Element|null} 툴팁 컴포넌트
   */
  const create_custom_tooltip = (platform) => ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/30 dark:border-gray-600/30 rounded-xl p-4 shadow-xl">
          <p className="font-medium text-gray-800 dark:text-white mb-2">{data.date}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600 dark:text-blue-400">
              {platform === 'youtube' ? '조회수' : '업보트'}: {data.views?.toLocaleString() || data.upvotes?.toLocaleString()}
            </p>
            <p className="text-red-600 dark:text-red-400">
              좋아요: {data.likes?.toLocaleString()}
            </p>
            <p className="text-green-600 dark:text-green-400">
              댓글: {data.comments?.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return {
    // 상태값들
    current_view,
    selected_platform,
    sort_order,
    platform_data,
    content_data,
    activity_data,
    
    // 상태 변경 함수들
    set_current_view,
    set_selected_platform,
    set_sort_order,
    
    // 데이터 가져오기 함수들
    get_platform_kpi_data,
    get_filtered_content,
    create_custom_tooltip
  };
};