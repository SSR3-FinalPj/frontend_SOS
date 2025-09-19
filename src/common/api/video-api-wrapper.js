/**
 * 🎬 VIDEO API WRAPPER - 영상 생성 관련 API만 선별적 테스트 모드 지원
 * 
 * 영상 생성과 관련된 비용이 많이 드는 작업들만 테스트 모드를 제공하고,
 * 나머지 API는 실제 백엔드를 계속 사용합니다.
 * 
 * 실제 백엔드 API 스펙 기반:
 * - S3 업로드 → jobId 반환
 * - GET /api/images/jobs/{jobId}/results → polling으로 상태 확인  
 * - POST /api/youtube/upload/{resultId} 
 * - POST /api/reddit/upload/{resultId}
 * - POST /api/videos/stream (body: {"resultId": 1})
 * 
 * @author Claude Code Assistant  
 * @version 1.1.0
 * @created 2025-01-11
 */

import * as realApi from './api';
// import * as testApi from './test-api'; // 테스트 코드

// // 🎯 영상 관련 API만 환경 변수로 테스트 모드 결정
// const VIDEO_TEST_MODE = import.meta.env.REACT_APP_VIDEO_TEST_MODE;

// // 테스트 모드 결정 로직
// let USE_HYBRID_MODE = false;
// let USE_FULL_TEST_MODE = false;

// if (VIDEO_TEST_MODE === 'hybrid') {
//   USE_HYBRID_MODE = true;
// } else if (VIDEO_TEST_MODE === 'true' || VIDEO_TEST_MODE === 'mock') {
//   USE_FULL_TEST_MODE = true;
// } else {
// }

// 실제 API만 사용

// /**
//  * 🧪 현재 영상 API 모드 확인
//  * @returns {Object} 모드 정보
//  */
// export const getVideoApiMode = () => ({
//   hybrid: USE_HYBRID_MODE,
//   fullTest: USE_FULL_TEST_MODE,
//   real: !USE_HYBRID_MODE && !USE_FULL_TEST_MODE,
//   description: USE_HYBRID_MODE ? '하이브리드 모드' :
//                USE_FULL_TEST_MODE ? '완전 테스트 모드' : '실제 백엔드'
// });

export const getVideoApiMode = () => ({
  hybrid: false,
  fullTest: false,
  real: true,
  description: '실제 백엔드'
});

// ============================================================================
// 🎬 HYBRID MODE - 실제 S3+DB, 영상 생성만 시뮬레이션
// ============================================================================

// /**
//  * 하이브리드 모드용 jobId polling 시뮬레이션
//  * 실제 jobId로 백엔드 DB에 저장은 되지만, polling 결과는 즉시 완료로 처리
//  */
// const simulateJobCompletion = async (jobId) => {

//   // 2초 후 완료로 시뮬레이션
//   await new Promise(resolve => setTimeout(resolve, 2000));

//   // 시뮬레이션된 resultId 생성 (실제와 유사한 형태)
//   const resultId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);

//   const mockResult = {
//     resultId,
//     jobId,
//     status: 'COMPLETED',
//     type: 'IMAGE_TO_VIDEO',
//     resultKey: `generated-videos/${resultId}.mp4`,
//     promptText: '하이브리드 모드로 생성된 영상',
//     createdAt: new Date().toISOString()
//   };

//   return mockResult;
// };

// ============================================================================
// 🚀 VIDEO CREATION & MANAGEMENT API
// ============================================================================

/**
 * 이미지를 S3에 업로드하고 백엔드에 알림 (영상 생성 트리거)
 * 테스트 모드 비활성화: 실제 API만 사용
 */
export const uploadImageToS3Complete = realApi.uploadImageToS3Complete;

// // 테스트 코드
// export const uploadImageToS3Complete = (() => {
//   if (USE_FULL_TEST_MODE) {
//     return testApi.uploadImageToS3Complete;
//   } else if (USE_HYBRID_MODE) {
//     // 하이브리드: 실제 업로드하지만 결과 처리는 빠르게
//     return async (file, locationCode, promptText = "", platform = "YOUTUBE") => {

//       // 실제 S3 업로드 실행
//       const realResult = await realApi.uploadImageToS3Complete(file, locationCode, promptText, platform);


