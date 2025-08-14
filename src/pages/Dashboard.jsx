import { useState, useEffect, useRef } from 'react';
import 'react-day-picker/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  Play,
  Upload,
  Zap,
  BarChart,
  PieChart,
  Link,
  ChevronRight,
  ArrowLeft,
  Filter,
  Download,
  ArrowUp,
  Unlink,
  FileText,
  Check,
  Image,
  Clock,
  ChevronLeft,
  Bookmark,
  Star,
  Award,
  ThumbsUp,
  Calendar as CalendarIcon,
  Activity,
  Target,
  MousePointer
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { usePageStore } from '../stores/page_store.js';
import { Calendar as CalendarComponent } from "../components/ui/calendar.jsx";
import { EnhancedPlatformCard } from "../components/dashboard/enhanced-platform-card.jsx";
import { ConnectionManagementCard } from "../components/dashboard/connection-management-card.jsx";
import { DataExportCard } from "../components/dashboard/data-export-card.jsx";
import { ContentListView } from "../components/dashboard/content-list-view.jsx";
import { ContentLaunchPage } from "./ContentLaunchPage.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.jsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../components/ui/pagination.jsx";


// Dashboard translations
const dashboardTranslations = {
  ko: {
    brandName: "콘텐츠부스트",
    dashboard: "대시보드",
    contentList: "콘텐츠 목록", 
    analytics: "분석",
    settings: "환경설정",
    newContent: "새 콘텐츠",
    platformAnalysis: "플랫폼 성과 분석",
    detailedAnalysis: "상세 분석",
    analyticsPageTitle: "YouTube 상세 분석",
    redditAnalyticsPageTitle: "Reddit 상세 분석",
    environmentSettings: "환경설정",
    contentManagement: "콘텐츠 관리",
    subtitle: "연동된 플랫폼의 정보를 간략하게 확인하세요",
    detailSubtitle: "YouTube와 Reddit의 핵심 지표를 통합 비교",
    settingsSubtitle: "서비스 환경을 개인화하고 데이터를 안전하게 관리",
    contentSubtitle: "업로드된 콘텐츠를 필터링하고 관리하세요",
    analyticsSubtitle: "상세한 플랫폼 데이터와 인사이트를 확인하세요",
    platformOverview: "연동된 플랫폼",
    logout: "로그아웃",
    recent7DaysTrend: "최근 7일 트렌드",
    views: "조회수",
    likes: "좋아요",
    comments: "댓글",
    upvotes: "업보트",
    engagementRate: "참여율",
    upvoteRatio: "업보트 비율",
    videoPlatform: "동영상 플랫폼",
    communityPlatform: "커뮤니티 플랫폼",
    totalScore: "총 점수",
    last7Days: "최근 7일",
    last30Days: "최근 30일",
    last3Months: "최근 3개월",
    thisYear: "올해",
    customPeriod: "사용자 지정",
    analysisPeriod: "분석 기간",
    connectionManagement: "연동 관리",
    dataExport: "데이터 내보내기",
    connectedPlatforms: "연동된 플랫폼 목록",
    addNewPlatform: "+ 새 플랫폼 연동",
    exportPeriod: "내보낼 기간을 선택하세요",
    exportToCSV: "CSV로 내보내기",
    exportToExcel: "Excel로 내보내기",
    disconnectPlatform: "연동 해제",
    connected: "연결됨",
    selectPeriod: "기간 선택",
    allChannels: "전체채널",
    youtube: "YouTube",
    reddit: "Reddit",
    uploadDate: "업로드 날짜",
    latest: "최신순",
    oldest: "오래된순",
    filterByPlatform: "플랫폼 필터",
    sortBy: "정렬 기준",
    showMore: "더 보기",
    showLess: "접기",
    filters: "필터",
    previous: "이전",
    next: "다음",
    popularVideos: "인기 동영상 순위",
    latestContent: "최신 콘텐츠",
    weeklyActivity: "주간 활동 분석",
    subscribers: "구독자",
    totalViews: "총 조회수",
    totalLikes: "총 좋아요",
    totalComments: "총 댓글",
    totalUpvotes: "총 업보트",
    avgScore: "평균 스코어",
    watchTime: "시청 시간",
    avgEngagement: "평균 참여율",
    ctr: "CTR",
    platform: "플랫폼",
    period: "범위",
    videoRank: "영상",
    kpi: "핵심 지표",
    contentPerformance: "콘텐츠 성과",
    mon: "월",
    tue: "화", 
    wed: "수",
    thu: "목",
    fri: "금",
    sat: "토",
    sun: "일",
    backToDashboard: "대시보드로 돌아가기",
    selectDateRange: "날짜 범위를 선택하세요",
    applyPeriod: "기간 적용",
    to: "~"
  },
  en: {
    brandName: "ContentBoost",
    dashboard: "Dashboard",
    contentList: "Content List",
    analytics: "Analytics",
    settings: "Settings",
    newContent: "New Content",
    platformAnalysis: "Platform Performance Analysis",
    detailedAnalysis: "Detailed Analysis",
    analyticsPageTitle: "YouTube Detailed Analysis",
    redditAnalyticsPageTitle: "Reddit Detailed Analysis",
    environmentSettings: "Environment Settings",
    contentManagement: "Content Management",
    subtitle: "Get a quick overview of your connected platform information",
    detailSubtitle: "Compare key metrics from YouTube and Reddit",
    settingsSubtitle: "Personalize your service environment and manage data securely",
    contentSubtitle: "Filter and manage your uploaded content",
    analyticsSubtitle: "View detailed platform data and insights",
    platformOverview: "Connected Platforms",
    logout: "Logout",
    recent7DaysTrend: "Recent 7 Days Trend",
    views: "Views",
    likes: "Likes",
    comments: "Comments",
    upvotes: "Upvotes",
    engagementRate: "Engagement Rate",
    upvoteRatio: "Upvote Ratio",
    videoPlatform: "Video Platform",
    communityPlatform: "Community Platform",
    totalScore: "Total Score",
    last7Days: "Last 7 Days",
    last30Days: "Last 30 Days",
    last3Months: "Last 3 Months",
    thisYear: "This Year",
    customPeriod: "Custom Period",
    analysisPeriod: "Analysis Period",
    connectionManagement: "Connection Management",
    dataExport: "Data Export",
    connectedPlatforms: "Connected Platform List",
    addNewPlatform: "+ Connect New Platform",
    exportPeriod: "Select period to export",
    exportToCSV: "Export to CSV",
    exportToExcel: "Export to Excel",
    disconnectPlatform: "Disconnect",
    connected: "Connected",
    selectPeriod: "Select Period",
    allChannels: "All Channels",
    youtube: "YouTube",
    reddit: "Reddit",
    uploadDate: "Upload Date",
    latest: "Latest",
    oldest: "Oldest",
    filterByPlatform: "Platform Filter",
    sortBy: "Sort by",
    showMore: "Show More",
    showLess: "Show Less",
    filters: "Filters",
    previous: "Previous",
    next: "Next",
    popularVideos: "Popular Videos Ranking",
    latestContent: "Latest Content",
    weeklyActivity: "Weekly Activity Analysis",
    subscribers: "Subscribers",
    totalViews: "Total Views",
    totalLikes: "Total Likes",
    totalComments: "Total Comments",
    totalUpvotes: "Total Upvotes",
    avgScore: "Average Score",
    watchTime: "Watch Time",
    avgEngagement: "Avg Engagement",
    ctr: "CTR",
    platform: "Platform",
    period: "Period",
    videoRank: "Video",
    kpi: "Key Metrics",
    contentPerformance: "Content Performance",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed", 
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
    backToDashboard: "Back to Dashboard",
    selectDateRange: "Select date range",
    applyPeriod: "Apply Period",
    to: "to"
  }
};

