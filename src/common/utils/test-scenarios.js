/**
 * 테스트 시나리오 실행 유틸리티
 * 생성, 미리보기, 업로드, 수정 기능의 전체 플로우를 테스트하기 위한 함수들
 */

import { generateTestVideoData, generateScenarioTestData } from './test-data-generator';

/**
 * 영상 생성 시나리오 테스트
 * PROCESSING → ready 상태 전환 시뮬레이션
 */
export async function runVideoCreationScenario(contentLaunchStore) {
  console.log('🎬 [테스트 시나리오] 영상 생성 플로우 시작');
  
  // 1단계: 새 영상 생성 (PROCESSING 상태)
  const newVideo = generateTestVideoData('PROCESSING', 'youtube', {
    title: '테스트 시나리오 - 영상 생성 플로우',
    start_time: new Date().toISOString()
  });
  
  const creationDate = new Date().toISOString().split('T')[0];
  contentLaunchStore.add_pending_video(newVideo, creationDate);
  
  console.log('✅ 1단계: PROCESSING 상태 영상 생성 완료', newVideo.temp_id);
  
  // 2단계: 3초 후 자동으로 ready 상태로 전환
  return new Promise((resolve) => {
    setTimeout(() => {
      contentLaunchStore.transition_to_ready(newVideo.temp_id);
      console.log('✅ 2단계: READY 상태로 전환 완료');
      resolve({
        success: true,
        videoId: newVideo.temp_id,
        message: '영상 생성 시나리오 완료: PROCESSING → READY'
      });
    }, 3000);
  });
}

/**
 * 미리보기 시나리오 테스트
 * ready 상태 영상의 미리보기 모달 테스트
 */
export function runPreviewScenario(contentLaunchStore, previewModalStore) {
  console.log('👁️ [테스트 시나리오] 미리보기 플로우 시작');
  
  // 미리보기 테스트용 영상 생성
  const { video } = generateScenarioTestData('preview_test');
  const creationDate = new Date().toISOString().split('T')[0];
  
  // 1단계: ready 상태 영상 추가
  contentLaunchStore.add_pending_video(video, creationDate);
  console.log('✅ 1단계: 미리보기용 READY 영상 생성 완료');
  
  // 2단계: 영상 선택 및 미리보기 모달 열기
  contentLaunchStore.select_video(video);
  previewModalStore.open_preview_modal(video);
  
  console.log('✅ 2단계: 미리보기 모달 열기 완료');
  
  return {
    success: true,
    videoId: video.temp_id,
    message: '미리보기 시나리오 완료: 영상 선택 → 미리보기 모달 열기',
    instructions: [
      '1. 미리보기 모달에서 영상을 확인하세요',
      '2. 다운로드 버튼을 테스트하세요',
      '3. 수정하기 버튼을 클릭하여 수정 모달을 테스트하세요'
    ]
  };
}

/**
 * 업로드 시나리오 테스트
 * ready → uploaded 상태 전환 시뮬레이션
 */
export async function runUploadScenario(contentLaunchStore) {
  console.log('📤 [테스트 시나리오] 업로드 플로우 시작');
  
  // 업로드 테스트용 영상 생성
  const { video } = generateScenarioTestData('upload_test');
  const creationDate = new Date().toISOString().split('T')[0];
  
  // 1단계: ready 상태 영상 추가
  contentLaunchStore.add_pending_video(video, creationDate);
  console.log('✅ 1단계: 업로드용 READY 영상 생성 완료');
  
  // 2단계: 업로드 시뮬레이션 실행
  const videoId = video.temp_id || video.id;
  
  try {
    // 업로드 프로세스 시뮬레이션
    await contentLaunchStore.simulate_upload(videoId, 2000); // 2초 딜레이
    
    console.log('✅ 2단계: 업로드 시뮬레이션 완료');
    
    return {
      success: true,
      videoId,
      message: '업로드 시나리오 완료: READY → 업로드 시뮬레이션 → UPLOADED'
    };
  } catch (error) {
    console.error('❌ 업로드 시나리오 실패:', error);
    return {
      success: false,
      videoId,
      message: '업로드 시나리오 실패',
      error: error.message
    };
  }
}

/**
 * 수정 시나리오 테스트
 * uploaded 상태 영상의 수정 모달 테스트
 */
export function runEditScenario(contentLaunchStore, requestModalStore) {
  console.log('✏️ [테스트 시나리오] 수정 플로우 시작');
  
  // 수정 테스트용 영상 생성
  const { video } = generateScenarioTestData('edit_test');
  const creationDate = new Date().toISOString().split('T')[0];
  
  // 1단계: uploaded 상태 영상 추가
  contentLaunchStore.add_pending_video(video, creationDate);
  console.log('✅ 1단계: 수정용 UPLOADED 영상 생성 완료');
  
  // 2단계: 영상 선택 (수정 모드 활성화)
  contentLaunchStore.select_video(video);
  console.log('✅ 2단계: 수정 대상 영상 선택 완료');
  
  return {
    success: true,
    videoId: video.video_id || video.temp_id,
    selectedVideo: video,
    message: '수정 시나리오 준비 완료: UPLOADED 영상 선택됨',
    instructions: [
      '1. "영상 수정하기" 버튼이 활성화되었는지 확인하세요',
      '2. 버튼을 클릭하여 수정 모달을 열어보세요',
      '3. 프롬프트만 입력하는 간소화된 UI를 확인하세요',
      '4. 수정 요청을 테스트해보세요'
    ]
  };
}

