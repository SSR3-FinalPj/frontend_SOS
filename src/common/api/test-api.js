/**
 * 🧪 TEST API - 영상 관련 테스트 목업 API
 * 
 * video-api-wrapper에서 사용하는 테스트 API 함수들만 포함
 * 
 * @author Claude Code Assistant
 * @version 1.2.0
 * @created 2025-01-11
 */

import { generateTestVideoData } from '@/common/utils/test-data-generator';

// 🎛️ 테스트 API 설정
const TEST_CONFIG = {
  delays: {
    upload: 1500,
    videoStream: 800,
    platformUpload: 2000
  },
  
  failureRates: {
    upload: 0.05,
    videoStream: 0.02,
    platformUpload: 0.1
  },
  
  testData: {
    resultIdCounter: 1000,
    jobIdCounter: 5000
  }
};

/**
 * 지연 시간 시뮬레이션
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 랜덤 실패 시뮬레이션
 */
const simulateRandomFailure = (failureRate, errorMessage) => {
  if (Math.random() < failureRate) {
    throw new Error(`🧪 [테스트 실패 시뮬레이션] ${errorMessage}`);
  }
};

/**
 * 고유 ID 생성
 */
const generateUniqueId = (prefix = 'test') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
};

// ============================================================================
// 🚀 CONTENT MANAGEMENT API (테스트 목업)
// ============================================================================

/**
 * 🧪 테스트: 이미지를 S3에 업로드하고 백엔드에 알림
 */
export async function uploadImageToS3Complete(file, locationCode, promptText = "", platform = "YOUTUBE") {
  console.log('🧪 [TEST API] S3 업로드 시뮬레이션 시작:', { 
    fileName: file?.name, 
    locationCode, 
    promptText, 
    platform 
  });
  
  if (!file || !locationCode) {
    throw new Error('🧪 [TEST API] 파일과 위치 코드가 필요합니다.');
  }
  
  await delay(TEST_CONFIG.delays.upload);
  
  simulateRandomFailure(
    TEST_CONFIG.failureRates.upload, 
    'S3 업로드 네트워크 오류'
  );
  
  const jobId = ++TEST_CONFIG.testData.jobIdCounter;
  const s3Key = `test-uploads/${platform.toLowerCase()}/${locationCode}/${Date.now()}.jpg`;
  
  const result = {
    success: true,
    s3Key,
    jobId,
    confirmResult: {
      jobId,
      message: `🧪 [테스트 모드] ${platform} 콘텐츠 생성 요청이 접수되었습니다.`,
      platform,
      locationCode,
      promptText,
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('🧪 [TEST API] S3 업로드 시뮬레이션 완료:', result);
  return result;
}

/**
 * 🧪 테스트: 영상 스트리밍 URL 요청
 */
export async function requestVideoStream(resultId) {
  console.log('🧪 [TEST API] 영상 스트리밍 시뮬레이션 시작:', { resultId });
  
  if (!resultId) {
    throw new Error('🧪 [TEST API] resultId가 필요합니다.');
  }
  
  await delay(TEST_CONFIG.delays.videoStream);
  
  simulateRandomFailure(
    TEST_CONFIG.failureRates.videoStream,
    '영상 스트리밍 서버 오류'
  );
  
  // 테스트용 비디오 Blob 생성
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`🧪 테스트 영상`, canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText(`Result ID: ${resultId}`, canvas.width / 2, canvas.height / 2 + 20);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const videoUrl = URL.createObjectURL(blob);
      
      const result = {
        success: true,
        videoUrl,
        resultId,
        duration: 1000,
        size: blob.size,
        format: 'webm',
        testMode: true,
        message: '🧪 테스트 모드에서 생성된 목업 영상입니다.'
      };
      
      console.log('🧪 [TEST API] 영상 스트리밍 시뮬레이션 완료:', result);
      resolve(result);
    }, 'image/png');
  });
}

/**
 * 🧪 테스트: YouTube 업로드 시뮬레이션
 */
