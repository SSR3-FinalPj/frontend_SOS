/**
 * 테스트 데이터 생성 유틸리티
 * 다양한 상태의 영상 데이터를 생성하여 UI 테스트에 활용
 */

// 테스트용 샘플 제목들
const SAMPLE_TITLES = {
  youtube: [
    "AI로 만드는 미래형 콘텐츠 전략",
    "소셜미디어 마케팅 완벽 가이드 2025",
    "데이터 분석으로 성과 2배 늘리기",
    "크리에이터를 위한 영상 제작 팁 10가지",
    "브랜드 스토리텔링의 힘과 실전 적용법",
    "인플루언서 마케팅 성공 사례 분석",
    "콘텐츠 최적화로 조회수 늘리는 방법",
    "유튜브 알고리즘 이해하고 활용하기"
  ],
  reddit: [
    "Reddit 마케팅으로 브랜드 인지도 높이기",
    "커뮤니티 참여도를 높이는 5가지 방법",
    "효과적인 Reddit 포스팅 전략 가이드",
    "오가닉 트래픽 증가를 위한 Reddit 활용법",
    "Reddit에서 바이럴 콘텐츠 만드는 비법",
    "Subreddit별 맞춤 콘텐츠 제작 노하우",
    "Reddit 댓글 마케팅 완벽 가이드",
    "커뮤니티 기반 마케팅 성공 전략"
  ]
};

// 테스트용 위치 데이터
const SAMPLE_LOCATIONS = [
  { poi_id: "test_gangnam_001", name: "강남역" },
  { poi_id: "test_hongdae_002", name: "홍대입구역" },
  { poi_id: "test_myeongdong_003", name: "명동" },
  { poi_id: "test_itaewon_004", name: "이태원" },
  { poi_id: "test_insadong_005", name: "인사동" },
  { poi_id: "test_jamsil_006", name: "잠실" },
  { poi_id: "test_kondae_007", name: "건대입구" },
  { poi_id: "test_sinchon_008", name: "신촌" }
];

// 테스트용 프롬프트
const SAMPLE_PROMPTS = [
  "밤하늘의 별들이 반짝이는 로맨틱한 영상",
  "도시의 활기찬 일상을 담은 타임랩스",
  "자연 속에서 펼쳐지는 평화로운 장면",
  "음식과 사람들이 어우러진 따뜻한 순간",
  "젊은 사람들의 에너지 넘치는 모습",
  "전통과 현대가 조화를 이루는 풍경",
  "계절의 변화를 담은 아름다운 장면",
  "사람들의 진솔한 표정과 감정이 담긴 영상"
];

/**
 * 고유한 ID 생성
 */
function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 랜덤 배열 요소 선택
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 날짜 생성 (오늘부터 며칠 전까지)
 */
function getRandomDate(daysBack = 7) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
}

/**
 * 테스트 영상 데이터 생성
 * @param {string} status - 영상 상태 ('PROCESSING', 'ready', 'uploaded', 'failed')
 * @param {string} platform - 플랫폼 ('youtube', 'reddit')
 * @param {Object} overrides - 덮어쓸 속성들
 * @returns {Object} 생성된 테스트 데이터
 */
export function generateTestVideoData(status = 'PROCESSING', platform = 'youtube', overrides = {}) {
  const temp_id = generateUniqueId();
  const location = getRandomItem(SAMPLE_LOCATIONS);
  const titles = SAMPLE_TITLES[platform] || SAMPLE_TITLES.youtube;
  const title = getRandomItem(titles);
  const prompt = getRandomItem(SAMPLE_PROMPTS);
  const createdAt = getRandomDate();

  const baseData = {
    temp_id,
    title: `${location.name} - ${title}`,
    location_id: location.poi_id,
    location_name: location.name,
    user_request: prompt,
    platform: platform === 'youtube' ? 'youtube' : 'reddit',
    status,
    start_time: createdAt,
    created_at: createdAt,
    creationTime: createdAt,
    image_url: null, // Base64 제거로 null 설정
    
    // 상태별 추가 속성
    ...(status === 'ready' && {
      resultId: Math.floor(Math.random() * 10000) + 1000,
      video_id: `${platform}_${Math.random().toString(36).substr(2, 8)}`,
    }),
    
    ...(status === 'uploaded' && {
      resultId: Math.floor(Math.random() * 10000) + 1000,
      video_id: `${platform}_${Math.random().toString(36).substr(2, 8)}`,
      upload_date: new Date().toISOString(),
      upload_status: 'completed'
    }),
    
    ...(status === 'failed' && {
      error_message: '영상 생성 중 오류가 발생했습니다.',
      failed_at: new Date().toISOString()
    }),

    // 플랫폼별 추가 속성
    ...(platform === 'reddit' && {
      subreddit: getRandomItem(['funny', 'pics', 'videos', 'mildlyinteresting', 'aww']),
      post_type: 'image'
    })
  };

  return {
    ...baseData,
    ...overrides
  };
}