/**
 * 전체 워크플로우 통합 시나리오
 * 생성 → 미리보기 → 업로드 → 수정의 전체 플로우를 순차적으로 실행
 */
export async function runFullWorkflowScenario(stores) {
  const { contentLaunchStore, previewModalStore } = stores;
  
  console.log('🚀 [통합 테스트] 전체 워크플로우 시나리오 시작');
  
  const results = {
    creation: null,
    preview: null,
    upload: null,
    edit: null,
    overall: null
  };
  
  try {
    // 1단계: 영상 생성
    console.log('--- 1단계: 영상 생성 ---');
    results.creation = await runVideoCreationScenario(contentLaunchStore);
    await delay(1000);
    
    // 2단계: 미리보기
    console.log('--- 2단계: 미리보기 ---');
    results.preview = runPreviewScenario(contentLaunchStore, previewModalStore);
    await delay(2000);
    
    // 3단계: 업로드
    console.log('--- 3단계: 업로드 ---');
    results.upload = await runUploadScenario(contentLaunchStore);
    await delay(1000);
    
    // 4단계: 수정
    console.log('--- 4단계: 수정 ---');
    results.edit = runEditScenario(contentLaunchStore);
    
    results.overall = {
      success: true,
      message: '🎉 전체 워크플로우 시나리오 완료!',
      summary: [
        `✅ 영상 생성: ${results.creation.success ? '성공' : '실패'}`,
        `✅ 미리보기: ${results.preview.success ? '성공' : '실패'}`,
        `✅ 업로드: ${results.upload.success ? '성공' : '실패'}`,
        `✅ 수정 준비: ${results.edit.success ? '성공' : '실패'}`
      ]
    };
    
    console.log('🎉 전체 워크플로우 시나리오 완료!');
    
  } catch (error) {
    console.error('❌ 통합 시나리오 실행 중 오류:', error);
    results.overall = {
      success: false,
      message: '통합 시나리오 실행 실패',
      error: error.message
    };
  }
  
  return results;
}

/**
 * 에러 시나리오 테스트
 * 다양한 실패 상황 시뮬레이션
 */
export function runErrorScenarios(contentLaunchStore) {
  console.log('⚠️ [테스트 시나리오] 에러 상황 시뮬레이션 시작');
  
  const errorVideos = [];
  const creationDate = new Date().toISOString().split('T')[0];
  
  // 1. 생성 실패 시나리오
  const failedCreation = generateTestVideoData('failed', 'youtube', {
    title: '테스트 - 생성 실패 시나리오',
    error_message: '네트워크 오류로 영상 생성에 실패했습니다.'
  });
  contentLaunchStore.add_pending_video(failedCreation, creationDate);
  errorVideos.push(failedCreation);
  
  // 2. 업로드 실패 시나리오
  const failedUpload = generateTestVideoData('failed', 'reddit', {
    title: '테스트 - 업로드 실패 시나리오',
    error_message: 'API 인증 오류로 업로드에 실패했습니다.'
  });
  contentLaunchStore.add_pending_video(failedUpload, creationDate);
  errorVideos.push(failedUpload);
  
  console.log('✅ 에러 시나리오 영상들 생성 완료');
  
  return {
    success: true,
    errorVideos,
    message: '에러 시나리오 완료: 실패 상태 영상들 생성됨',
    instructions: [
      '1. 실패한 영상들의 에러 메시지를 확인하세요',
      '2. 재시도 버튼의 동작을 테스트해보세요',
      '3. 실패 상태의 UI 표시를 확인하세요'
    ]
  };
}

/**
 * 유틸리티: 딜레이 함수
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 시나리오 실행 상태 로깅
 */
export function logScenarioResult(scenarioName, result) {
  const emoji = result.success ? '✅' : '❌';
  const status = result.success ? '성공' : '실패';
  
  console.group(`${emoji} [${scenarioName}] 시나리오 ${status}`);
  console.log('메시지:', result.message);
  
  if (result.videoId) {
    console.log('영상 ID:', result.videoId);
  }
  
  if (result.instructions) {
    console.log('다음 단계:');
    result.instructions.forEach((instruction, index) => {
      console.log(`  ${index + 1}. ${instruction}`);
    });
  }
  
  if (result.error) {
    console.error('오류:', result.error);
  }
  
  console.groupEnd();
}