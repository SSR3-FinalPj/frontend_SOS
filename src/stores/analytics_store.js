import { create } from 'zustand';
import { format_date } from '../utils/dashboard_utils.js';

export const useAnalyticsStore = create((set, get) => ({
  selected_platform: 'youtube',
  selected_period: 'last30Days',
  is_calendar_visible: false,
  date_range: {
    from: undefined,
    to: undefined
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
        if (date_range && date_range.from && date_range.to) {
            return `${format_date(date_range.from)} ~ ${format_date(date_range.to)}`;
        }
        return '직접 설정';
    }
    
    const period_labels = {
      'last7Days': '최근 7일',
      'last30Days': '최근 30일',
      'custom': '직접 설정'
    };
    
    return period_labels[selected_period] || period_labels.last30Days;
  },

  handle_period_select: (period_id) => {
    set({ selected_period: period_id, period_dropdown_open: false });
    if (period_id === 'custom') {
      set({ is_calendar_visible: true });
    } else {
      set({ temp_period_label: '' });
    }
  },

  handle_apply_date_range: (range) => {
    if (range && range.from && range.to) {
      const from_str = format_date(range.from);
      const to_str = format_date(range.to);
      set({ temp_period_label: `${from_str} ~ ${to_str}` });
      set({ date_range: range, selected_period: 'custom' });
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
}));