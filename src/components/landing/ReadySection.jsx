import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../common/Section.jsx';

/**
 * 최종 CTA 섹션 컴포넌트
 */
export default function ReadySection() {

  return (
    <Section className="relative z-10 pb-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ 
            duration: 1, 
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-gray-800 dark:text-white mb-6">
            <span>시작할</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              준비가 되셨나요?
            </span>
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 font-light max-w-3xl mx-auto mb-12">
            지금 바로 콘텐츠 혁신을 경험해보세요
          </p>

          <Link to="/login">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 rounded-2xl text-xl font-medium transition-all duration-300 shadow-2xl hover:shadow-3xl"
            >
              지금 시작하기
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}