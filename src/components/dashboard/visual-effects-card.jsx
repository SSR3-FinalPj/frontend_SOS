/**
 * Visual Effects Card 컴포넌트
 * 시각 효과 및 블러 설정을 관리하는 카드
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Monitor, Zap, Palette } from 'lucide-react';
import { useBlurEffect } from '../../hooks/useBlurEffect.js';

/**
 * VisualEffectsCard 컴포넌트
 * @returns {JSX.Element} 시각 효과 설정 카드
 */
export const VisualEffectsCard = () => {
  const {
    blurIntensity,
    performanceMode,
    isLargeScreen,
    screenSize,
    setBlurIntensity,
    setPerformanceMode,
    getBlur
  } = useBlurEffect();

  const [showPreview, setShowPreview] = useState(false);

  const blurOptions = [
    { value: 'auto', label: '자동', description: '화면 크기에 따라 최적화', icon: Monitor },
    { value: 'low', label: '낮음', description: '최소한의 블러 효과', icon: Eye },
    { value: 'medium', label: '보통', description: '균형잡힌 시각 효과', icon: Palette },
    { value: 'high', label: '높음', description: '강력한 글래스모피즘', icon: EyeOff }
  ];

  const handleBlurChange = (value) => {
    setBlurIntensity(value);
  };

  const handlePerformanceModeToggle = () => {
    setPerformanceMode(!performanceMode);
  };

  return (
    <div className="lg:col-span-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`${getBlur('md')} bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 rounded-3xl p-8 shadow-xl`}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">시각 효과</h3>
            <p className="text-gray-600 dark:text-gray-300">블러 효과 및 성능 설정을 조정하세요</p>
          </div>
        </div>

        {/* 현재 상태 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">화면 크기</div>
            <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              {screenSize === 'mobile' && '모바일'}
              {screenSize === 'tablet' && '태블릿'}  
              {screenSize === 'desktop' && (isLargeScreen ? '대형 데스크톱' : '데스크톱')}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4">
            <div className="text-sm font-medium text-green-700 dark:text-green-300">블러 모드</div>
            <div className="text-lg font-semibold text-green-800 dark:text-green-200">
              {blurOptions.find(opt => opt.value === blurIntensity)?.label || '사용자 설정'}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-4">
            <div className="text-sm font-medium text-orange-700 dark:text-orange-300">성능 모드</div>
            <div className="text-lg font-semibold text-orange-800 dark:text-orange-200">
              {performanceMode ? '활성화' : '비활성화'}
            </div>
          </div>
        </div>

        {/* 블러 강도 설정 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">블러 강도 설정</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blurOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = blurIntensity === option.value;
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleBlurChange(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isSelected 
                      ? 'border-blue-500/50 bg-blue-500/10 dark:bg-blue-400/10' 
                      : 'border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300/50 dark:hover:border-blue-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={`font-semibold ${isSelected ? 'text-blue-800 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'}`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 성능 모드 토글 */}
        <div className="mb-8">
          <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200/50 dark:border-yellow-600/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">성능 모드</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  블러 효과를 최소화하여 성능을 최적화합니다
                </p>
              </div>
            </div>
            <motion.button
              onClick={handlePerformanceModeToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                performanceMode 
                  ? 'bg-green-500 dark:bg-green-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: performanceMode ? 24 : 2 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </div>

        {/* 미리보기 토글 */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">실시간 미리보기</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              현재 설정이 이 카드에 실시간으로 적용됩니다
            </p>
          </div>
          <motion.button
            onClick={() => setShowPreview(!showPreview)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition-colors duration-300"
          >
            {showPreview ? '미리보기 끄기' : '미리보기 켜기'}
          </motion.button>
        </div>

        {/* 미리보기 영역 */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 overflow-hidden"
          >
            <div className={`${getBlur('xl')} bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/30 dark:border-gray-600/30 rounded-2xl p-6`}>
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">미리보기 영역</h5>
              <p className="text-gray-600 dark:text-gray-300">
                현재 블러 설정이 이 영역에 적용되어 있습니다. 설정을 변경해보며 효과를 확인해보세요.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map((intensity) => (
                  <div
                    key={intensity}
                    className={`${getBlur(intensity)} bg-white/30 dark:bg-gray-700/30 rounded-xl p-3 text-center`}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {intensity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VisualEffectsCard;