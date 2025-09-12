/**
 * 🧪 TEST HELPERS - 테스트 모드 전용 유틸리티 함수들
 * 
 * ⚠️ 주의: 이 파일은 테스트 목적으로만 사용됩니다.
 * 프로덕션 환경에서 테스트 기능을 제거할 때 이 파일을 삭제하면
 * 모든 테스트 관련 코드가 정리됩니다.
 * 
 * @author Claude Code Assistant
 * @version 1.0.0
 * @created 2025-01-11
 */

import { use_content_launch } from '@/features/content-management/logic/use-content-launch';
import { generateReactKey, generateTempVideoId } from '@/common/utils/unique-id';
import { useNotificationStore } from '@/features/real-time-notifications/logic/notification-store';

/**
 * 🧪 테스트 모드 활성화 여부 확인
 * @returns {boolean} 테스트 모드 활성화 여부
 */
export const isTestModeEnabled = () => {
  return process.env.NODE_ENV === 'development' || process.env.REACT_APP_TEST_MODE === 'true';
};

/**
 * 🧪 테스트용 S3 업로드 목업 함수
 * @param {File} file - 업로드할 파일
 * @param {string} locationId - 위치 ID (POI001 등)
 * @param {string} prompt - 프롬프트 텍스트
 * @param {string} platform - 플랫폼 ('youtube' | 'reddit')
 * @returns {Promise<Object>} 목업 업로드 결과
 */
export const mockS3Upload = async (file, locationId, prompt, platform) => {
  // 실제 업로드 시간 시뮬레이션 (1-2초)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  return {
    jobId: `test_job_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    s3Key: `test-uploads/${platform}/${locationId}/${Date.now()}.jpg`,
    success: true,
    message: `테스트 모드: ${platform.toUpperCase()} ${platform === 'youtube' ? '영상' : '이미지'} 생성 요청 완료`
  };
};

/**
 * 🧪 테스트용 영상 재생성 목업 함수
 * @param {string} videoId - 영상 ID
 * @param {string} prompt - 재생성 프롬프트
 * @returns {Promise<Object>} 목업 재생성 결과
 */
export const mockRegenerateVideo = async (videoId, prompt) => {
  // 재생성 시간 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  return {
    success: true,
    jobId: `regen_job_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    message: '테스트 모드: 영상 재생성 요청 완료'
  };
};

/**
 * 🧪 테스트 모드에서 영상 상태 업데이트
 * use_content_launch 스토어에 update_video_status 함수가 없으므로 직접 구현
 * @param {string} temp_id - 임시 영상 ID
 * @param {string} status - 변경할 상태 ('completed', 'processing', 'failed' 등)
 */
export const updateVideoStatusForTest = (temp_id, status) => {
  const store = use_content_launch.getState();
  const currentVideos = store.pending_videos;
  
  // 해당 temp_id를 가진 영상 찾아서 상태 업데이트
  const updatedVideos = currentVideos.map(video => {
    if (video.temp_id === temp_id) {
      
      return { ...video, status };
    }
    return video;
  });
  
  // 스토어 업데이트
  use_content_launch.setState({ pending_videos: updatedVideos });
  
  // 폴더 목록도 갱신하여 UI 반영
  setTimeout(() => {
    store.fetch_folders();
  }, 100);
};

/**
 * 🧪 표준화된 테스트 영상 데이터 생성
 * @param {string} platform - 플랫폼 ('youtube' | 'reddit')
 * @param {Object} location - 위치 정보 객체
 * @param {Object} options - 추가 옵션
 * @returns {Object} 표준화된 테스트 영상 데이터
 */
export const createTestVideoData = (platform = 'youtube', location = null, options = {}) => {
  const defaultLocation = {
    poi_id: "POI001",
    name: "강남역",
    address: "서울특별시 강남구",
    district: "강남구"
  };
  
  const finalLocation = location || defaultLocation;
  // 🧪 TEST-ONLY: 숫자 기반 temp_id 생성으로 변경 (트리 검증 통과)
  const tempId = generateTempVideoId();
  
  return {
    temp_id: tempId,
    title: `${finalLocation.name} AI ${platform === 'youtube' ? '영상' : '이미지'}`,
    poi_id: finalLocation.poi_id,
    location_id: finalLocation.poi_id, // 하위 호환성
    location_name: finalLocation.name,
    image_url: options.imageUrl || '/test-placeholder-image.jpg',
    thumbnail: options.thumbnail || '/test-placeholder-image.jpg',
    user_request: options.prompt || `🧪 테스트 모드로 생성된 ${platform} 콘텐츠`,
    prompt: options.prompt || `🧪 테스트 모드로 생성된 ${platform} 콘텐츠`,
    platform: platform,
    status: options.status || 'completed', // 테스트에서는 기본적으로 완료 상태
    version: options.version || '1.0',
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    creation_date: new Date().toISOString().split('T')[0],
    ...options.additionalFields
  };
};