/**
 * 여러 개의 테스트 데이터 생성
 * @param {number} count - 생성할 개수
 * @param {string} status - 상태
 * @param {string} platform - 플랫폼
 * @returns {Array} 테스트 데이터 배열
 */
export function generateMultipleTestVideos(count = 5, status = 'PROCESSING', platform = 'youtube') {
  const videos = [];
  for (let i = 0; i < count; i++) {
    videos.push(generateTestVideoData(status, platform));
  }
  return videos;
}

/**
 * 전체 워크플로우 테스트를 위한 데이터 세트 생성
 * @returns {Array} 다양한 상태의 테스트 데이터들
 */
export function generateWorkflowTestSet() {
  const testSet = [];
  
  // 각 상태별로 YouTube/Reddit 데이터 생성
  const statuses = ['PROCESSING', 'ready', 'uploaded', 'failed'];
  const platforms = ['youtube', 'reddit'];
  
  statuses.forEach(status => {
    platforms.forEach(platform => {
      // 각 조합마다 1-2개씩 생성
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        testSet.push(generateTestVideoData(status, platform));
      }
    });
  });
  
  return testSet;
}

/**
 * 특정 시나리오를 위한 테스트 데이터 생성
 * @param {string} scenario - 시나리오 타입 ('preview_test', 'upload_test', 'edit_test')
 * @returns {Object} 시나리오별 테스트 데이터
 */
export function generateScenarioTestData(scenario) {
  const location = getRandomItem(SAMPLE_LOCATIONS);
  
  switch (scenario) {
    case 'preview_test':
      // 미리보기 테스트용: ready 상태 영상들
      return {
        video: generateTestVideoData('ready', 'youtube', {
          title: `${location.name} - 미리보기 테스트 영상`,
          resultId: 9999 // 고정 ID로 스트리밍 URL 테스트 가능
        }),
        description: '미리보기 모달 테스트용 영상 (ready 상태)'
      };
      
    case 'upload_test':
      // 업로드 테스트용: ready 상태에서 uploaded로 전환 테스트
      return {
        video: generateTestVideoData('ready', 'youtube', {
          title: `${location.name} - 업로드 테스트 영상`,
          resultId: 8888
        }),
        description: '업로드 기능 테스트용 영상 (ready → uploaded 전환)'
      };
      
    case 'edit_test':
      // 수정 테스트용: uploaded 상태 영상
      return {
        video: generateTestVideoData('uploaded', 'youtube', {
          title: `${location.name} - 수정 테스트 영상`,
          video_id: 'test_edit_video_001'
        }),
        description: '수정 기능 테스트용 영상 (uploaded 상태, 수정 모달 테스트)'
      };
      
    default:
      return {
        video: generateTestVideoData(),
        description: '기본 테스트 데이터'
      };
  }
}

/**
 * 개발용 초기 테스트 데이터 생성
 * @returns {Array} 개발 시작 시 사용할 기본 테스트 데이터들
 */
export function generateInitialTestData() {
  return [
    // 생성 중인 영상 (타이머 테스트)
    generateTestVideoData('PROCESSING', 'youtube', {
      title: '강남역 - AI 콘텐츠 생성 데모 (PROCESSING)',
      start_time: new Date(Date.now() - 30000).toISOString() // 30초 전 시작
    }),
    
    // 완료된 영상 (미리보기 테스트)
    generateTestVideoData('ready', 'youtube', {
      title: '홍대입구 - 미리보기 테스트 영상 (READY)',
      resultId: 1001
    }),
    
    // 업로드된 영상 (수정 테스트)
    generateTestVideoData('uploaded', 'youtube', {
      title: '명동 - 수정 기능 테스트 영상 (UPLOADED)',
      video_id: 'demo_uploaded_001'
    }),
    
    // 실패한 영상 (재시도 테스트)
    generateTestVideoData('failed', 'youtube', {
      title: '이태원 - 실패 테스트 영상 (FAILED)',
      error_message: '네트워크 오류로 생성에 실패했습니다.'
    }),
    
    // Reddit 테스트 데이터
    generateTestVideoData('ready', 'reddit', {
      title: '인사동 - Reddit 테스트 이미지 (READY)',
      resultId: 2001,
      subreddit: 'travel'
    })
  ];
}