// Mock chart data for 7 days - YouTube와 Reddit에 맞는 데이터
const youtubeChartData = [
  { day: 1, views: 3200, likes: 280 },
  { day: 2, views: 2800, likes: 250 },
  { day: 3, views: 4100, likes: 320 },
  { day: 4, views: 3900, likes: 310 },
  { day: 5, views: 5200, likes: 420 },
  { day: 6, views: 4800, likes: 380 },
  { day: 7, views: 4200, likes: 350 }
];

const redditChartData = [
  { day: 1, upvotes: 280, comments: 45 },
  { day: 2, upvotes: 320, comments: 52 },
  { day: 3, upvotes: 290, comments: 38 },
  { day: 4, upvotes: 350, comments: 61 },
  { day: 5, upvotes: 380, comments: 72 },
  { day: 6, upvotes: 310, comments: 55 },
  { day: 7, upvotes: 390, comments: 68 }
];

// Weekly activity data for detailed analytics - 날짜와 숫자 형태로 수정
const weeklyActivityData = [
  { day: '12/09', views: 10500, likes: 380, comments: 95, date: '2024-12-09' },
  { day: '12/10', views: 8200, likes: 290, comments: 67, date: '2024-12-10' },
  { day: '12/11', views: 12800, likes: 455, comments: 112, date: '2024-12-11' },
  { day: '12/12', views: 9600, likes: 340, comments: 83, date: '2024-12-12' },
  { day: '12/13', views: 15200, likes: 520, comments: 145, date: '2024-12-13' },
  { day: '12/14', views: 18500, likes: 680, comments: 201, date: '2024-12-14' },
  { day: '12/15', views: 14200, likes: 510, comments: 167, date: '2024-12-15' }
];

