# CLAUDE.md
- 이 문서는 이 저장소에서 코드를 작업할 때 Claude Code를 위한 지침을 제공합니다. 프로젝트는 관심사별 분리 원칙을 따르며, 아래의 디렉터리 구조와 코딩 규칙을 기준으로 작업합니다.

## 디렉터리 구조 가이드
```
src/
  ├── pages/                  # 라우팅 페이지 컴포넌트
  ├── components/           # 재사용 가능한 UI 컴포넌트
  ├── hooks/                # 공통 커스텀 훅
  ├── styles/               # 전역 및 공통 스타일
  ├── types/                # TypeScript 타입 정의
  ├── assets/               # 이미지, 아이콘 등 정적 파일
  ├── utils/                # 범용 유틸리티 함수
  ├── api/                  # API 호출 함수
  ├── lib/                  # 외부 라이브러리 및 기술 기반 코드
  └── stores/               # Zustand 전역 상태 관리
```


## 코드 작성 지침
### 기술 스택
- 프레임워크: React.js
- 언어: JavaScript
- 스타일링: Tailwind CSS
- 상태 관리: Zustand

## 일반 규칙
- 변수명: 변수명은 **snake_case**를 사용하며, 명확한 의미를 담아야 합니다.
- 컴포넌트: PascalCase.jsx 형식의 함수형 컴포넌트를 사용하고 hooks를 적극적으로 활용하여 로직을 분리합니다.
- Git 커밋: main 브랜치에 직접 커밋하는 것은 금지되며, 반드시 별도의 브랜치에서 작업 후 Pull Request를 통해 병합해야 합니다.

## Gemini 연동 
- 프롬프트에 /Gemini.*상의하면서/가 포함될 경우, Gemini CLI를 통해 협업하여 문제 해결 및 아이디어 구체화에 도움을 받습니다.

### 트리거: 
- 정규표현식 /Gemini.*상의하면서/에 해당하는 모든 문구.

### 작업 방식:
- 사용자 요구사항을 $PROMPT 환경 변수에 저장.
- gemini CLI를 호출해 $PROMPT를 전달.
- Gemini의 응답을 그대로 표시하고 Claude의 설명을 덧붙여 지식을 결합.
- 서로 대화하는 방식으로 지식을 결합

## 코드 스타일
- ES 모듈 (import/export)을 사용하여 모듈 간 의존성을 명확히 합니다.
- 함수와 이벤트 핸들러에는 **snake_case**를 사용합니다.
- 함수와 컴포넌트 문서화에는 JSDoc을 사용하여 파라미터, 반환값 등을 명시합니다.
- 임시 메모에는 // TODO:와 // FIXME:를 사용하여 개선 및 수정이 필요한 부분을 기록합니다.

## 성능 최적화
- 불필요한 리렌더링 방지를 위해 **React.memo**를 사용하여 컴포넌트를 최적화합니다.
- Props로 전달되는 함수를 메모이제이션하기 위해 **useCallback**을 적절히 사용하여 자식 컴포넌트의 리렌더링을 방지합니다.

## 파일 네이밍 규칙
- 컴포넌트: PascalCase.jsx (예: HeroSection.jsx)
- 유틸리티: snake_case.js (예: api_helper.js)
- 상수: UPPER_SNAKE_CASE.js (예: API_CONSTANTS.js)
- 스타일: kebab-case.css (예: global-styles.css) 
- Zustand 스토어: snake_case_store.js (예: user_store.js)

## 토큰 사용량 존중 규칙
- 해야 할 일: 짧고 선언적인 글머리 기호 사용.
- 하지 말아야 할 일: 길고 서술적인 단락 작성.
- 해야 할 일: 중복 줄이기.
- 하지 말아야 할 일: 주석이나 불필요한 정보 포함. 클로드의 작업에 필요한 규칙만 포함.