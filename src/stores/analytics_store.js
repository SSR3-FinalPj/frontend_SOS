import { create } from 'zustand';
import { format_date } from '../utils/dashboard_utils.js';
import { get_youtube_range_summary, get_all_videos, get_traffic_source_summary } from '../lib/api.js';

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
    get().fetchTrafficSourceData();
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
    
    // 트래픽 소스 관련 상태
    trafficSourceData: null,
    isTrafficLoading: false,
    trafficError: null,

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

    // API 관련 액션들
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

    // 트래픽 소스 데이터 조회
    fetchTrafficSourceData: async () => {
      const { date_range, selected_platform } = get();
      
      if (selected_platform !== 'youtube' || !date_range?.from || !date_range?.to) {
        console.log('⚠️ 트래픽 소스: 조건 불충족', { selected_platform, date_range });
        return;
      }

      set({ isTrafficLoading: true, trafficError: null });
      console.log('🚦 트래픽 소스 데이터 조회 시작');

      try {
        // 1. 전체 영상 목록 조회
        console.log('📹 전체 영상 목록 조회 중...');
        const videosResponse = await get_all_videos();
        console.log('📹 전체 영상 응답:', videosResponse);
        
        const videos = videosResponse?.videos || videosResponse || [];
        if (!Array.isArray(videos)) {
          throw new Error('영상 목록이 배열 형태가 아닙니다.');
        }

        // 2. 날짜 범위로 필터링
        const startDate = date_range.from.getTime();
        const endDate = date_range.to.getTime();
        
        const filteredVideos = videos.filter(video => {
          if (!video.publishedAt) return false;
          const publishDate = new Date(video.publishedAt).getTime();
          return publishDate >= startDate && publishDate <= endDate;
        });

        console.log(`📅 필터링된 영상 수: ${filteredVideos.length}/${videos.length}개`);

        if (filteredVideos.length === 0) {
          set({ 
            trafficSourceData: [],
            isTrafficLoading: false,
            trafficError: null
          });
          return;
        }

        // 3. 각 영상의 트래픽 소스 데이터 병렬 조회
        console.log('🔄 트래픽 소스 데이터 병렬 조회 시작...');
        console.log('🎬 조회할 영상 목록:', filteredVideos.map(v => ({
          videoId: v.videoId || v.id,
          title: v.title || v.snippet?.title,
          publishedAt: v.publishedAt
        })));

        const trafficPromises = filteredVideos.map(async (video, index) => {
          const videoId = video.videoId || video.id;
          console.log(`🔍 [${index + 1}/${filteredVideos.length}] 영상 ${videoId} 트래픽 소스 조회 시작`);
          
          try {
            const result = await get_traffic_source_summary(videoId);
            console.log(`✅ [${index + 1}] 영상 ${videoId} 트래픽 소스 조회 성공:`, result);
            return { videoId, result, index };
          } catch (error) {
            console.warn(`❌ [${index + 1}] 영상 ${videoId} 트래픽 소스 조회 실패:`, error);
            return { videoId, result: null, index };
          }
        });

        const trafficResults = await Promise.all(trafficPromises);
        console.log('🔄 트래픽 소스 조회 완료 - 전체 결과:', trafficResults);

        // 중복 데이터 감지
        const responseHashes = trafficResults
          .filter(item => item.result)
          .map(item => JSON.stringify(item.result));
        const uniqueResponses = new Set(responseHashes);
        
        if (responseHashes.length > 1 && uniqueResponses.size === 1) {
          console.warn('🚨 중복 데이터 감지: 모든 영상이 동일한 트래픽 소스 데이터를 반환했습니다!');
          console.warn('🚨 이는 API 캐싱, videoId 전달 오류, 또는 서버 측 문제일 수 있습니다.');
        } else if (uniqueResponses.size > 1) {
          console.log('✅ 영상별로 서로 다른 트래픽 소스 데이터가 정상적으로 반환되었습니다.');
        }

        // 4. categoryCode별 totalViews 합산
        const trafficSummary = {};
        
        trafficResults.forEach((item, index) => {
          if (!item || !item.result) return;
          
          const result = item.result;
          const videoId = item.videoId;
          
          console.log(`📊 [${index + 1}] 영상 ${videoId} 데이터 집계 중:`, result.data);
          
          if (!Array.isArray(result.data)) {
            console.warn(`⚠️ 영상 ${videoId}의 데이터가 배열이 아닙니다:`, result.data);
            return;
          }
          
          result.data.forEach(dataItem => {
            const categoryCode = dataItem.categoryCode || '기타';
            const totalViews = parseInt(dataItem.totalViews) || 0;
            
            console.log(`🔢 영상 ${videoId} - ${categoryCode}: ${totalViews}회`);
            
            if (trafficSummary[categoryCode]) {
              trafficSummary[categoryCode] += totalViews;
            } else {
              trafficSummary[categoryCode] = totalViews;
            }
          });
        });

        console.log('📊 카테고리별 집계:', trafficSummary);

        // 5. 차트용 데이터 형태로 변환
        const chartData = Object.entries(trafficSummary).map(([categoryCode, totalViews]) => ({
          name: getCategoryName(categoryCode),
          value: totalViews
        })).filter(item => item.value > 0); // 0인 항목 제거

        console.log('📈 최종 차트 데이터:', chartData);

        set({ 
          trafficSourceData: chartData,
          isTrafficLoading: false,
          trafficError: null
        });

      } catch (error) {
        console.error('트래픽 소스 데이터 조회 실패:', error);
        set({ 
          trafficSourceData: null,
          isTrafficLoading: false,
          trafficError: error.message || '트래픽 소스 데이터를 불러오는데 실패했습니다.'
        });
      }
    },
  };
});

// 카테고리 코드를 한국어 이름으로 변환하는 헬퍼 함수
function getCategoryName(categoryCode) {
  console.log('🏷️ 카테고리 코드 변환:', categoryCode);
  
  const categoryMap = {
    // 실제 API에서 반환하는 카테고리 코드
    'SEARCH': '검색',
    'DISCOVERY': '추천/탐색',
    'OWNED': '채널/구독/재생목록',
    'EXTERNAL': '외부ㆍ직접/임베드',
    
    // 기존 예상 코드들 (호환성 유지)
    'YT_SEARCH': '검색',
    'SUGGESTED_VIDEO': '추천/탐색', 
    'CHANNEL': '채널/구독/재생목록',
    'BROWSE': '탐색',
    'NOTIFICATION': '알림',
    'PLAYLIST': '재생목록',
    'YT_OTHER_PAGE': '기타 유튜브 페이지',
    'NO_LINK_OTHER': '알 수 없는 직접 액세스',
    'SUBSCRIBER': '구독자',
    'RELATED_VIDEO': '관련 영상'
  };
  
  const mappedName = categoryMap[categoryCode] || '기타';
  console.log('🏷️ 변환 결과:', `${categoryCode} → ${mappedName}`);
  
  return mappedName;
}
