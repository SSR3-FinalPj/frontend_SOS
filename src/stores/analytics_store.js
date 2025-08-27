import { create } from 'zustand';
import { format_date } from '../utils/dashboard_utils.js';

const initialEndDate = new Date();
// 초기 종료일도 하루 끝까지 확장
initialEndDate.setHours(23, 59, 59, 999);

const initialStartDate = new Date();
initialStartDate.setDate(initialEndDate.getDate() - 6);

export const useAnalyticsStore = create((set, get) => {
  // 공통 로직: 기간 적용
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
  };
});
