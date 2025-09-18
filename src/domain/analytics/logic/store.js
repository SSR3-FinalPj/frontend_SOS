import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format_date, format_date_for_api } from '@/domain/dashboard/logic/dashboard-utils';
import { getYouTubeUploadsByRange, getTrafficSourceSummary, getYouTubeChannelId, getRedditChannelInfo, getRedditUploadsByRange, getYouTubeVideosByChannelId } from '@/common/api/api';
import { usePlatformStore } from '@/domain/platform/logic/store';

const initialEndDate = new Date();
initialEndDate.setHours(23, 59, 59, 999);

const initialStartDate = new Date();
initialStartDate.setDate(initialEndDate.getDate() - 6);

export const useAnalyticsStore = create(
  persist(
    (set, get) => {
      const applyRange = (days) => {
        const end_date = new Date();
        end_date.setHours(23, 59, 59, 999);
        const start_date = new Date();
        start_date.setDate(end_date.getDate() - days);
        set({
          date_range: { from: start_date, to: end_date },
          is_calendar_visible: false,
          temp_period_label: ''
        });
        
        get().fetchSummaryData();
        get().fetchTrafficSourceData();
      };

      return {
        selected_platform: 'youtube',
        view_type: 'detailed', // 'detailed' or 'integrated'
        selected_period: 'last7Days',
        is_calendar_visible: false,
        date_range: {
          from: initialStartDate,
          to: initialEndDate
        },
        temp_period_label: '',
        period_dropdown_open: false,
        
        summaryData: null,
        uploadedVideos: [],
        isLoading: false,
        error: null,
        
        trafficSourceData: null,
        isTrafficLoading: false,
        trafficError: null,

        set_selected_platform: (platform) => set({ selected_platform: platform }),
        set_view_type: (type) => set({ view_type: type }),
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
            const adjusted_to = new Date(range.to);
            adjusted_to.setHours(23, 59, 59, 999);

            const from_str = format_date(range.from);
            const to_str = format_date(adjusted_to);

            set({
              temp_period_label: `${from_str} ~ ${to_str}`,
              date_range: { from: range.from, to: adjusted_to },
              selected_period: 'custom'
            });
            
            get().fetchSummaryData();
            get().fetchTrafficSourceData();
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

        setDateRange: (startDate, endDate) => {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          
          set({
            date_range: { from: start, to: end }
          });
          
          get().fetchSummaryData();
          get().fetchTrafficSourceData();
        },

        fetchSummaryData: async () => {
          const { date_range, selected_platform } = get();
          
          if (!date_range?.from || !date_range?.to) {
            set({ summaryData: null, isLoading: false, error: '날짜 범위가 필요합니다.' });
            return;
          }

          set({ isLoading: true, error: null, summaryData: null }); // Reset summaryData on new fetch

          const startDate = format_date_for_api(date_range.from);
          const endDate = format_date_for_api(date_range.to);

          try {
            const { platforms } = usePlatformStore.getState();

            let channelInfo;
            if (selected_platform === 'youtube') {
              if (!platforms.google.connected && !platforms.google.linked) {
                throw new Error('YouTube 계정이 연동되어 있지 않습니다.');
              }
              channelInfo = await getYouTubeChannelId();
            } else if (selected_platform === 'reddit') {
              if (!platforms.reddit.connected && !platforms.reddit.linked) {
                throw new Error('Reddit 계정이 연동되어 있지 않습니다.');
              }
              channelInfo = await getRedditChannelInfo();
            } else {
              throw new Error('지원하지 않는 플랫폼입니다.');
            }

            if (!channelInfo || !channelInfo.channelId) {
              throw new Error(`${selected_platform === 'youtube' ? 'YouTube' : 'Reddit'} 채널 정보를 찾을 수 없습니다.`);
            }

            const { channelId } = channelInfo;
            let response;
            if (selected_platform === 'youtube') {
              response = await getYouTubeUploadsByRange(startDate, endDate, channelId);
            } else if (selected_platform === 'reddit') {
              response = await getRedditUploadsByRange(startDate, endDate, channelId);
            }

            if (!response) {
                throw new Error('데이터를 불러오는데 실패했습니다.');
            }

            set({
              summaryData: response, // Pass the whole response object
              isLoading: false,
              error: null
            });
          } catch (error) {
            set({
              summaryData: null,
              isLoading: false,
              error: error.message || '데이터를 불러오는데 실패했습니다.'
            });
          }
        },

        fetchTrafficSourceData: async () => {
          const { date_range, selected_platform } = get();

          if (selected_platform !== 'youtube' || !date_range?.from || !date_range?.to) {
            return;
          }

          set({ isTrafficLoading: true, trafficError: null });

          try {
            const startDate = format_date_for_api(date_range.from);
            const endDate = format_date_for_api(date_range.to);

            const response = await getTrafficSourceSummary(startDate, endDate);

            if (!response || !Array.isArray(response.data)) {
              throw new Error('잘못된 트래픽 소스 데이터 형식입니다.');
            }

            const chartData = response.data.map(item => ({
              name: getCategoryName(item.insightTrafficSourceType),
              value: parseInt(item.views) || 0,
            })).filter(item => item.value > 0);

            set({
              trafficSourceData: chartData,
              isTrafficLoading: false,
              trafficError: null
            });

          } catch (error) {
            set({
              trafficSourceData: null,
              isTrafficLoading: false,
              trafficError: error.message || '트래픽 소스 데이터를 불러오는데 실패했습니다.'
            });
          }
        },
      };
    },
    {
      name: 'analytics-storage',
      partialize: (state) => ({ selected_platform: state.selected_platform }),
    }
  )
);

function getCategoryName(categoryCode) {
  const categoryMap = {
    // 실제 API에서 반환하는 카테고리 코드
    'SEARCH': '검색',
    'DISCOVERY': '추천/탐색',
    'OWNED': '채널/구독/재생목록',
    'EXTERNAL': '외부ㆍ직접/임베드',
    'EXT_URL': '외부ㆍ직접/임베드',
    'SHORTS': '쇼츠',
    'YT_CHANNEL': '채널/구독/재생목록',

    // 기존 예상 코드들 (호환성 유지)
    'YT_SEARCH': '검색',
    'SUGGESTED_VIDEO': '추천/탐색', 
    'CHANNEL': '채널/구독/재생목록',
    'BROWSE': '탐색',
    'NOTIFICATION': '알림',
    'PLAYLIST': '재생목록',
    'YT_OTHER_PAGE': '기타 유튜브 페이지',
    'NO_LINK_OTHER': '기타',
    'SUBSCRIBER': '구독자',
    'RELATED_VIDEO': '관련 영상'
  };
  
  return categoryMap[categoryCode] || '기타';
}
