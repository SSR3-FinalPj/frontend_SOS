/**
 * 고유 ID 생성 유틸리티
 * 중복을 완전히 방지하는 ID 생성 함수들
 */

// 내부 카운터 (같은 밀리초 내 중복 방지용)
let counter = 0;

/**
 * 완전히 고유한 ID를 생성하는 함수
 * @param {string} prefix - ID 접두사 (기본값: 'id')
 * @returns {string} 고유한 ID
 */
export const generateUniqueId = (prefix = 'id') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const currentCounter = ++counter;
  
  // 카운터가 너무 커지면 리셋 (메모리 효율성)
  if (counter > 999999) {
    counter = 0;
  }
  
  return `${prefix}-${timestamp}-${currentCounter}-${random}`;
};

/**
 * 임시 영상 ID 생성 (숫자 기반 - 백엔드 API 호환성)
 * 🧪 TEST-ONLY: 백엔드 연동 후 실제 result_id 사용 시 이 함수는 삭제 예정
 * @returns {number} 고유한 숫자 임시 ID
 */
export const generateTempVideoId = () => {
  // 현재 타임스탬프 + 카운터로 고유한 숫자 ID 생성
  const timestamp = Date.now();
  const currentCounter = ++counter;
  
  // 카운터가 너무 커지면 리셋
  if (counter > 999999) {
    counter = 0;
  }
  
  // 숫자 조합: 타임스탬프 뒤 3자리 + 카운터 (최대 6자리)
  return parseInt(`${timestamp}${currentCounter.toString().padStart(3, '0')}`);
};

/**
 * 완료된 영상 ID 생성 (completed- 접두사)  
 * @param {string|number} resultId - 결과 ID
 * @returns {string} 고유한 완료 ID
 */
export const generateCompletedVideoId = (resultId) => {
  return generateUniqueId(`completed-${resultId}`);
};

/**
 * 더미 데이터 ID 생성 (dummy- 접두사)
 * @returns {string} 고유한 더미 ID  
 */
export const generateDummyId = () => {
  return generateUniqueId('dummy');
};

/**
 * React 컴포넌트 키용 고유 ID 생성
 * @param {string} base - 기본 키 (있으면 사용)
 * @param {string} prefix - 접두사 (기본값: 'key')
 * @param {number} index - 인덱스 (선택사항)
 * @returns {string} React key로 사용할 고유 ID
 */
export const generateReactKey = (base = null, prefix = 'key', index = null) => {
  // 기본 키가 있으면 사용
  if (base && typeof base === 'string' && base.length > 0) {
    return base;
  }
  
  // 없으면 고유 키 생성
  const indexSuffix = index !== null ? `-${index}` : '';
  return generateUniqueId(`${prefix}${indexSuffix}`);
};

/**
 * 현재 카운터 값 반환 (디버깅용)
 * @returns {number} 현재 카운터 값
 */
export const getCurrentCounter = () => counter;

/**
 * 카운터 리셋 (테스트용)
 */
export const resetCounter = () => {
  counter = 0;
};