// Latest content data - 시청수, 좋아요 수 제거
const latestContentData = [
  {
    rank: 1,
    title: "AI로 만드는 숏폼 영상 가이드",
    uploadDate: "2024-12-15",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop"
  },
  {
    rank: 2,
    title: "호기심이 뭔지 쾌락적 카피라이팅",
    uploadDate: "2024-12-14",
    thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop"
  },
  {
    rank: 3,
    title: "소셜미디어 마케팅 전략",
    uploadDate: "2024-12-13",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop"
  },
  {
    rank: 4,
    title: "데이터 분석으로 콘텐츠 성과 개선하기",
    uploadDate: "2024-12-12",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
  {
    rank: 5,
    title: "커뮤니티 참여도를 높이는 5가지 방법",
    uploadDate: "2024-12-11",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
  }
];

// Enhanced platform data with specific metrics for each platform
const platformData = [
  { 
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
      views: { value: "24.5K", label: "조회수", icon: Eye },
      likes: { value: "3.2K", label: "좋아요", icon: Heart },
      engagementRate: { value: "13.2%", label: "참여율", icon: TrendingUp }
    },
    growth: {
      value: "참여율 13.2%",
      period: "지난 7일",
      isPositive: true
    },
    chartData: youtubeChartData,
    chartMetrics: {
      primary: { key: "views", label: "조회수", color: "#dc2626" },
      secondary: { key: "likes", label: "좋아요", color: "#7c3aed" }
    }
  },
  { 
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
    chartData: redditChartData,
    chartMetrics: {
      primary: { key: "upvotes", label: "업보트", color: "#ea580c" },
      secondary: { key: "comments", label: "댓글", color: "#16a34a" }
    }
  }
];