//       // jobId로 완료 시뮬레이션 (실제로는 polling 필요)
//       if (realResult.jobId) {
//         setTimeout(async () => {
//           try {
//             await simulateJobCompletion(realResult.jobId);
//             // TODO: 여기서 SSE 이벤트도 시뮬레이션으로 발송할 수 있음
//           } catch (error) {
//           }
//         }, 100);
//       }

//       return realResult;
//     };
//   } else {
//     return realApi.uploadImageToS3Complete;
//   }
// })();

/**
 * 영상 스트리밍 URL 요청 (미리보기용)
 * POST /api/videos/stream with body: {"resultId": number}
 * 테스트 모드 비활성화: 실제 API만 사용
 */
export const requestVideoStream = realApi.getVideoStreamUrl;

// // 테스트 코드
// export const requestVideoStream = USE_FULL_TEST_MODE
//   ? testApi.requestVideoStream
//   : realApi.getVideoStreamUrl;

/**
 * 영상 수정 요청
 * 테스트 모드 비활성화: 실제 API만 사용
 */
export const reviseVideo = realApi.reviseVideo;

// // 테스트 코드
// export const reviseVideo = (() => {
//   if (USE_FULL_TEST_MODE) {
//     return testApi.regenerateVideo; // 테스트 API는 기존 함수명 유지
//   } else if (USE_HYBRID_MODE) {
//     // 하이브리드: 실제 API 호출하지만 빠른 완료 처리
//     return async (resultId, promptText) => {

//       try {
//         const result = await realApi.reviseVideo(resultId, promptText);

//         // 실제 API 결과에 jobId가 있다면 시뮬레이션 처리
//         if (result.jobId) {
//           setTimeout(() => simulateJobCompletion(result.jobId), 100);
//         }

//         return result;
//       } catch (error) {
//         return testApi.regenerateVideo(resultId, promptText); // 테스트 API는 기존 함수명 유지
//       }
//     };
//   } else {
//     return realApi.reviseVideo;
//   }
// })();

/**
 * YouTube에 영상 업로드
 * POST /api/youtube/upload/{resultId}
 * 테스트 모드 비활성화: 실제 API만 사용
 */
export const uploadToYoutube = realApi.uploadToYouTube; // 실제 API는 uploadToYouTube (대문자 T)

// // 테스트 코드
// export const uploadToYoutube = USE_FULL_TEST_MODE
//   ? testApi.uploadToYoutube
//   : realApi.uploadToYouTube; // 실제 API는 uploadToYouTube (대문자 T)

/**
 * Reddit에 콘텐츠 업로드
 * POST /api/reddit/upload/{resultId}
 * 테스트 모드 비활성화: 실제 API만 사용
 */
export const uploadToReddit = realApi.uploadToReddit;

// // 테스트 코드
// export const uploadToReddit = USE_FULL_TEST_MODE
//   ? testApi.uploadToReddit
//   : realApi.uploadToReddit;

// ============================================================================
// 🔍 JOB STATUS API (백엔드 API 스펙)
// ============================================================================

// 작업 상태 확인 API (현재 미사용)
export const getJobResults = realApi.getJobResults || (async () => {
  throw new Error('getJobResults API not implemented');
});

// // 테스트 코드
// export const getJobResults = (() => {
//   if (USE_FULL_TEST_MODE) {
//     return async (jobId) => {
//       await new Promise(resolve => setTimeout(resolve, 500));
//       return simulateJobCompletion(jobId);
//     };
//   } else if (USE_HYBRID_MODE) {
//     return simulateJobCompletion;
//   } else {
//     // 실제 API가 있다면 사용, 없으면 기본 구현
//     return realApi.getJobResults || (async (jobId) => {
//       throw new Error('getJobResults API not implemented');
//     });
//   }
// })();

// ============================================================================
// 🎯 개발자 도구 (개발 환경에서만 사용 가능)
// ============================================================================

// 개발자 전역 테스트 도구 노출 제거

// ============================================================================
// 🚀 기본 export
// ============================================================================

export default {
  // Video Creation & Management
  uploadImageToS3Complete,
  requestVideoStream, 
  reviseVideo,
  uploadToYoutube,
  uploadToReddit,
  
  // Job Status
  getJobResults,
  
  // Utility
  getVideoApiMode
};
