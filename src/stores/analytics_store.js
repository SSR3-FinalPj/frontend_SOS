import { create } from 'zustand';
import { format_date } from '../utils/dashboard_utils.js';
import { get_youtube_range_summary } from '../lib/api.js';

const initialEndDate = new Date();
// 초기 종료일도 하루 끝까지 확장
initialEndDate.setHours(23, 59, 59, 999);

const initialStartDate = new Date();
initialStartDate.setDate(initialEndDate.getDate() - 6);

export const useAnalyticsStore = create((set, get) => {
  // 공통 로직: 기간 적용 및 API 호출
  const applyRange = (days) => {
    const end_date = new Date();
    end_date.setHours(23, 59, 59, 999); //종료일 하루 끝까지
    const start_date = new Date();
    start_date.setDate(end_date.getDate() - days);
    set({
      date_range: { from: start_date, to: end_date },
      is_calendar_visible: false,
      temp_period_label: ''
    });
    
    // 기간 변경 시 자동으로 API 호출
    get().fetchSummaryData();
  };

  return {
    selected_platform: 'youtube',
    selected_period: 'last7Days',
    is_calendar_visible: false,
    date_range: {
      from: initialStartDate,
      to: initialEndDate
    },
    temp_period_label: '',
    period_dropdown_open: false,
    
    // API 연동 관련 상태
    summaryData: null,
    isLoading: false,
    error: null,

    set_selected_platform: (platform) => set({ selected_platform: platform }),
    set_selected_period: (period) => set({ selected_period: period }),
    set_is_calendar_visible: (visible) => set({ is_calendar_visible: visible }),
    set_date_range: (range) => set({ date_range: range }),
    set_temp_period_label: (label) => set({ temp_period_label: label }),
    set_period_dropdown_open: (open) => set({ period_dropdown_open: open }),

    get_selected_period_label: () => {
      const { selected_period, temp_period_label, date_range } = get();
      if (selected_period === 'custom') {
        if (date_range?.from && date_range?.to) {
          return `${format_date(date_range.from)} ~ ${format_date(date_range.to)}`;
        }
        return '직접 설정';
      }

      const period_labels = {
        last7Days: '최근 7일',
        last30Days: '최근 30일',
        custom: '직접 설정'
      };

      return period_labels[selected_period] || period_labels.last30Days;
    },

    handle_period_select: (period_id) => {
      set({ selected_period: period_id, period_dropdown_open: false });

      switch (period_id) {
        case 'last7Days':
          applyRange(6);
          break;
        case 'last30Days':
          applyRange(29);
          break;
        case 'custom':
          set({ is_calendar_visible: true });
          break;
        default:
          applyRange(6);
          break;
      }
    },

    handle_apply_date_range: (range) => {
      if (range?.from && range?.to) {
        // 종료일을 하루 끝까지 확장
        const adjusted_to = new Date(range.to);
        adjusted_to.setHours(23, 59, 59, 999);

        const from_str = format_date(range.from);
        const to_str = format_date(adjusted_to);

        set({
          temp_period_label: `${from_str} ~ ${to_str}`,
          date_range: { from: range.from, to: adjusted_to },
          selected_period: 'custom'
        });
        
        // 날짜 범위 적용 시 API 호출
        get().fetchSummaryData();
      }
      set({ is_calendar_visible: false });
    },

    handle_calendar_cancel: () => {
      set({ is_calendar_visible: false });
    },

    handle_calendar_range_select: (range) => {
      if (range) {
        set({ date_range: range });
      }
    },

    // API 관련 액션들
    setDateRange: (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      set({
        date_range: { from: start, to: end }
      });
      
      get().fetchSummaryData();
    },

    fetchSummaryData: async () => {
      const { date_range, selected_platform } = get();
      
      if (selected_platform !== 'youtube' || !date_range?.from || !date_range?.to) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const startDate = date_range.from.toISOString().split('T')[0];
        const endDate = date_range.to.toISOString().split('T')[0];
        
        console.log('🔍 API 호출 파라미터:', { startDate, endDate });
        const response = await get_youtube_range_summary(startDate, endDate);
        console.log('📊 API 전체 응답:', response);
        
        // 여러 가능한 데이터 경로 시도
        let extractedData = null;
        
        if (response?.youtube?.data) {
          extractedData = response.youtube.data;
          console.log('📊 경로 1 (youtube.data):', extractedData);
        } else if (response?.data) {
          extractedData = response.data;
          console.log('📊 경로 2 (data):', extractedData);
        } else if (response && typeof response === 'object') {
          extractedData = response;
          console.log('📊 경로 3 (전체 응답):', extractedData);
        }
        
        console.log('📊 최종 추출된 데이터:', extractedData);
        
        set({ 
          summaryData: extractedData,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Analytics 데이터 페칭 실패:', error);
        set({ 
          summaryData: null,
          isLoading: false,
          error: error.message || '데이터를 불러오는데 실패했습니다.'
        });
      }
    },
  };
});
