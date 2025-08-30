/**
 * 쿠키 동의 배너 컴포넌트
 * 첫 방문 시 화면 하단에 표시되는 쿠키 동의 배너
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { Button } from '@/common/ui/button';

/**
 * CookieConsentBanner 컴포넌트
 * @returns {JSX.Element|null} 쿠키 동의 배너 컴포넌트
 */
const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 쿠키 동의 상태 확인
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  // 동의 처리 함수
  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ 
            y: 100, 
            opacity: 0,
            scale: 0.95,
            transition: { 
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="fixed bottom-0 left-0 right-0 z-[10002] p-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-2xl shadow-2xl p-6 border border-gray-700">
              <div className="flex items-start gap-4">
                {/* 쿠키 아이콘 */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* 텍스트 콘텐츠 */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">쿠키 사용 안내</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    본 웹사이트는 사용자 경험 개선과 서비스 최적화를 위해 쿠키를 사용합니다. 
                    계속 이용하시면 쿠키 사용에 동의하시는 것으로 간주됩니다.
                  </p>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* 확인 버튼 */}
                    <Button
                      onClick={handleAccept}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      확인
                    </Button>
                    
                    {/* 추가 정보 텍스트 */}
                    <span className="text-xs text-gray-400">
                      쿠키 정책에 대한 자세한 내용은 개인정보 처리방침을 확인해 주세요.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;