/**
 * 🧪 테스트용 위치 데이터 생성
 * @param {string} poiId - POI ID (예: "POI001")
 * @param {string} name - 위치명 (예: "강남역")
 * @returns {Object} 테스트용 위치 객체
 */
export const createTestLocation = (poiId = "POI001", name = "강남역") => {
  return {
    poi_id: poiId,
    name: name,
    address: `서울특별시 ${name.includes('구') ? name : '강남구'}`,
    district: name.includes('구') ? name : '강남구',
    coordinates: { lat: 37.498095, lng: 127.027610 }
  };
};

/**
 * 🧪 테스트 데이터 정리 함수
 * 개발 중 축적된 테스트 데이터를 정리
 */
export const cleanupTestData = () => {
  const store = use_content_launch.getState();
  
  // 🧪 TEST-ONLY: 테스트로 생성된 영상들 필터링 (타입 안전 검사)
  const cleanedVideos = store.pending_videos.filter(video => {
    const isTestVideo = video.title?.includes('🧪') || 
                       video.title?.toLowerCase().includes('test') ||
                       (typeof video.temp_id === 'string' && video.temp_id.includes('test_')) ||
                       (typeof video.temp_id === 'number' && video.temp_id > 1700000000000); // 타임스탬프 기반 숫자 ID 감지
    return !isTestVideo;
  });
  
  use_content_launch.setState({ pending_videos: cleanedVideos });
  
  // UI 갱신
  store.fetch_folders();
  
  
};

/**
 * 🧪 테스트 환경 정보 출력
 */
export const printTestEnvironmentInfo = () => {
  console.group('🧪 TEST ENVIRONMENT INFO');
  
  console.groupEnd();
};

/**
 * 🧪 TEST-ONLY: 테스트 모드에서 미디어 생성 처리
 * 실제 API 대신 목업 처리 및 즉시 완료 상태 전환
 * @param {File} uploaded_file - 업로드 파일
 * @param {Object} selected_location - 선택된 위치
 * @param {string} prompt_text - 프롬프트 텍스트  
 * @param {string} selectedPlatform - 플랫폼 ('youtube' | 'reddit')
 * @param {string} video_temp_id - 영상 임시 ID
 * @returns {Promise<Object>} 목업 결과
 */
export const processTestMediaRequest = async (uploaded_file, selected_location, prompt_text, selectedPlatform, video_temp_id) => {
  // 목업 API 호출
  const uploadResult = await mockS3Upload(
    uploaded_file,
    selected_location.poi_id,
    prompt_text,
    selectedPlatform
  );
  
  // 즉시 완료 상태로 전환
  updateVideoStatusForTest(video_temp_id, 'completed');
  
  // 성공 알림
  useNotificationStore.getState().add_notification({
    type: 'success',
    message: `🧪 ${uploadResult.message} - 즉시 완료 처리됨`,
    data: { 
      platform: selectedPlatform,
      temp_id: video_temp_id,
      testMode: true,
      status: 'completed'
    }
  });
  
  return uploadResult;
};

/**
 * 🧪 TEST-ONLY: 테스트 모드에서 실패 처리
 * @param {string} video_temp_id - 영상 임시 ID
 * @param {Error} error - 에러 객체
 * @param {string} selectedPlatform - 플랫폼
 */
export const processTestFailure = (video_temp_id, error, selectedPlatform) => {
  updateVideoStatusForTest(video_temp_id, 'failed');
  
  useNotificationStore.getState().add_notification({
    type: 'error',
    message: `🧪 테스트 모드 실패: ${error.message}`,
    data: {
      error: error.message,
      temp_id: video_temp_id,
      failed_at: new Date().toISOString(),
      testMode: true
    }
  });
};

/**
 * 🧪 TEST-ONLY: 테스트 모드에서 영상 재생성 처리
 * @param {string} videoId - 영상 ID
 * @param {string} prompt_text - 프롬프트 텍스트
 * @returns {Promise<Object>} 목업 재생성 결과
 */
export const processTestRegeneration = async (videoId, prompt_text) => {
  return await mockRegenerateVideo(videoId, prompt_text);
};

// 개발 환경에서만 전역 객체에 테스트 헬퍼 노출
if (isTestModeEnabled() && typeof window !== 'undefined') {
  window.testHelpers = {
    updateVideoStatusForTest,
    createTestVideoData,
    createTestLocation,
    cleanupTestData,
    printTestEnvironmentInfo,
    mockS3Upload,
    mockRegenerateVideo,
    processTestMediaRequest,
    processTestFailure,
    processTestRegeneration
  };
  
  
}
