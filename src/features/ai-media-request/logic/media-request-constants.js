/**
 * AI 미디어 요청 관련 상수 및 번역 데이터
 */

import { Palette, Camera, Video, Settings } from 'lucide-react';

// 한국어-영어 변환 데이터
export const CATEGORY_TRANSLATIONS = {
  style: {
    '영화적인 4K 고화질': 'cinematic 4K, high detail, moody lighting',
    '자연스러운 다큐멘터리': 'documentary style, natural lighting',
    '현대적이고 세련된': 'modern sleek style, clean composition',
    '빈티지 감성': 'vintage aesthetic, warm tone, film grain',
    '미니멀리즘': 'minimalist style, clean lines, simple composition'
  },
  subject: {
    '궁궐 안뜰과 돌문': 'palace courtyards, stone gates, wet ground reflections',
    '도심 속 건물들': 'urban buildings, city skyline, street views',
    '자연 경관': 'natural landscapes, scenic views',
    '전통 건축': 'traditional architecture, cultural heritage',
    '현대적 랜드마크': 'modern landmarks, architectural highlights'
  },
  motion: {
    '천천히 앞으로': 'slow dolly forward',
    '좌우 패닝': 'smooth pan left to right',
    '위에서 아래로': 'top down aerial view',
    '회전하며 촬영': 'circular rotation around subject',
    '고정 카메라': 'static camera, no movement'
  },
  constraints: {
    '같은 앵글 유지': 'same camera angle, consistent framing',
    '타임랩스 시퀀스': 'timelapse sequence',
    '황금 시간대': 'golden hour lighting',
    '날씨 변화 포함': 'weather transition effects',
    '사람 없는 장면': 'empty scene, no people'
  }
};

// 카테고리 옵션 목록
export const CATEGORY_OPTIONS = {
  style: Object.keys(CATEGORY_TRANSLATIONS.style),
  subject: Object.keys(CATEGORY_TRANSLATIONS.subject),
  motion: Object.keys(CATEGORY_TRANSLATIONS.motion),
  constraints: Object.keys(CATEGORY_TRANSLATIONS.constraints)
};

// 카테고리 메타데이터
export const CATEGORY_METADATA = {
  style: {
    title: '영상 스타일',
    icon: Palette,
    color: 'purple'
  },
  subject: {
    title: '촬영 주제',
    icon: Camera,
    color: 'green'
  },
  motion: {
    title: '카메라 움직임',
    icon: Video,
    color: 'blue'
  },
  constraints: {
    title: '특별 요구사항',
    icon: Settings,
    color: 'orange'
  }
};

// 카테고리별 색상 클래스 매핑
export const CATEGORY_COLOR_CLASSES = {
  style: {
    icon: 'text-purple-600 dark:text-purple-400',
    selected: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200',
    badge: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
  },
  subject: {
    icon: 'text-green-600 dark:text-green-400',
    selected: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
    badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  },
  motion: {
    icon: 'text-blue-600 dark:text-blue-400',
    selected: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    badge: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  },
  constraints: {
    icon: 'text-orange-600 dark:text-orange-400',
    selected: 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200',
    badge: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
  }
};