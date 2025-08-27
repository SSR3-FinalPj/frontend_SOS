/**
 * Dashboard 관련 유틸리티 함수들
 */

import { 
  Play, 
  MessageSquare, 
  Eye, 
  Heart, 
  TrendingUp, 
  BarChart3, 
  Star 
} from 'lucide-react';
import { reddit_chart_data } from './dashboard_constants.js';

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param {Date} date - 포맷팅할 날짜
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const format_date = (date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * 숫자를 한국어 단위로 포맷팅
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const format_number_korean = (num) => {
  if (!num || isNaN(num)) return '0';
  
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}억`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

/**
 * API 데이터를 기반으로 KPI 데이터 생성
 * @param {string} selectedPlatform - 선택된 플랫폼 ('youtube' | 'reddit')
 * @param {Object} summaryData - API에서 받은 요약 데이터
 * @returns {Array} KPI 데이터 배열
 */
export const get_kpi_data_from_api = (selectedPlatform, summaryData) => {
  console.log('🎯 KPI 데이터 생성:', { selectedPlatform, summaryData });
  
  if (selectedPlatform === 'youtube' && summaryData) {
    console.log('📋 summaryData 구조:', Object.keys(summaryData));
    
    // total 객체에서 데이터 추출
    const totalData = summaryData.total || summaryData;
    console.log('📊 totalData 내용:', totalData);
    console.log('📊 totalData 구조:', Object.keys(totalData || {}));
    
    // 여러 가능한 필드명 패턴 시도 (total 객체에서)
    const totalViews = totalData?.total_view_count || 
                      totalData?.totalViews || 
                      totalData?.viewCount || 
                      totalData?.views || 
                      summaryData.total_view_count || 
                      summaryData.totalViews || 
                      summaryData.viewCount || 
                      summaryData.views || 0;
                      
    const totalLikes = totalData?.total_like_count || 
                      totalData?.totalLikes || 
                      totalData?.likeCount || 
                      totalData?.likes || 
                      summaryData.total_like_count || 
                      summaryData.totalLikes || 
                      summaryData.likeCount || 
                      summaryData.likes || 0;
                      
    const totalComments = totalData?.total_comment_count || 
                         totalData?.totalComments || 
                         totalData?.commentCount || 
                         totalData?.comments || 
                         summaryData.total_comment_count || 
                         summaryData.totalComments || 
                         summaryData.commentCount || 
                         summaryData.comments || 0;

    console.log('🔢 추출된 숫자들:', { totalViews, totalLikes, totalComments });

    return [
      {
        icon: Eye,
        label: "총 조회수",
        value: format_number_korean(totalViews),
        bgColor: "bg-blue-50/80 dark:bg-blue-950/20",
        iconBg: "bg-blue-100 dark:bg-blue-900/30"
      },
      {
        icon: Heart,
        label: "총 좋아요",
        value: format_number_korean(totalLikes),
        bgColor: "bg-red-50/80 dark:bg-red-950/20",
        iconBg: "bg-red-100 dark:bg-red-900/30"
      },
      {
        icon: MessageSquare,
        label: "총 댓글",
        value: format_number_korean(totalComments),
        bgColor: "bg-green-50/80 dark:bg-green-950/20",
        iconBg: "bg-green-100 dark:bg-green-900/30"
      }
    ];
  }
  
  console.log('⚠️ API 데이터 없음, Mock 데이터 사용');
  // Fallback to mock data for reddit or when no data available
  return get_kpi_mock_data(selectedPlatform);
};

/**
 * 플랫폼별 Mock KPI 데이터 생성 (Fallback)
 * @param {string} selectedPlatform - 선택된 플랫폼 ('youtube' | 'reddit')
 * @returns {Array} KPI 데이터 배열
 */
export const get_kpi_mock_data = (selectedPlatform) => {
  if (selectedPlatform === 'youtube') {
    return [
      {
        icon: Eye,
        label: "총 조회수",
        value: "데이터 없음",
        bgColor: "bg-blue-50/80 dark:bg-blue-950/20",
        iconBg: "bg-blue-100 dark:bg-blue-900/30"
      },
      {
        icon: Heart,
        label: "총 좋아요",
        value: "데이터 없음",
        bgColor: "bg-red-50/80 dark:bg-red-950/20",
        iconBg: "bg-red-100 dark:bg-red-900/30"
      },
      {
        icon: MessageSquare,
        label: "총 댓글",
        value: "데이터 없음",
        bgColor: "bg-green-50/80 dark:bg-green-950/20",
        iconBg: "bg-green-100 dark:bg-green-900/30"
      }
    ];
  } else {
    return [
      {
        icon: TrendingUp,
        label: "총 업보트",
        value: "89.2K",
        bgColor: "bg-orange-50/80 dark:bg-orange-950/20",
        iconBg: "bg-orange-100 dark:bg-orange-900/30"
      },
      {
        icon: MessageSquare,
        label: "총 댓글",
        value: "23.1K",
        bgColor: "bg-green-50/80 dark:bg-green-950/20",
        iconBg: "bg-green-100 dark:bg-green-900/30"
      },
      {
        icon: Star,
        label: "평균 점수",
        value: "847",
        bgColor: "bg-purple-50/80 dark:bg-purple-950/20",
        iconBg: "bg-purple-100 dark:bg-purple-900/30"
      }
    ];
  }
};

/**
 * 플랫폼별 KPI 데이터 생성 (하위 호환성을 위한 기존 함수)
 * @param {string} selectedPlatform - 선택된 플랫폼 ('youtube' | 'reddit')
 * @returns {Array} KPI 데이터 배열
 */
export const get_kpi_data = (selectedPlatform) => {
  return get_kpi_mock_data(selectedPlatform);
};

/**
 * 플랫폼 데이터 생성
 * @returns {Array} 플랫폼 데이터 배열
 */
export const get_platform_data = (youtubeData) => {
  let totalViews = youtubeData?.total?.total_view_count || 0;
  let totalLikes = youtubeData?.total?.total_like_count || 0;
  let totalComments = youtubeData?.total?.total_comment_count || 0;
  let processedChartData = [];

  if (youtubeData && Array.isArray(youtubeData.daily)) {
    youtubeData.daily.forEach(dayData => {
      processedChartData.push({
        day: dayData.date ? dayData.date.substring(5) : '', // 'YYYY-MM-DD' -> 'MM-DD'
        views: dayData.view_count || 0,
        likes: dayData.like_count || 0,
      });
    });
  }

  const engagementRate = (totalLikes && totalViews) ? Math.min(100, ((totalLikes * 0.5 + totalComments * 0.8) / totalViews) * 100).toFixed(2) : "0.00";

  const youtubePlatform = {
    name: "YouTube",
    description: "동영상 플랫폼",
    totalVideos: youtubeData?.total?.total_video_count?.toLocaleString() || 0, // Total number of videos from the 'total' object
    status: "활성",
    statusColor: "text-green-500",
    icon: Play,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80 dark:bg-red-950/20",
    borderColor: "border-red-200/40 dark:border-red-800/30",
    accentColor: "text-red-600 dark:text-red-400",
    metrics: {
      views: { value: totalViews.toLocaleString(), label: "조회수", icon: Eye },
      likes: { value: totalLikes.toLocaleString(), label: "좋아요", icon: Heart },
      comments: { value: totalComments.toLocaleString(), label: "총 댓글", icon: MessageSquare }
    },
    growth: {
      value: `참여율 ${engagementRate}%`,
      period: "지난 7일",
      isPositive: true // This would need actual growth data to determine
    },
    chartData: processedChartData.length > 0 ? processedChartData : [], // Use processed data if available, else fallback
    chartMetrics: {
      primary: { key: "views", label: "조회수", color: "#dc2626" },
      secondary: { key: "likes", label: "좋아요", color: "#7c3aed" }
    }
  };

  const redditPlatform = { 
    name: "Reddit", 
    description: "커뮤니티 플랫폼",
    status: "활성", 
    statusColor: "text-green-500",
    icon: MessageSquare,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50/80 dark:bg-orange-950/20",
    borderColor: "border-orange-200/40 dark:border-orange-800/30",
    accentColor: "text-orange-600 dark:text-orange-400",
    metrics: {
      upvotes: { value: "1.9K", label: "업보트", icon: TrendingUp },
      comments: { value: "567", label: "댓글", icon: MessageSquare },
      upvoteRatio: { value: "77%", label: "업보트 비율", icon: BarChart3 }
    },
    growth: {
      value: "평균 스코어 234",
      period: "지난 7일",
      isPositive: true
    },
    chartData: reddit_chart_data,
    chartMetrics: {
      primary: { key: "upvotes", label: "업보트", color: "#ea580c" },
      secondary: { key: "comments", label: "댓글", color: "#16a34a" }
    }
  };

  return [youtubePlatform, redditPlatform];
};

/**
 * 플랫폼 옵션 배열 반환
 * @returns {Array} 플랫폼 옵션 배열
 */
export const get_platform_options = () => [
  { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-red-600' },
  { id: 'reddit', label: 'Reddit', icon: MessageSquare, color: 'text-orange-600' }
];

/**
 * 헤더 정보 반환
 * @param {string} current_view - 현재 뷰
 * @returns {Object} 헤더 정보 객체
 */
export const get_header_info = (current_view) => {
  switch (current_view) {
    case 'dashboard':
      return { 
        title: "플랫폼 성과 분석", 
        subtitle: "연동된 플랫폼의 정보를 간략하게 확인하세요" 
      };
    case 'analytics':
      return { 
        title: "상세 분석", 
        subtitle: "상세한 플랫폼 데이터와 인사이트를 확인하세요" 
      };
    case 'settings':
      return { 
        title: "환경설정", 
        subtitle: "서비스 환경을 개인화하고 데이터를 안전하게 관리" 
      };
    case 'contentList':
      return {
        title: "콘텐츠 관리",
        subtitle: "업로드된 콘텐츠를 필터링하고 관리하세요"
      };
    case 'contentLaunch':
      return {
        title: 'AI 콘텐츠 론칭',
        subtitle: 'AI가 생성한 미디어 콘텐츠를 검토하고 플랫폼에 론칭하세요'
      };
    default:
      return { 
        title: "플랫폼 성과 분석", 
        subtitle: "연동된 플랫폼의 정보를 간략하게 확인하세요" 
      };
  }
};