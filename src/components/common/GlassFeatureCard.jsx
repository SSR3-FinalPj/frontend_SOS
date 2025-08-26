import { motion } from 'framer-motion';
import { useBlurEffect } from '../../hooks/useBlurEffect.js';

/**
 * 글래스 스타일 기능 카드 컴포넌트
 * @param {object} props
 * @param {React.Component} props.icon - 아이콘 컴포넌트
 * @param {string} props.title - 카드 제목
 * @param {string} props.description - 카드 설명
 * @param {number} props.index - 애니메이션용 인덱스
 */
export default function GlassFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  index 
}) {
  const { getBlur } = useBlurEffect();
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15, 
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }}
      className="group"
    >
      <div className={`${getBlur('xl')} bg-white/30 dark:bg-white/10 border border-white/30 dark:border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500`}>
        <motion.div 
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 ${getBlur('sm')} border border-white/40 dark:border-white/20 flex items-center justify-center mb-6`}
          whileHover={{ 
            scale: 1.15, 
            rotate: 5,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}