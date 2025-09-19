/**
 * 콘텐츠 론칭 관련 유틸리티 함수들
 */

import React from 'react';
import { 
  Play, 
  FileText, 
  Image, 
  MessageSquare, 
  CheckCircle2, 
  Upload, 
  Clock, 
  Loader2,
  Globe,
  AlertTriangle
} from 'lucide-react';

/**
 * 콘텐츠 타입에 따른 아이콘 반환
 * @param {string} type - 콘텐츠 타입 ('video', 'image', 'text')
 * @returns {JSX.Element} 아이콘 컴포넌트
 */
export const get_type_icon = (type) => {
  switch (type) {
    case 'video': return <Play className="h-4 w-4" />;
    case 'image': return <Image className="h-4 w-4" />;
    case 'text': return <FileText className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

/**
 * 플랫폼에 따른 색상 클래스 반환
 * @param {string} platform - 플랫폼 이름
 * @returns {string} Tailwind CSS 클래스
 */
export const get_platform_color = (platform) => {
  switch (platform) {
    case 'youtube': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'reddit': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'instagram': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  }
};

/**
 * 플랫폼에 따른 아이콘 반환
 * @param {string} platform - 플랫폼 이름
 * @returns {JSX.Element} 아이콘 컴포넌트
 */
export const get_platform_icon = (platform) => {
  switch (platform) {
    case 'youtube': return <Play className="h-5 w-5" />;
    case 'reddit': return <MessageSquare className="h-5 w-5" />;
    case 'instagram': return <Image className="h-5 w-5" />;
    default: return <Globe className="h-5 w-5" />;
  }
};

/**
 * 상태에 따른 아이콘 반환
 * @param {string} status - 상태 ('ready', 'uploading', 'uploaded', 'failed')
 * @param {string} item_id - 아이템 ID
 * @param {Array} uploading_items - 업로드 중인 아이템 목록
 * @returns {JSX.Element} 아이콘 컴포넌트
 */
export const get_status_icon = (status, item_id, uploading_items = []) => {
  const normalized_status = typeof status === 'string' ? status.toUpperCase() : '';

  if (uploading_items.includes(item_id)) {
    return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
  }

  switch (normalized_status) {
    case 'UPLOADED':
    case 'COMPLETED':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'READY':
    case 'READY_TO_LAUNCH':
      return <Upload className="h-4 w-4 text-blue-500" />;
    case 'FAILED':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'PROCESSING':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

/**
 * 상태에 따른 툴팁 텍스트 반환
 * @param {string} status - 상태
 * @returns {string} 툴팁 텍스트
 */
export const get_status_tooltip = (status) => {
  const normalized_status = typeof status === 'string' ? status.toUpperCase() : '';

  switch (normalized_status) {
    case 'PENDING':
      return '대기 중';
    case 'PROCESSING':
      return '처리 중';
    case 'READY':
    case 'READY_TO_LAUNCH':
    case 'COMPLETED':
      return '론칭 준비됨';
    case 'UPLOADING':
      return '업로드 중';
    case 'UPLOADED':
      return '업로드 완료';
    case 'FAILED':
      return '생성 실패';
    default:
      return '상태 불명';
  }
};

/**
 * 콘텐츠 타입에 따른 한글 이름 반환
 * @param {string} type - 콘텐츠 타입
 * @returns {string} 한글 이름
 */
export const get_content_type_label = (type) => {
  switch (type) {
    case 'video': return '비디오';
    case 'image': return '이미지';
    case 'text': return '텍스트';
    default: return '알 수 없음';
  }
};

/**
 * 플랫폼 목록 반환
 * @returns {Array} 플랫폼 목록
 */
export const get_platform_list = () => [
  'youtube',
  'reddit', 
];
