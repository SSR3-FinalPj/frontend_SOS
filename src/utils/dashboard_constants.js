/**
 * Dashboard 관련 상수와 데이터 정의
 */


// Mock chart data for 7 days - YouTube와 Reddit에 맞는 데이터
export const youtube_chart_data = [
  { day: 1, views: 3200, likes: 280 },
  { day: 2, views: 2800, likes: 250 },
  { day: 3, views: 4100, likes: 320 },
  { day: 4, views: 3900, likes: 310 },
  { day: 5, views: 5200, likes: 420 },
  { day: 6, views: 4800, likes: 380 },
  { day: 7, views: 4200, likes: 350 }
];

export const reddit_chart_data = [
  { day: 1, upvotes: 280, comments: 45 },
  { day: 2, upvotes: 320, comments: 52 },
  { day: 3, upvotes: 290, comments: 38 },
  { day: 4, upvotes: 350, comments: 61 },
  { day: 5, upvotes: 380, comments: 72 },
  { day: 6, upvotes: 310, comments: 55 },
  { day: 7, upvotes: 390, comments: 68 }
];

// Weekly activity data for detailed analytics - 날짜와 숫자 형태로 수정
export const weekly_activity_data = [
  { day: '12/09', views: 10500, likes: 380, comments: 95, date: '2024-12-09' },
  { day: '12/10', views: 8200, likes: 290, comments: 67, date: '2024-12-10' },
  { day: '12/11', views: 12800, likes: 455, comments: 112, date: '2024-12-11' },
  { day: '12/12', views: 9600, likes: 340, comments: 83, date: '2024-12-12' },
  { day: '12/13', views: 15200, likes: 520, comments: 145, date: '2024-12-13' },
  { day: '12/14', views: 18500, likes: 680, comments: 201, date: '2024-12-14' },
  { day: '12/15', views: 14200, likes: 510, comments: 167, date: '2024-12-15' }
];

// Latest content data - 시청수, 좋아요 수 제거
export const latest_content_data = [
  {
    rank: 1,
    title: "AI로 만드는 숏폼 영상 가이드",
    uploadDate: "2024-12-15",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    views: 18500,
    likes: 680,
    comments: 201
  },
  {
    rank: 2,
    title: "호기심이 뭔지 쾌락적 카피라이팅",
    uploadDate: "2024-12-14",
    thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop",
    views: 15200,
    likes: 520,
    comments: 145
  },
  {
    rank: 3,
    title: "소셜미디어 마케팅 전략",
    uploadDate: "2024-12-13",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    views: 12800,
    likes: 455,
    comments: 112
  },
  {
    rank: 4,
    title: "데이터 분석으로 콘텐츠 성과 개선하기",
    uploadDate: "2024-12-12",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    views: 9600,
    likes: 340,
    comments: 83
  },
  {
    rank: 5,
    title: "커뮤니티 참여도를 높이는 5가지 방법",
    uploadDate: "2024-12-11",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    views: 8200,
    likes: 290,
    comments: 67
  }
];

// Period options for analytics filters
export const period_options = [
  { id: 'last7Days', label: 'last7Days' },
  { id: 'last30Days', label: 'last30Days' },
  //{ id: 'last3Months', label: 'last3Months' },
  //{ id: 'thisYear', label: 'thisYear' },
  { id: 'custom', label: 'custom' }
];

export const audience_demo_data = [
  { age: "18-24", male: 40, female: 35 },
  { age: "25-34", male: 50, female: 45 },
  { age: "35-44", male: 30, female: 28 },
  { age: "45-54", male: 20, female: 18 },
  { age: "55+", male: 10, female: 12 }
];


export const traffic_source_data = [
  { name: "검색", value: 400 },
  { name: "추천 영상", value: 300 },
  { name: "외부 유입", value: 200 },
  { name: "기타", value: 100 }
];