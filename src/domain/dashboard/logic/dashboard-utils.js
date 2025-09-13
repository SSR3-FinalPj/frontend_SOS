/**
 * Dashboard 관련 유틸리티 함수들 (최신 API 스키마 반영)
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
import { reddit_chart_data } from '@/domain/dashboard/logic/dashboard-constants';
import YoutubeIcon from '@/assets/images/button/Youtube_Icon.svg';
import RedditIcon from '@/assets/images/button/Reddit_Icon.svg';

/* ---------------- 날짜 / 숫자 포맷 ---------------- */

export const format_date = (date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const format_number_korean = (num) => {
  if (!num || isNaN(num)) return '0';
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
  if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

export const format_date_for_api = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* ---------------- KPI 생성 ---------------- */

export const get_kpi_data_from_api = (selectedPlatform, summaryData) => {
  if (selectedPlatform === 'youtube' && summaryData) {
    const totalData = summaryData.total || {};

    const totalViews = totalData.total_view_count || 0;
    const totalLikes = totalData.total_like_count || 0;
    const totalComments = totalData.total_comment_count || 0;

    const videoViews = Array.isArray(summaryData.videos)
      ? summaryData.videos.map(v => v.viewCount || 0)
      : [];
    const videoLikes = Array.isArray(summaryData.videos)
      ? summaryData.videos.map(v => v.likeCount || 0)
      : [];
    const videoComments = Array.isArray(summaryData.videos)
      ? summaryData.videos.map(v => v.commentCount || 0)
      : [];

    return [
      {
        icon: Eye,
        label: "총 조회수",
        value: format_number_korean(totalViews),
        bgColor: "bg-blue-50/80 dark:bg-blue-950/20",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        extra: videoViews.length
          ? `최고: ${Math.max(...videoViews)} | 최저: ${Math.min(...videoViews)}`
          : null
      },
      {
        icon: Heart,
        label: "총 좋아요",
        value: format_number_korean(totalLikes),
        bgColor: "bg-red-50/80 dark:bg-red-950/20",
        iconBg: "bg-red-100 dark:bg-red-900/30",
        extra: videoLikes.length
          ? `최고: ${Math.max(...videoLikes)} | 최저: ${Math.min(...videoLikes)}`
          : null
      },
      {
        icon: MessageSquare,
        label: "총 댓글",
        value: format_number_korean(totalComments),
        bgColor: "bg-green-50/80 dark:bg-green-950/20",
        iconBg: "bg-green-100 dark:bg-green-900/30",
        extra: videoComments.length
          ? `최고: ${Math.max(...videoComments)} | 최저: ${Math.min(...videoComments)}`
          : null
      }
    ];
  }

  if (selectedPlatform === 'reddit' && summaryData) {
    const totalData = summaryData.total || {};

    const totalUpvotes = totalData.total_upvote_count || 0;
    const totalComments = totalData.total_comment_count || 0;
    const averageRatio = totalData.total_upvote_ratio || 0;

    const postUpvotes = Array.isArray(summaryData.posts)
      ? summaryData.posts.map(p => p.upvote || 0)
      : [];
    const postComments = Array.isArray(summaryData.posts)
      ? summaryData.posts.map(p => p.comment_count || 0)
      : [];

    return [
      {
        icon: TrendingUp,
        label: "총 업보트",
        value: format_number_korean(totalUpvotes),
        bgColor: "bg-orange-50/80 dark:bg-orange-950/20",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        extra: postUpvotes.length
          ? `최고: ${Math.max(...postUpvotes)} | 최저: ${Math.min(...postUpvotes)}`
          : null
      },
      {
        icon: MessageSquare,
        label: "총 댓글",
        value: format_number_korean(totalComments),
        bgColor: "bg-green-50/80 dark:bg-green-950/20",
        iconBg: "bg-green-100 dark:bg-green-900/30",
        extra: postComments.length
          ? `최고: ${Math.max(...postComments)} | 최저: ${Math.min(...postComments)}`
          : null
      },
      {
        icon: Star,
        label: "평균 업보트 비율",
        value: `${(averageRatio * 100).toFixed(1)}%`,
        bgColor: "bg-purple-50/80 dark:bg-purple-950/20",
        iconBg: "bg-purple-100 dark:bg-purple-900/30"
      }
    ];
  }

  return get_kpi_mock_data(selectedPlatform);
};

/* ---------------- Mock KPI ---------------- */

export const get_kpi_mock_data = (selectedPlatform) => {
  if (selectedPlatform === 'youtube') {
    return [
      { icon: Eye, label: "총 조회수", value: "데이터 없음", bgColor: "bg-blue-50/80 dark:bg-blue-950/20", iconBg: "bg-blue-100 dark:bg-blue-900/30" },
      { icon: Heart, label: "총 좋아요", value: "데이터 없음", bgColor: "bg-red-50/80 dark:bg-red-950/20", iconBg: "bg-red-100 dark:bg-red-900/30" },
      { icon: MessageSquare, label: "총 댓글", value: "데이터 없음", bgColor: "bg-green-50/80 dark:bg-green-950/20", iconBg: "bg-green-100 dark:bg-green-900/30" }
    ];
  } else {
    return [
      { icon: TrendingUp, label: "총 업보트", value: "데이터 없음", bgColor: "bg-orange-50/80 dark:bg-orange-950/20", iconBg: "bg-orange-100 dark:bg-orange-900/30"},
      { icon: MessageSquare, label: "총 댓글", value: "데이터 없음", bgColor: "bg-green-50/80 dark:bg-green-950/20", iconBg: "bg-green-100 dark:bg-green-900/30"},
      { icon: Star, label: "평균 업보트 비율", value: "데이터 없음", bgColor: "bg-purple-50/80 dark:bg-purple-950/20", iconBg: "bg-purple-100 dark:bg-purple-900/30"}
    ];
  }
};

/* ---------------- 플랫폼 카드 데이터 ---------------- */

export const get_platform_data = (youtubeData, redditData) => {
  // --- YouTube ---
  const totalViews = youtubeData?.total?.total_view_count || 0;
  const totalLikes = youtubeData?.total?.total_like_count || 0;
  const totalComments = youtubeData?.total?.total_comment_count || 0;

  const youtubePlatform = {
    name: "YouTube",
    description: "동영상 플랫폼",
    totalVideos: youtubeData?.total?.total_video_count?.toLocaleString() || 0,
    status: "활성",
    statusColor: "text-green-500",
    icon: YoutubeIcon,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50/80 dark:bg-red-950/20",
    borderColor: "border-red-200/40 dark:border-red-800/30",
    accentColor: "text-red-600 dark:text-red-400",
    metrics: {
      views: { value: totalViews.toLocaleString(), label: "조회수", icon: Eye },
      likes: { value: totalLikes.toLocaleString(), label: "좋아요", icon: Heart },
      comments: { value: totalComments.toLocaleString(), label: "댓글", icon: MessageSquare }
    },
    chartData: Array.isArray(youtubeData?.videos)
      ? youtubeData.videos.map(v => ({
        day: v.uploadDate?.substring(5) || "",
        views: v.viewCount || 0,
        likes: v.likeCount || 0
      }))
      : [],
    chartMetrics: {
      primary: { key: "views", label: "조회수", color: "#dc2626" },
      secondary: { key: "likes", label: "좋아요", color: "#7c3aed" }
    }
  };

  // --- Reddit ---
  const totalUpvotes = redditData?.total?.total_upvote_count || 0;
  const totalCommentsReddit = redditData?.total?.total_comment_count || 0;
  const avgRatio = redditData?.total?.total_upvote_ratio || 0;

  const redditPlatform = {
    name: "Reddit",
    description: "커뮤니티 플랫폼",
    totalPosts: redditData?.total?.total_post_count?.toLocaleString() || 0,
    status: "활성",
    statusColor: "text-green-500",
    icon: RedditIcon,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50/80 dark:bg-orange-950/20",
    borderColor: "border-orange-200/40 dark:border-orange-800/30",
    accentColor: "text-orange-600 dark:text-orange-400",
    metrics: {
      upvotes: { value: totalUpvotes.toLocaleString(), label: "업보트", icon: TrendingUp },
      comments: { value: totalCommentsReddit.toLocaleString(), label: "댓글", icon: MessageSquare },
      upvoteRatio: { value: `${(avgRatio * 100).toFixed(1)}%`, label: "업보트 비율", icon: BarChart3 }
    },
    chartData: Array.isArray(redditData?.posts)
      ? redditData.posts.map(p => ({
        day: p.upload_date?.substring(5) || "",
        upvotes: p.upvote || 0,
        comments: p.comment_count || 0
      }))
      : reddit_chart_data,
    chartMetrics: {
      primary: { key: "upvotes", label: "업보트", color: "#ea580c" },
      secondary: { key: "comments", label: "댓글", color: "#16a34a" }
    }
  };

  return [youtubePlatform, redditPlatform];
};

/* ---------------- 플랫폼 옵션 ---------------- */

export const get_platform_options = () => [
  { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-red-600' },
  { id: 'reddit', label: 'Reddit', icon: MessageSquare, color: 'text-orange-600' }
];

/* ---------------- 헤더 정보 ---------------- */

export const get_header_info = (current_view) => {
  switch (current_view) {
    case 'dashboard':
      return { title: "플랫폼 성과 분석", subtitle: "연동된 플랫폼의 정보를 간략하게 확인하세요" };
    case 'analytics':
      return { title: "상세 분석", subtitle: "상세한 플랫폼 데이터와 인사이트를 확인하세요" };
    case 'settings':
      return { title: "환경설정", subtitle: "서비스 환경을 개인화하고 데이터를 안전하게 관리" };
    case 'contentList':
      return { title: "콘텐츠 관리", subtitle: "업로드된 콘텐츠를 필터링하고 관리하세요" };
    case 'contentLaunch':
      return { title: 'AI 콘텐츠 론칭', subtitle: 'AI가 생성한 미디어 콘텐츠를 검토하고 플랫폼에 론칭하세요' };
    default:
      return { title: "플랫폼 성과 분석", subtitle: "연동된 플랫폼의 정보를 간략하게 확인하세요" };
  }
};
