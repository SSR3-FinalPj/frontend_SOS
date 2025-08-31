# 🚀 SNS 오케스트레이션 시스템 (S.O.S) - Frontend

- **S.O.S (SNS Orchestration System)** 는 **지자체 홍보팀(초기 타겟: 서울시)** 을 위한 AI 기반 소셜 미디어 콘텐츠 통합 관리 및 자동화 솔루션입니다. 분산된 SNS 채널의 콘텐츠를 효율적으로 생성, 관리하고 성과를 분석하여 홍보 업무의 효율을 극대화하는 것을 목표로 합니다.

이 프로젝트는 현대적인 **FSD(Feature-Sliced Design)** 아키텍처를 기반으로 구축되어, 높은 응집도와 낮은 결합도를 통해 장기적인 유지보수성과 확장성을 확보했습니다.

## 🏛️ 아키텍처 (Architecture)

본 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 채택하여 코드의 예측 가능성과 재사용성을 극대화했습니다. 코드는 계층(Layer) 구조로 구성되어 있으며, 각 계층은 명확한 책임을 가집니다.

가장 중요한 규칙은 **의존성 규칙**입니다. 건물을 짓는 것처럼, 하위 레이어는 상위 레이어의 존재를 알지 못합니다. (예: `common`은 `features`를 알 수 없지만, `features`는 `common`을 사용할 수 있습니다.)

**계층 구조 (의존성 순서):**

1. `common` (공용 코드)
2. `domain` (핵심 데이터 모델)
3. `features` (기능 단위)
4. `containers` (UI 조합)
5. `pages` (페이지 조립)
6. `app` (앱 설정 및 진입점)

## 📁 디렉토리 구조 (Directory Structure)

`src` 디렉토리는 FSD 원칙에 따라 다음과 같이 구성됩니다.

```
src
├── app/                     # 🏁 앱 진입점, 라우팅, 전역 설정
│   └── Router.jsx
├── pages/                   # 📄 페이지: 각 레이어의 부품을 최종 조립
│   ├── LandingPage.jsx
│   └── Dashboard.jsx
├── containers/              # 🧩 UI 조합: 여러 features와 domain을 조합한 재사용 가능한 UI 섹션
│   ├── Sidebar/
│   ├── DashboardLayout/
│   └── HeroSection/
├── features/                # 🚀 기능 단위: 사용자의 액션/시나리오를 담는 독립적인 기능
│   ├── auth/
│   │   ├── logic/
│   │   └── ui/
│   └── content-management/
├── domain/                  # 📂 데이터 모델: 핵심 비즈니스 데이터와 관련 로직
│   ├── dashboard/
│   │   └── logic/
│   └── youtube/
├── common/                  # 🌐 공용 코드: 프로젝트 전반에서 사용되는 범용 코드
│   ├── ui/
│   ├── api/
│   └── hooks/
├── assets/                  # 🖼️ 정적 파일 (이미지, 아이콘 등)
└── styles/                  # 🎨 전역 스타일`
```

### 각 레이어의 역할

- **`app`**: 라우팅(`Router.jsx`), 전역 상태 프로바이더 등 애플리케이션의 최상위 설정을 담당합니다.
- **`pages`**: 사용자가 보는 최종 화면입니다. `containers`와 `features`를 가져와 조립하는 역할에만 집중합니다.
- **`containers`**: `Sidebar`, `DashboardLayout`, `HeroSection`처럼 여러 컴포넌트를 조합하여 만든, 재사용 가능한 큰 UI 단위입니다.
- **`features`**: '로그인하기', '콘텐츠 생성하기'처럼 사용자의 특정 행동과 관련된 UI와 로직을 모두 포함하는 기능의 최소 단위입니다.
- **`domain`**: `dashboard`, `youtube`처럼 애플리케이션의 핵심 데이터(상태)와 그 데이터를 다루는 순수 비즈니스 로직을 담고 있습니다.
- **`common`**: `Button`, `Input` 같은 순수 UI 컴포넌트, `axios` 인스턴스, 범용 커스텀 훅 등 프로젝트 어디서든 재사용 가능한 코드를 포함합니다.

## ✨ 주요 코드 컨벤션 (Key Code Conventions)

프로젝트의 일관성과 가독성을 위해 다음 규칙을 따릅니다.

| 구분 | 규칙 | 예시 |
| --- | --- | --- |
| **UI 조합 폴더** | `containers` | `src/containers/` |
| **로직 폴더** | `logic` | `src/domain/dashboard/logic/` |
| **컴포넌트/페이지 파일** | `PascalCase.jsx` | `Button.jsx`, `LandingPage.jsx` |
| **로직/유틸 파일** | `kebab-case.js` | `use-app-state.js`, `api-client.js` |
| **Import 경로** | `@` 절대 경로 | `import Button from '@/common/ui/Button';` |
| **index 파일** | 폴더 단위 모듈화 | `containers/Sidebar/index.jsx` |

Sheets로 내보내기

## 🛠️ 시작하기 (Getting Started)

1. **의존성 설치:** Bash
    
    ```npm install```
    
2. **개발 서버 실행:** Bash
    
    ```npm run dev```
    
3. **프로덕션 빌드:** Bash
    
    ```npm run build```
    

## 💻 기술 스택 (Tech Stack)

- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **API Client**: Axios