export async function uploadToYoutube(resultId, youtubeData) {
  console.log('🧪 [TEST API] YouTube 업로드 시뮬레이션 시작:', { resultId, youtubeData });
  
  if (!resultId) {
    throw new Error('🧪 [TEST API] resultId가 필요합니다.');
  }
  
  await delay(TEST_CONFIG.delays.platformUpload);
  
  simulateRandomFailure(
    TEST_CONFIG.failureRates.platformUpload,
    'YouTube API 업로드 실패'
  );
  
  const videoId = `test_yt_${generateUniqueId('video')}`;
  const videoUrl = `https://youtube.com/watch?v=${videoId}`;
  
  const result = {
    success: true,
    videoId,
    videoUrl,
    resultId,
    title: youtubeData.title || '테스트 영상',
    description: youtubeData.description || '🧪 테스트 모드에서 업로드된 영상입니다.',
    tags: youtubeData.tags || ['test', 'demo'],
    privacy: youtubeData.privacy || 'private',
    uploadTime: new Date().toISOString(),
    testMode: true,
    message: '🧪 YouTube 업로드가 성공적으로 시뮬레이션되었습니다.'
  };
  
  console.log('🧪 [TEST API] YouTube 업로드 시뮬레이션 완료:', result);
  return result;
}

/**
 * 🧪 테스트: Reddit 업로드 시뮬레이션
 */
export async function uploadToReddit(resultId, redditData) {
  console.log('🧪 [TEST API] Reddit 업로드 시뮬레이션 시작:', { resultId, redditData });
  
  if (!resultId) {
    throw new Error('🧪 [TEST API] resultId가 필요합니다.');
  }
  
  await delay(TEST_CONFIG.delays.platformUpload);
  
  simulateRandomFailure(
    TEST_CONFIG.failureRates.platformUpload,
    'Reddit API 업로드 실패'
  );
  
  const postId = generateUniqueId('reddit');
  const subreddit = redditData.subreddit || 'test';
  const postUrl = `https://reddit.com/r/${subreddit}/comments/${postId}/`;
  
  const result = {
    success: true,
    postId,
    postUrl,
    resultId,
    title: redditData.title || '테스트 게시물',
    subreddit,
    kind: redditData.kind || 'image',
    uploadTime: new Date().toISOString(),
    testMode: true,
    message: '🧪 Reddit 업로드가 성공적으로 시뮬레이션되었습니다.'
  };
  
  console.log('🧪 [TEST API] Reddit 업로드 시뮬레이션 완료:', result);
  return result;
}

/**
 * 🧪 테스트: 영상 재생성 시뮬레이션
 */
export async function regenerateVideo(videoId, prompt) {
  console.log('🧪 [TEST API] 영상 재생성 시뮬레이션 시작:', { videoId, prompt });
  
  if (!videoId) {
    throw new Error('🧪 [TEST API] videoId가 필요합니다.');
  }
  
  if (!prompt) {
    throw new Error('🧪 [TEST API] prompt가 필요합니다.');
  }
  
  await delay(TEST_CONFIG.delays.platformUpload + 1000);
  
  simulateRandomFailure(0.05, '영상 재생성 서버 오류');
  
  const newResultId = ++TEST_CONFIG.testData.resultIdCounter;
  const jobId = ++TEST_CONFIG.testData.jobIdCounter;
  
  const result = {
    success: true,
    originalVideoId: videoId,
    newResultId,
    jobId,
    newPrompt: prompt,
    estimatedTime: '3-5분',
    status: 'PROCESSING',
    message: '🧪 영상 재생성이 시뮬레이션으로 시작되었습니다.',
    regeneratedAt: new Date().toISOString(),
    testMode: true
  };
  
  console.log('🧪 [TEST API] 영상 재생성 시뮬레이션 완료:', result);
  return result;
}

// ============================================================================
// 🎯 테스트 API 설정 및 제어
// ============================================================================

/**
 * 테스트 API 설정 업데이트
 */
export function updateTestConfig(newConfig) {
  Object.assign(TEST_CONFIG, newConfig);
  console.log('🧪 [TEST API] 설정 업데이트:', TEST_CONFIG);
}

/**
 * 현재 테스트 API 설정 조회
 */
export function getTestConfig() {
  return { ...TEST_CONFIG };
}

/**
 * 테스트 API 초기화
 */
export function resetTestApi() {
  TEST_CONFIG.testData.resultIdCounter = 1000;
  TEST_CONFIG.testData.jobIdCounter = 5000;
  console.log('🧪 [TEST API] 초기화 완료');
}

// 개발 환경에서 전역 객체로 노출
if (import.meta.env.DEV) {
  window.testApi = {
    updateTestConfig,
    getTestConfig,
    resetTestApi,
    // 직접 테스트 함수들
    testUpload: uploadImageToS3Complete,
    testStream: requestVideoStream,
    testYoutubeUpload: uploadToYoutube,
    testRedditUpload: uploadToReddit
  };
  
  console.log('🧪 [TEST API] 개발자 도구: window.testApi 사용 가능');
}