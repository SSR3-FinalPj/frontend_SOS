import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IMAGE_PATHS } from '@/common/constants/image-paths';
import Section from '@/common/ui/Section';

/**
 * 히어로 섹션 컴포넌트
 */
export default function HeroSection() {

  return (
    <Section>
      <div className="text-center relative z-10">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.3, 
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <h1 className="text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight mb-6">
            <motion.span 
              className="text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              콘텐츠의 진화
            </motion.span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.7, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              Meaire
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-8 font-light max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.9, 
              ease: [0.16, 1, 0.3, 1] 
            }}
          >
            세상의 반응을 듣고 완성합니다.
          </motion.p>
          
          <motion.p 
            className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.1, 
              ease: [0.16, 1, 0.3, 1] 
            }}
          >
            AI가 실시간 데이터를 분석하여 가장 트렌디한 콘텐츠를 만들고, 모든 SNS 채널의 반응을 하나로 모아 분석합니다.
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.3,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="flex justify-center items-center mb-16"
        >
          <Link to="/login">
            <motion.button
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
            className="px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-3 text-gray-900 dark:text-white bg-gradient-to-r from-[#d7e3ff] to-[#eadfff] border border-[#c2d1ff] hover:from-[#ccdbff] hover:to-[#e2d5ff]"
          >
            지금 시작하기
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
          </Link>
        </motion.div>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            delay: 1.5,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ 
              scale: 1.02, 
              y: -8,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
            className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
            style={{ aspectRatio: '16/9' }}
          >
            <img 
              src={IMAGE_PATHS.hero_section} 
              alt="AI Dashboard Preview" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}