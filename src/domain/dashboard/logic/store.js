/**
 * 대시보드 전용 상태 관리 Zustand 스토어
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * 대시보드 상태 관리 스토어
 */
export const use_dashboard_store = create(
  devtools(
    (set, get) => ({
      // 현재 뷰 상태
      current_view: 'dashboard',
      
      // 플랫폼 필터 상태
      selected_platform: 'all',
      
      // 정렬 상태
      sort_order: 'latest',
      
      // 분석 필터 상태
      analytics_filters: {
        selected_platform: 'youtube',
        selected_period: 'last30Days',
        is_calendar_visible: false,
        date_range: {
          from: undefined,
          to: undefined
        },
        temp_period_label: ''
      },
      
      // 로딩 상태
      is_loading: false,
      
      // 에러 상태
      error: null,

      // 액션들
      actions: {
        /**
         * 현재 뷰 설정
         * @param {string} view - 설정할 뷰
         */
        set_current_view: (view) => set(
          { current_view: view },
          false,
          'dashboard_store/set_current_view'
        ),

        /**
         * 선택된 플랫폼 설정
         * @param {string} platform - 설정할 플랫폼
         */
        set_selected_platform: (platform) => set(
          { selected_platform: platform },
          false,
          'dashboard_store/set_selected_platform'
        ),

        /**
         * 정렬 순서 설정
         * @param {string} order - 설정할 정렬 순서
         */
        set_sort_order: (order) => set(
          { sort_order: order },
          false,
          'dashboard_store/set_sort_order'
        ),

        /**
         * 분석 필터 업데이트
         * @param {Object} filters - 업데이트할 필터 객체
         */
        update_analytics_filters: (filters) => set(
          (state) => ({
            analytics_filters: {
              ...state.analytics_filters,
              ...filters
            }
          }),
          false,
          'dashboard_store/update_analytics_filters'
        ),

        /**
         * 로딩 상태 설정
         * @param {boolean} loading - 로딩 상태
         */
        set_loading: (loading) => set(
          { is_loading: loading },
          false,
          'dashboard_store/set_loading'
        ),

        /**
         * 에러 상태 설정
         * @param {string|null} error - 에러 메시지
         */
        set_error: (error) => set(
          { error },
          false,
          'dashboard_store/set_error'
        ),

        /**
         * 상태 초기화
         */
        reset_state: () => set(
          {
            current_view: 'dashboard',
            selected_platform: 'all',
            sort_order: 'latest',
            analytics_filters: {
              selected_platform: 'youtube',
              selected_period: 'last30Days',
              is_calendar_visible: false,
              date_range: {
                from: undefined,
                to: undefined
              },
              temp_period_label: ''
            },
            is_loading: false,
            error: null
          },
          false,
          'dashboard_store/reset_state'
        )
      }
    }),
    {
      name: 'dashboard-store'
    }
  )
);

// 액션 셀렉터 (편의를 위한 별도 export)
export const use_dashboard_actions = () => use_dashboard_store((state) => state.actions);