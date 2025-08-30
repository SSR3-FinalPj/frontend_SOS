/**
 * 확인 모달 컴포넌트
 * 사용자의 확인이 필요한 작업에 대해 재사용 가능한 확인 다이얼로그를 제공
 */

import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/common/ui/button';

/**
 * ConfirmationModal 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 모달 열림/닫힘 상태
 * @param {Function} props.onClose - 모달 닫기 콜백 ('취소' 버튼)
 * @param {Function} props.onConfirm - 확인 콜백 ('확인' 버튼)
 * @param {string} props.title - 모달 제목
 * @param {string} props.message - 확인 메시지
 * @returns {JSX.Element} ConfirmationModal 컴포넌트
 */
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "확인", 
  message = "이 작업을 계속하시겠습니까?" 
}) => {
  // 확인 버튼 클릭 핸들러
  const handle_confirm = useCallback(() => {
    onConfirm();
    onClose(); // 확인 후 모달 닫기
  }, [onConfirm, onClose]);

  // ESC 키 핸들러
  const handle_key_down = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handle_key_down);
      return () => {
        document.removeEventListener('keydown', handle_key_down);
      };
    }
  }, [isOpen, handle_key_down]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001] p-4"
        onClick={onClose}
        onKeyDown={handle_key_down}
        tabIndex={-1}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 메인 콘텐츠 */}
          <div className="p-8 text-center">
            {/* 경고 아이콘 */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>

            {/* 제목 */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              {title}
            </h2>

            {/* 메시지 */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {message}
            </p>

            {/* 버튼 영역 */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 py-3 rounded-xl"
              >
                취소
              </Button>
              
              <Button
                onClick={handle_confirm}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
              >
                확인
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationModal;