# 🎬 영상 API 하이브리드 테스트 시스템

## 📖 개요

실제 백엔드 API 스펙에 맞춘 3단계 테스트 모드를 제공합니다.  
**실제 DB에 데이터를 저장하면서도 빠르게 테스트**할 수 있어 "표기할 콘텐츠가 없습니다" 문제를 해결합니다.

## 🎯 3단계 테스트 모드

### 🔄 HYBRID 모드 (권장)
```bash
REACT_APP_VIDEO_TEST_MODE=hybrid
```
- ✅ **실제 S3 업로드**: 파일이 실제로 S3에 저장됨
- ✅ **실제 DB 저장**: 백엔드 DB에 jobId, resultId 저장됨 
- ⚡ **영상 생성 시뮬레이션**: jobId polling 없이 2초만에 완료
- ✅ **실제 업로드 API**: 생성된 resultId로 실제 YouTube/Reddit 업로드

**장점**: 백엔드 DB에 실제 데이터가 들어가서 UI에 표시되고, 빠르게 테스트 가능

### 🧪 MOCK 모드 (완전 시뮬레이션)
```bash
REACT_APP_VIDEO_TEST_MODE=true
# 또는
REACT_APP_VIDEO_TEST_MODE=mock
```
- 🎭 **모든 API 시뮬레이션**: S3, DB, 업로드 모두 목업
- ⚡ **즉시 완료**: 모든 작업이 1-2초 내 완료
- 💰 **비용 없음**: 실제 서버 리소스 사용 안함

**장점**: 빠른 UI 테스트, 비용 절약

### 🔴 REAL 모드 (완전 실제)
```bash
REACT_APP_VIDEO_TEST_MODE=false
```
- ✅ **모든 API 실제**: S3, DB, 영상 생성, 업로드 모두 실제
- ⏰ **실제 시간 소요**: 영상 생성 5-10분
- 💰 **실제 비용 발생**: 서버 리소스 실제 사용

**장점**: 완전한 실제 환경 테스트

## 🎮 테스트 패널 사용법

### 1. 새 영상 생성 테스트 (HYBRID 권장)
1. 테스트 패널 열기 (우하단 "테스트 패널" 버튼)
2. "1. 생성" 버튼 클릭
3. **HYBRID 모드**: 실제 S3 업로드 → 실제 DB 저장 → 2초 후 완료
4. UI에서 생성된 영상 확인 가능

### 2. resultId 직접 테스트
1. 테스트 패널의 "resultId 직접 테스트" 섹션 이용
2. 기존에 생성된 영상의 resultId 입력 (예: 1, 2, 3...)
3. **스트리밍 테스트**: 영상 미리보기 URL 확인
4. **YouTube 테스트**: 실제 YouTube 업로드 (private)
5. **Reddit 테스트**: 실제 Reddit 게시

### 3. 기존 영상으로 업로드 테스트
1. UI에서 완성된 영상 선택
2. "지금 론칭" 버튼 클릭
3. 업로드 정보 입력 후 업로드

## 🔧 실제 백엔드 API 플로우

### 영상 생성 플로우
```
1. S3 업로드 → jobId 반환
2. 백엔드 DB에 작업 정보 저장
3. GET /api/images/jobs/{jobId}/results → polling으로 상태 확인
4. 완료 시 resultId 받음
5. resultId로 스트리밍/업로드 가능
```

### 핵심 API 엔드포인트
- `POST /api/youtube/upload/{resultId}` - YouTube 업로드
- `POST /api/reddit/upload/{resultId}` - Reddit 업로드  
- `POST /api/videos/stream` (body: `{"resultId": 1}`) - 영상 스트리밍
- `GET /api/images/jobs/{jobId}/results` - 작업 결과 확인

## 🎛️ 개발자 도구

브라우저 콘솔에서 사용 가능:

### 현재 모드 확인
```javascript
window.videoApiWrapper.getVideoApiMode()
// 출력: { hybrid: true, fullTest: false, real: false, description: "하이브리드 모드" }
```

### 테스트 함수들
```javascript
// 영상 업로드 테스트
await window.videoApiWrapper.testVideoUpload()

// jobId로 결과 확인
await window.videoApiWrapper.testJobResults(12345)

// resultId로 YouTube 업로드
await window.videoApiWrapper.testUpload(1, 'youtube')

// resultId로 Reddit 업로드  
await window.videoApiWrapper.testUpload(1, 'reddit')
```

## 🚀 권장 개발 워크플로우

### 1. 개발 초기 (UI 테스트)
```bash
REACT_APP_VIDEO_TEST_MODE=mock  # 빠른 UI 테스트
```

### 2. 통합 테스트 (실제 DB 연동)
```bash
REACT_APP_VIDEO_TEST_MODE=hybrid  # 실제 DB + 빠른 완료
```

### 3. 최종 검증 (완전 실제)
```bash
REACT_APP_VIDEO_TEST_MODE=false  # 실제 환경 테스트
```

### 4. 프로덕션
자동으로 실제 모드 사용

## ⚠️ 중요 사항

### HYBRID 모드의 핵심 장점
- ✅ **"표기할 콘텐츠가 없습니다" 해결**: 실제 DB에 데이터 저장
- ⚡ **빠른 개발 속도**: 영상 생성 시뮬레이션으로 2초 완료
- 💡 **실용적**: 실제 resultId로 업로드 테스트 가능

### 주의사항
1. **환경 변수 변경 후 서버 재시작 필수**
2. **HYBRID 모드도 실제 S3 비용 발생** (영상 생성 비용은 없음)
3. **테스트 데이터**: 🔄 HYBRID, 🧪 MOCK 표시로 구분 가능

## 📊 모드별 비교

| 기능 | REAL 모드 | HYBRID 모드 | MOCK 모드 |
|------|-----------|-------------|-----------|
| S3 업로드 | ✅ 실제 | ✅ 실제 | 🎭 시뮬레이션 |
| DB 저장 | ✅ 실제 | ✅ 실제 | 🎭 시뮬레이션 |
| 영상 생성 | ⏰ 5-10분 | ⚡ 2초 | ⚡ 2초 |
| 업로드 API | ✅ 실제 | ✅ 실제 | 🎭 시뮬레이션 |
| UI 데이터 표시 | ✅ | ✅ | ❌ |
| 비용 | 💰 전체 | 💰 S3만 | 💰 없음 |
| 개발 속도 | ⏰ 느림 | ⚡ 빠름 | ⚡ 매우 빠름 |

**결론**: 개발 중에는 **HYBRID 모드**를 사용하여 실제 DB 연동과 빠른 테스트의 장점을 모두 활용하세요!