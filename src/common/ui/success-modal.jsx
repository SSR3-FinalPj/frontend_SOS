/**
 * 성공 메시지 모달 컴포넌트
 * 성공적인 작업 완료를 사용자에게 알리는 간단한 모달
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/common/ui/button';

/**
 * SuccessModal 컴포넌트
 * @param {boolean} is_open - 모달 표시 여부
 * @param {function} on_close - 모달 닫기 함수
 * @param {string} message - 표시할 성공 메시지
 * @param {string} [title] - 모달 제목 (선택사항)
 * @returns {JSX.Element|null} SuccessModal 컴포넌트
 */
const SuccessModal = ({ is_open, on_close, message, title = '성공!' }) => {
  if (!is_open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001] p-4"
        onClick={on_close}
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
            {/* 성공 아이콘 */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
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

            {/* 확인 버튼 */}
            <Button
              onClick={on_close}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg"
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

export default SuccessModal;