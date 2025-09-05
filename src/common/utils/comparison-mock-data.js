/**
 * 비교분석용 Mock 데이터
 * IntegratedAnalyticsView에서 사용하는 크로스 플랫폼 비교 데이터
 */

export const mockCrossPlatformContent = [
  {
    id: 'cross_1',
    title: 'AI 기술의 미래와 현실',
    description: '동일한 AI 콘텐츠를 YouTube와 Reddit에 업로드하여 플랫폼별 성과 비교',
    youtube: {
      id: 'yt1',
      title: 'AI 기술의 미래와 현실',
      videoId: 'abc123',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 24500,
      likes: 1200,
      comments: 234,
      engagement: 5.2,
      publishedAt: '2024-01-15',
      duration: '12:34',
      platform: 'youtube'
    },
    reddit: {
      id: 'rd1',
      title: 'AI 기술의 미래와 현실',
      postId: 'r/technology_post1',
      subreddit: 'r/technology',
      upvotes: 3100,
      comments: 156,
      score: 258,
      engagement: 8.3,
      publishedAt: '2024-01-15',
      author: 'tech_creator',
      platform: 'reddit'
    }
  },
  {
    id: 'cross_2',
    title: '2024 최신 프로그래밍 트렌드',
    description: '프로그래밍 트렌드 동영상을 두 플랫폼에 동시 업로드한 성과 분석',
    youtube: {
      id: 'yt2',
      title: '2024 최신 프로그래밍 트렌드',
      videoId: 'def456',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 18200,
      likes: 892,
      comments: 145,
      engagement: 6.1,
      publishedAt: '2024-02-01',
      duration: '8:45',
      platform: 'youtube'
    },
    reddit: {
      id: 'rd2',
      title: '2024 최신 프로그래밍 트렌드',
      postId: 'r/programming_post2',
      subreddit: 'r/programming',
      upvotes: 2400,
      comments: 89,
      score: 195,
      engagement: 7.8,
      publishedAt: '2024-02-01',
      author: 'dev_creator',
      platform: 'reddit'
    }
  },
  {
    id: 'cross_3',
    title: '개발자 워크플로우 최적화 가이드',
    description: '워크플로우 최적화 콘텐츠의 플랫폼별 반응 차이 분석',
    youtube: {
      id: 'yt3',
      title: '개발자 워크플로우 최적화 가이드',
      videoId: 'ghi789',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 31000,
      likes: 1850,
      comments: 267,
      engagement: 7.3,
      publishedAt: '2024-01-28',
      duration: '15:22',
      platform: 'youtube'
    },
    reddit: {
      id: 'rd3',
      title: '개발자 워크플로우 최적화 가이드',
      postId: 'r/webdev_post3',
      subreddit: 'r/webdev',
      upvotes: 4200,
      comments: 198,
      score: 342,
      engagement: 9.1,
      publishedAt: '2024-01-28',
      author: 'workflow_expert',
      platform: 'reddit'
    }
  },
  {
    id: 'cross_4',
    title: 'React 훅 완벽 마스터하기',
    description: 'React 훅 튜토리얼의 YouTube vs Reddit 성과 비교',
    youtube: {
      id: 'yt4',
      title: 'React 훅 완벽 마스터하기',
      videoId: 'jkl012',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 42300,
      likes: 2100,
      comments: 189,
      engagement: 8.1,
      publishedAt: '2024-02-15',
      duration: '20:10',
      platform: 'youtube'
    },
    reddit: {
      id: 'rd4',
      title: 'React 훅 완벽 마스터하기',
      postId: 'r/javascript_post4',
      subreddit: 'r/javascript',
      upvotes: 1850,
      comments: 245,
      score: 178,
      engagement: 6.4,
      publishedAt: '2024-02-15',
      author: 'react_master',
      platform: 'reddit'
    }
  },
  {
    id: 'cross_5',
    title: '웹 성능 최적화 실전 가이드',
    description: '성능 최적화 콘텐츠의 플랫폼별 도달률과 참여도 분석',
    youtube: {
      id: 'yt5',
      title: '웹 성능 최적화 실전 가이드',
      videoId: 'xyz789',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: 15600,
      likes: 720,
      comments: 98,
      engagement: 5.8,
      publishedAt: '2024-03-01',
      duration: '18:45',
      platform: 'youtube'
    },
    reddit: {
      id: 'rd5',
      title: '웹 성능 최적화 실전 가이드',
      postId: 'r/webdev_performance',
      subreddit: 'r/webdev',
      upvotes: 2800,
      comments: 134,
      score: 224,
      engagement: 9.5,
      publishedAt: '2024-03-01',
      author: 'perf_optimizer',
      platform: 'reddit'
    }
  }
];