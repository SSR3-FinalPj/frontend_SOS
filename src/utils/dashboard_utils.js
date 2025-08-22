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
import { youtube_chart_data, reddit_chart_data } from './dashboard_constants.js';

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
 * 플랫폼별 KPI 데이터 생성
 * @param {string} selected_platform - 선택된 플랫폼 ('youtube' | 'reddit')
 * @returns {Array} KPI 데이터 배열
 */
export const get_kpi_data = (selected_platform) => {
  if (selected_platform === 'youtube') {
    return [
      {
        icon: Eye,
        label: "총 조회수",
        value: "2.4M",
        change: "+12.3%",
        isPositive: true,
        bgColor: "bg-blue-50/80 dark:bg-blue-950/20",
        iconBg: "bg-blue-100 dark:bg-blue-900/30"
      },
      {
        icon: Heart,
        label: "총 좋아요",
        value: "156K",
        change: "+8.7%",
        isPositive: true,
        bgColor: "bg-red-50/80 dark:bg-red-950/20",
        iconBg: "bg-red-100 dark:bg-red-900/30"
      },
      {
        icon: MessageSquare,
        label: "총 댓글",
        value: "12.3K",
        change: "+15.1%",
        isPositive: true,
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
        change: "+18.4%",
        isPositive: true,
        bgColor: "bg-orange-50/80 dark:bg-orange-950/20",
        iconBg: "bg-orange-100 dark:bg-orange-900/30"
      },
      {
        icon: MessageSquare,
        label: "총 댓글",
        value: "23.1K",
        change: "+9.2%",
        isPositive: true,
        bgColor: "bg-green-50/80 dark:bg-green-950/20",
        iconBg: "bg-green-100 dark:bg-green-900/30"
      },
      {
        icon: Star,
        label: "평균 점수",
        value: "847",
        change: "+5.6%",
        isPositive: true,
        bgColor: "bg-purple-50/80 dark:bg-purple-950/20",
        iconBg: "bg-purple-100 dark:bg-purple-900/30"
      }
    ];
  }
};

/**
 * 플랫폼 데이터 생성
 * @returns {Array} 플랫폼 데이터 배열
 */
export const get_platform_data = (youtubeData) => {
  const youtubePlatform = {
    name: "YouTube",
    description: "동영상 플랫폼",
    status: "활성",
    statusColor: "text-green-500",
    icon: Play,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80 dark:bg-red-950/20",
    borderColor: "border-red-200/40 dark:border-red-800/30",
    accentColor: "text-red-600 dark:text-red-400",
    metrics: {
      views: { value: youtubeData?.total_view_count?.toLocaleString() || "24.5K", label: "조회수", icon: Eye },
      likes: { value: youtubeData?.total_like_count?.toLocaleString() || "3.2K", label: "좋아요", icon: Heart },
      engagementRate: { value: ((youtubeData?.total_like_count && youtubeData?.total_view_count) ? ((youtubeData.total_like_count / youtubeData.total_view_count) * 100).toFixed(2) + '%' : "13.2%"), label: "참여율", icon: TrendingUp }
    },
    growth: {
      value: "참여율 13.2%", // API does not provide growth data for total
      period: "지난 7일",
      isPositive: true
    },
    chartData: youtube_chart_data, // API does not provide chart data for total
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