/**
 * 단순화된 비디오 URL 유틸리티
 * AWS EFS mp4 파일을 위한 준비
 */

/**
 * 비디오 URL을 그대로 반환하는 단순한 함수
 * AWS EFS에서는 직접 mp4 URL을 사용하므로 복잡한 변환이 필요 없음
 * @param {string} originalUrl - 원본 비디오 URL
 * @returns {string|null} 원본 URL 또는 null
 */
export const getEmbeddableVideoUrl = (originalUrl) => {
  if (!originalUrl || typeof originalUrl !== 'string') {
    return null;
  }

  

  // AWS EFS mp4 파일이나 직접 접근 가능한 비디오 URL은 그대로 반환
  if (originalUrl.endsWith('.mp4') || 
      originalUrl.endsWith('.webm') || 
      originalUrl.endsWith('.ogg') ||
      originalUrl.includes('w3schools.com') ||
      originalUrl.includes('sample-videos.com') ||
      originalUrl.includes('file-examples.com')) {
    
    return originalUrl;
  }

  // YouTube URL 처리 (필요한 경우)
  if (originalUrl.includes('youtube.com') || originalUrl.includes('youtu.be')) {
    
    return originalUrl; // 나중에 YouTube 임베드 로직 추가 가능
  }

  // Vimeo URL 처리 (필요한 경우)
  if (originalUrl.includes('vimeo.com')) {
    
    return originalUrl; // 나중에 Vimeo 임베드 로직 추가 가능
  }

  // 알 수 없는 URL도 일단 원본 반환 (브라우저가 처리할 수 있을 수도 있음)
  
  return originalUrl;
};

/**
 * AWS EFS 비디오 URL 생성 함수 (미래 사용)
 * @param {string} videoId - 비디오 ID
 * @param {string} baseUrl - 기본 URL (CloudFront 등)
 * @returns {string} 완성된 비디오 URL
 */
export const generateAWSVideoUrl = (videoId, baseUrl = null) => {
  const base = baseUrl || import.meta.env.VITE_AWS_VIDEO_BASE_URL || '/videos';
  return `${base}/${videoId}.mp4`;
};

/**
 * 비디오 URL 검증 함수
 * @param {string} url - 검증할 URL
 * @returns {boolean} 유효한 비디오 URL인지 여부
 */
export const isValidVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // 지원하는 비디오 형식들
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
  const supportedDomains = ['w3schools.com', 'sample-videos.com', 'file-examples.com'];
  
  // 파일 확장자 체크
  if (videoExtensions.some(ext => url.toLowerCase().includes(ext))) {
    return true;
  }
  
  // 지원하는 도메인 체크
  if (supportedDomains.some(domain => url.includes(domain))) {
    return true;
  }
  
  // YouTube, Vimeo 등
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
    return true;
  }
  
  return false;
};

/**
 * 비디오 파일 크기 추정 함수 (URL 기반)
 * @param {string} url - 비디오 URL
 * @returns {Promise<number|null>} 파일 크기 (bytes) 또는 null
 */
export const getVideoFileSize = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('Content-Length');
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    return null;
  }
};
