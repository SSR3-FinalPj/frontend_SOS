/**
 * 랜딩 페이지 푸터 컴포넌트
 * 서비스 정보, 법적 안내 링크를 포함하는 푸터
 */

import { motion } from 'framer-motion';
import { LEGAL_TEXTS } from '@/common/constants/legal-texts';

/**
 * Footer 컴포넌트
 * @param {function} on_open_modal - 모달 열기 함수
 * @returns {JSX.Element} Footer 컴포넌트
 */
export default function Footer({ on_open_modal }) {
  // 모달 열기 핸들러들
  const handle_terms_click = () => {
    on_open_modal(LEGAL_TEXTS.TERMS_OF_SERVICE.title, LEGAL_TEXTS.TERMS_OF_SERVICE.content);
  };

  const handle_privacy_click = () => {
    on_open_modal(LEGAL_TEXTS.PRIVACY_POLICY.title, LEGAL_TEXTS.PRIVACY_POLICY.content);
  };

  const handle_faq_click = () => {
    // FAQ는 복사 기능을 위해 특별히 처리
    on_open_modal(LEGAL_TEXTS.FAQ.title, LEGAL_TEXTS.FAQ);
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="mt-16 pt-12 pb-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700"
    >
      <div className="text-center">
        {/* 로고 및 브랜드 */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <span className="text-2xl font-light text-gray-800 dark:text-white">콘텐츠부스트</span>
        </div>

        {/* 법적 링크들 */}
        <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
          <button
            onClick={handle_terms_click}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 underline-offset-4 hover:underline"
            aria-label="서비스 이용 안내 보기"
          >
            서비스 이용 안내
          </button>
          
          <span className="text-gray-400 dark:text-gray-600">•</span>
          
          <button
            onClick={handle_privacy_click}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 underline-offset-4 hover:underline"
            aria-label="개인정보 처리방침 보기"
          >
            개인정보 처리방침
          </button>
          
          <span className="text-gray-400 dark:text-gray-600">•</span>
          
          <button
            onClick={handle_faq_click}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 underline-offset-4 hover:underline"
            aria-label="자주 묻는 질문 보기"
          >
            FAQ
          </button>
        </div>

        {/* 저작권 정보 */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          © 2025 콘텐츠부스트. 모든 권리 보유.
        </p>

        {/* 프로젝트 정보 */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          SK 쉴더스 루키즈 3기 1팀 교육용 프로젝트
        </p>
      </div>
    </motion.footer>
  );
}