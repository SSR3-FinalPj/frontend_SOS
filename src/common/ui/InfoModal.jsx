/**
 * 정보 표시 모달 컴포넌트
 * 이용약관, 개인정보처리방침, FAQ 등을 표시하는 재사용 가능한 모달
 * 웹 접근성(a11y) 강화: Focus Trap, ARIA 속성, 키보드 지원
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/common/ui/button';

/**
 * InfoModal 컴포넌트
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} title - 모달 제목
 * @param {React.ReactNode} children - 모달 내용
 * @returns {JSX.Element|null} InfoModal 컴포넌트
 */
const InfoModal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);
  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  const contentId = `modal-content-${Math.random().toString(36).substr(2, 9)}`;
  
  // 복사 상태 관리
  const [copiedItems, setCopiedItems] = useState(new Set());

  // Focus Trap을 위한 focusable 요소들 관리
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    const focusableSelectors = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    return Array.from(
      modalRef.current.querySelectorAll(focusableSelectors.join(','))
    ).filter(element => !element.disabled);
  }, []);

  // Focus Trap 구현
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    // ESC 키로 모달 닫기
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    // Tab 키 Focus Trap
    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isOpen, onClose, getFocusableElements]);

  // 모달이 열릴 때 첫 번째 focusable 요소로 포커스 이동
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen, getFocusableElements]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // body 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // 복사 기능 구현 (강화된 버전)
  const handleCopy = async (text, itemKey) => {
    try {
      if (!text || text.trim() === '') {
        console.error('복사할 텍스트가 비어있습니다');
        return;
      }
      
      // Clipboard API 사용 시도
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 폴백: 구형 브라우저용 execCommand 사용
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopiedItems(prev => new Set([...prev, itemKey]));
      
      // 5초 후 복사 상태 초기화 (더 긴 피드백 시간)
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemKey);
          return newSet;
        });
      }, 5000);
    } catch (err) {
      console.error('복사 실패:', err);
      // 사용자에게 직접적인 피드백 제공
      alert('복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
    }
  };

  // 콘텐츠 렌더링 함수 (가독성 개선 및 FAQ 전체 복사 기능)
  const renderContentWithCopyButtons = (content) => {
    if (!content) return content;
    
    // FAQ 객체인 경우 content 문자열 추출
    const contentText = typeof content === 'object' && content.content ? content.content : content;
    if (typeof contentText !== 'string') return content;

    // FAQ인 경우 특별 처리
    if (title === '자주 묻는 질문 (FAQ)') {
      const lines = contentText.split('\n');
      return (
        <div className="space-y-6">
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            
            // 빈 줄 처리
            if (!trimmedLine) {
              return <div key={index} className="h-2"></div>;
            }
            
            // 섹션 제목 (## 로 시작)
            if (trimmedLine.startsWith('##')) {
              const sectionTitle = trimmedLine.substring(2).trim();
              return (
                <h3 key={index} className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                  {sectionTitle}
                </h3>
              );
            }
            
            // 질문 (Q: 또는 **Q: 로 시작)
            if (trimmedLine.startsWith('**Q:') || trimmedLine.startsWith('Q:')) {
              const question = trimmedLine.replace(/\*\*/g, '').replace('Q:', '').trim();
              return (
                <h4 key={index} className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-6 mb-2">
                  Q: {question}
                </h4>
              );
            }
            
            // 답변 (A: 로 시작)
            if (trimmedLine.startsWith('A:')) {
              const answer = trimmedLine.substring(2).trim();
              return (
                <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 pl-4 border-l-3 border-blue-200 dark:border-blue-800">
                  {answer}
                </p>
              );
            }
            
            // 일반 텍스트
            return (
              <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {trimmedLine}
              </p>
            );
          })}
        </div>
      );
    }

    // 다른 문서들 (이용약관, 개인정보처리방침) 가독성 개선
    const lines = contentText.split('\n');
    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          
          // 빈 줄 처리
          if (!trimmedLine) {
            return <div key={index} className="h-3"></div>;
          }
          
          // 조항 제목 (제X조 형태)
          if (/^제\d+조/.test(trimmedLine)) {
            return (
              <h3 key={index} className="text-lg font-bold text-gray-800 dark:text-white mt-6 mb-3 border-l-4 border-blue-500 pl-3">
                {trimmedLine}
              </h3>
            );
          }
          
          // 번호 리스트 (1. 또는 - 로 시작)
          if (/^\d+\./.test(trimmedLine) || trimmedLine.startsWith('-')) {
            return (
              <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-2 pl-4">
                {trimmedLine}
              </p>
            );
          }
          
          // 강조 텍스트 (▶ 로 시작)
          if (trimmedLine.startsWith('▶')) {
            return (
              <p key={index} className="text-base font-semibold text-blue-700 dark:text-blue-300 leading-relaxed mb-2">
                {trimmedLine}
              </p>
            );
          }
          
          // 부칙이나 마지막 정보
          if (trimmedLine.includes('부칙') || trimmedLine.includes('시행됩니다')) {
            return (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 italic">
                {trimmedLine}
              </p>
            );
          }
          
          // 일반 텍스트
          return (
            <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {trimmedLine}
            </p>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001] p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={contentId}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 
              id={titleId}
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              {title}
            </h2>
            <Button
              onClick={onClose}
              className="w-8 h-8 p-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full"
              aria-label="모달 닫기"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>

          {/* FAQ 전체 복사 버튼 (FAQ일 때만 표시) */}
          {title === '자주 묻는 질문 (FAQ)' && (
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button
                onClick={() => {
                  const copyText = (typeof children === 'object' && children.llm_copy_text) || '';
                  handleCopy(copyText, 'full-faq');
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300 transform ${
                  copiedItems.has('full-faq')
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 scale-105 shadow-lg border-2 border-green-300 dark:border-green-600'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105 shadow-md border border-blue-200 dark:border-blue-700'
                }`}
                aria-label={copiedItems.has('full-faq') ? '복사 완료' : '전체 FAQ 복사'}
              >
                {copiedItems.has('full-faq') ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span className="font-semibold">복사 완료! 🎉</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>전체 FAQ 복사 (LLM용)</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* 모달 내용 - 스크롤 가능 */}
          <div 
            id={contentId}
            className="flex-1 overflow-y-auto p-6"
          >
            {renderContentWithCopyButtons(children)}
          </div>

          {/* 모달 푸터 */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-xl"
            >
              확인
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default InfoModal;