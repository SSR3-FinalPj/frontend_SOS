/**
 * Glass Card 컴포넌트
 * 투명한 글래스 모피즘 효과를 가진 카드 컴포넌트
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Glass Card 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 카드 내부 컨텐츠
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.hover - 호버 효과 여부
 * @returns {JSX.Element} Glass Card 컴포넌트
 */
const GlassCard = ({ 
  children, 
  className = "",
  hover = true 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`backdrop-blur-xl bg-gray-50/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default React.memo(GlassCard);