// Glass Card Component
function GlassCard({ 
  children, 
  className = "",
  hover = true 
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// 개선된 플랫폼 카드 - 텍스트 크기 증가, 총점수 제거

// Settings Components


// 개선된 분석 전용 필터 사이드바 - 날짜 범위 선택 기능 추가
function AnalyticsFilterSidebar({ 
  t, 
  currentView, 
  setCurrentView, 
  selectedPlatform, 
  setSelectedPlatform, 
  selectedPeriod, 
  setSelectedPeriod,
  isCalendarVisible,
  setIsCalendarVisible,
  date_range,
  set_date_range,
  tempPeriodLabel,
  setTempPeriodLabel
}) {
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const periodDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
        setPeriodDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const periodOptions = [
    { id: 'last7Days', label: t.last7Days },
    { id: 'last30Days', label: t.last30Days },
    { id: 'last3Months', label: t.last3Months },
    { id: 'thisYear', label: t.thisYear },
    { id: 'custom', label: t.customPeriod }
  ];

  const getSelectedPeriodLabel = () => {
    if (selectedPeriod === 'custom' && tempPeriodLabel) {
      return tempPeriodLabel;
    }
    const option = periodOptions.find(opt => opt.id === selectedPeriod);
    return option ? option.label : t.last30Days;
  };

  const handlePeriodSelect = (periodId) => {
    setSelectedPeriod(periodId);
    setPeriodDropdownOpen(false);
    
    if (periodId === 'custom') {
      setIsCalendarVisible(true);
    } else {
      setTempPeriodLabel('');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // These handlers will be passed from parent component

  return (
    <div className="w-64 h-full flex flex-col relative z-10 flex-shrink-0">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border-r border-white/30 dark:border-white/10 h-full flex flex-col shadow-xl p-6">
        {/* Header - 로고만 표시 */}
        <div className="pb-6 border-b border-gray-200/40 dark:border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-semibold">AI</span>
            </div>
            <span className="text-xl font-light text-gray-800 dark:text-white">{t.brandName}</span>
          </div>
        </div>

        {/* 플랫폼 선택 */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {t.platform}
          </h3>
          <div className="space-y-2">
            {[
              { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-red-600' },
              { id: 'reddit', label: 'Reddit', icon: MessageSquare, color: 'text-orange-600' }
            ].map((platform) => {
              const Icon = platform.icon;
              return (
                <motion.button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedPlatform === platform.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${selectedPlatform === platform.id ? 'text-white' : platform.color}`} />
                  {platform.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 분석 기간 - 조건부 렌더링 */}
        <div className="mb-8 flex-1">
          {!isCalendarVisible ? (
            // 필터 목록 표시
            <>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t.analysisPeriod}
              </h3>
              
              <div className="relative" ref={periodDropdownRef}>
                <motion.button
                  onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {getSelectedPeriodLabel()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${periodDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* 드롭다운 메뉴 */}
                <AnimatePresence>
                  {periodDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="absolute top-full left-0 right-0 mt-2 backdrop-blur-2xl bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 rounded-xl shadow-2xl p-2 z-50"
                    >
                      {periodOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handlePeriodSelect(option.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                            selectedPeriod === option.id
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20'
                          }`}
                        >
                          <span className="text-sm font-medium">{option.label}</span>
                          {selectedPeriod === option.id && (
                            <Check className="w-4 h-4" />
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            // 달력 표시 상태 - 실제 달력은 부모에서 렌더링
            <div className="w-full relative">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t.selectDateRange}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                날짜 범위를 선택하세요
              </p>
            </div>
          )}
        </div>

        {/* 뒤로가기 버튼 - 최하단에 위치 */}
        <div className="pt-6 border-t border-gray-200/40 dark:border-white/10">
          <motion.button
            onClick={() => setCurrentView('dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white rounded-xl transition-all duration-200 text-left font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToDashboard}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// 수정된 상세 분석 뷰 - 플랫폼별 KPI 카드, 최신 콘텐츠, 수정된 그래프
function DetailedAnalyticsView({ 
  t, 
  currentView, 
  setCurrentView 
}) {
  const [selectedPlatform, setSelectedPlatform] = useState('youtube'); // 플랫폼 선택 가능하도록 변경
  const [selectedPeriod, setSelectedPeriod] = useState('last30Days');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [date_range, set_date_range] = useState({
    from: undefined,
    to: undefined
  });
  const [tempPeriodLabel, setTempPeriodLabel] = useState('');
  const { isDarkMode, setIsDarkMode, language, setLanguage } = usePageStore();

  // Calendar handlers
  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleApplyDateRange = (range) => {
    if (range && range.from && range.to) {
      const fromStr = formatDate(range.from);
      const toStr = formatDate(range.to);
      setTempPeriodLabel(`${fromStr} ${t.to} ${toStr}`);
      set_date_range(range);
    }
    setIsCalendarVisible(false);
  };

  const handleCalendarCancel = () => {
    setIsCalendarVisible(false);
  };

  const handleCalendarRangeSelect = (range) => {
    if (range) {
      set_date_range(range);
    }
  };

  // 플랫폼별 KPI 데이터
  const getKpiData = () => {
    if (selectedPlatform === 'youtube') {
      return [
        {
          icon: Eye,
          label: t.totalViews,
          value: "2.4M",
          change: "+12.3%",
          isPositive: true,
          bgColor: "bg-blue-50/80 dark:bg-blue-950/20",
          iconBg: "bg-blue-100 dark:bg-blue-900/30"
        },
        {
          icon: Heart,
          label: t.totalLikes,
          value: "156K",
          change: "+8.7%",
          isPositive: true,
          bgColor: "bg-red-50/80 dark:bg-red-950/20",
          iconBg: "bg-red-100 dark:bg-red-900/30"
        },
        {
          icon: MessageSquare,
          label: t.totalComments,
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
          label: t.totalUpvotes,
          value: "89.2K",
          change: "+18.4%",
          isPositive: true,
          bgColor: "bg-orange-50/80 dark:bg-orange-950/20",
          iconBg: "bg-orange-100 dark:bg-orange-900/30"
        },
        {
          icon: MessageSquare,
          label: t.totalComments,
          value: "23.1K",
          change: "+9.2%",
          isPositive: true,
          bgColor: "bg-green-50/80 dark:bg-green-950/20",
          iconBg: "bg-green-100 dark:bg-green-900/30"
        },
        {
          icon: Star,
          label: t.avgScore,
          value: "847",
          change: "+5.6%",
          isPositive: true,
          bgColor: "bg-purple-50/80 dark:bg-purple-950/20",
          iconBg: "bg-purple-100 dark:bg-purple-900/30"
        }
      ];
    }
  };

  // Custom Tooltip for Weekly Activity Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/30 dark:border-gray-600/30 rounded-xl p-4 shadow-xl">
          <p className="font-medium text-gray-800 dark:text-white mb-2">{data.date}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600 dark:text-blue-400">
              {selectedPlatform === 'youtube' ? '조회수' : '업보트'}: {data.views.toLocaleString()}
            </p>
            <p className="text-red-600 dark:text-red-400">
              좋아요: {data.likes.toLocaleString()}
            </p>
            <p className="text-green-600 dark:text-green-400">
              댓글: {data.comments.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      {/* Analytics Filter Sidebar */}
      <AnalyticsFilterSidebar 
        t={t} 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        isCalendarVisible={isCalendarVisible}
        setIsCalendarVisible={setIsCalendarVisible}
        date_range={date_range}
        set_date_range={set_date_range}
        tempPeriodLabel={tempPeriodLabel}
        setTempPeriodLabel={setTempPeriodLabel}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-gray-200/40 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-2">
                {selectedPlatform === 'youtube' ? t.analyticsPageTitle : t.redditAnalyticsPageTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                최근 30일 데이터
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <motion.button
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
              >
                <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setIsDarkMode(!isDarkMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>

              {/* Notification */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 relative"
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* KPI Cards - 플랫폼별 3개 카드 */}
            <div className="grid grid-cols-3 gap-6">
              {getKpiData().map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`${kpi.bgColor} border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        kpi.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${kpi.isPositive ? '' : 'rotate-180'}`} />
                        {kpi.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.label}</p>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-white">{kpi.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Row - Charts */}
            <div className="grid grid-cols-2 gap-8">
              {/* Latest Content - 세로로 길게, 시청수/좋아요 수 제거 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl h-96">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{t.latestContent}</h3>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-80">
                    {latestContentData.map((content, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/20 dark:bg-white/5 rounded-xl">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                            {content.rank}
                          </div>
                        </div>
                        
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          <img 
                            src={content.thumbnail} 
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate mb-1">
                            {content.title}
                          </h4>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {content.uploadDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Weekly Activity Analysis - 수정된 그래프 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl h-96">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{t.weeklyActivity}</h3>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyActivityData} margin={{ top: 5, right: 5, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.7 }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.7 }}
                          tickFormatter={(value) => {
                            if (value >= 1000) {
                              return (value / 1000).toFixed(0) + 'K';
                            }
                            return value;
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          fill="url(#viewsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Calendar Component - Rendered at root level to avoid stacking context issues */}
      {isCalendarVisible && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/20 dark:bg-black/40" 
          onClick={handleCalendarCancel}
        >
          <div 
            className="absolute left-64 top-32"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <CalendarComponent
                mode="range"
                selected_range={date_range}
                on_range_select={handleCalendarRangeSelect}
                on_apply={handleApplyDateRange}
                on_cancel={handleCalendarCancel}
                className="w-full"
                show_actions={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar Component - 화면 전체 높이로 늘림
function Sidebar({ t, currentView, setCurrentView }) {
  const { setCurrentPage } = usePageStore();

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: BarChart3 },
    { id: 'contentList', label: t.contentList, icon: Calendar },
    { id: 'contentLaunch', label: 'AI 콘텐츠 론칭', icon: Zap },
    { id: 'analytics', label: t.analytics, icon: PieChart },
    { id: 'settings', label: t.settings, icon: Settings }
  ];

  const goBackToLanding = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="w-64 h-full flex flex-col relative z-10 flex-shrink-0">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border-r border-white/30 dark:border-white/10 h-full flex flex-col shadow-xl p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200/40 dark:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <span className="text-xl font-light text-gray-800 dark:text-white">{t.brandName}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-gray-800 dark:text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gray-200/40 dark:border-white/10">
          <motion.button
            onClick={goBackToLanding}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white rounded-xl transition-all duration-200 text-left font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.logout}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Header Component - 콘텐츠 목록 필터 제거
function DashboardHeader({ 
  t, 
  currentView
}) {
  const { isDarkMode, setIsDarkMode, language, setLanguage } = usePageStore();

  const getHeaderInfo = () => {
    switch (currentView) {
      case 'dashboard':
        return { 
          title: t.platformAnalysis, 
          subtitle: t.subtitle 
        };
      case 'analytics':
        return { 
          title: t.detailedAnalysis, 
          subtitle: t.analyticsSubtitle 
        };
      case 'settings':
        return { 
          title: t.environmentSettings, 
          subtitle: t.settingsSubtitle 
        };
      case 'contentList':
        return {
          title: t.contentManagement,
          subtitle: t.contentSubtitle
        };
      case 'contentLaunch':
        return {
          title: 'AI 콘텐츠 론칭',
          subtitle: 'AI가 생성한 미디어 콘텐츠를 검토하고 플랫폼에 론칭하세요'
        };
      default:
        return { 
          title: t.platformAnalysis, 
          subtitle: t.subtitle 
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <header className="relative z-10 p-6">
      <GlassCard hover={false}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-800 dark:text-white mb-1">{headerInfo.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{headerInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <motion.button
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
            >
              <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setIsDarkMode(!isDarkMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              )}
            </motion.button>

            {/* Notification */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 relative"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </header>
  );
}

// Main Dashboard View - 개선된 플랫폼 카드 사용
function MainDashboardView({ t }) {
  return (
    <div className="p-6 relative z-10">
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {platformData.map((platform, index) => (
          <EnhancedPlatformCard 
            key={index} 
            platform={platform} 
            index={index} 
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// Settings View
function SettingsView({ t }) {
  return (
    <div className="p-6 space-y-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConnectionManagementCard t={t} platformData={platformData} />
        <DataExportCard t={t} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { language, isDarkMode } = usePageStore();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const t = dashboardTranslations[language] || dashboardTranslations.ko;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <MainDashboardView t={t} />;
      case 'analytics':
        return <DetailedAnalyticsView t={t} currentView={currentView} setCurrentView={setCurrentView} />;
      case 'settings':
        return <SettingsView t={t} />;
      case 'contentList':
        return (
          <ContentListView 
            t={t} 
            selectedPlatform={selectedPlatform} 
            setSelectedPlatform={setSelectedPlatform}
            sortOrder={sortOrder} 
            setSortOrder={setSortOrder}
          />
        );
      case 'contentLaunch':
        return <ContentLaunchPage dark_mode={isDarkMode} />;
      default:
        return <MainDashboardView t={t} />;
    }
  };

  // 분석 페이지일 때는 완전히 다른 레이아웃 사용
  if (currentView === 'analytics') {
    return renderCurrentView();
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex overflow-hidden">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />
      
      <Sidebar t={t} currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader 
          t={t} 
          currentView={currentView} 
        />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}