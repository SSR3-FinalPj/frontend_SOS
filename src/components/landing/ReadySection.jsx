import { motion } from 'framer-motion';
import { usePageStore } from '../../stores/page_store.js';
import Section from '../common/Section.jsx';

/**
 * 최종 CTA 섹션 컴포넌트
 */
export default function ReadySection() {
  const { setCurrentPage: set_current_page } = usePageStore();

  const go_to_login = () => {
    set_current_page('login');
  };

  return (
    <Section className="relative z-10">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
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

          <motion.button
            onClick={go_to_login}
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
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mt-20 pt-12 border-t border-gray-400/40 dark:border-white/20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">AI</span>
            </div>
            <span className="text-2xl font-light text-gray-800 dark:text-white">콘텐츠부스트</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">© 2025 콘텐츠부스트. 모든 권리 보유.</p>
        </motion.div>
      </div>
    </Section>
  );
}