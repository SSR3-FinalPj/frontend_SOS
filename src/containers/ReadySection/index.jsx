import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '@/common/ui/Section';

/**
 * 최종 CTA 섹션 컴포넌트
 */
export default function ReadySection() {

  return (
    <Section className="relative z-10 pb-8">
      <div className="space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-120px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center space-y-4"
        >
          <h3 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Meaire가 지역 홍보의 새로운 기준이 됩니다.
          </h3>
          <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-200">
            단 한 장의 사진만 있어도 괜찮습니다. Meaire의 AI가 지역의 특색과 공공 데이터를 분석해 가장 주목받을 만한 숏폼 영상을 자동으로 생성하고, 클릭 한 번으로 여러 SNS 채널에 확산시킵니다. 이제 복잡한 실무는 Meaire에 맡기고, 담당자님은 더 넓은 그림을 그리는 데 집중하세요.
          </p>
        </motion.div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-100px' }}
            transition={{ 
              duration: 1, 
              ease: [0.16, 1, 0.3, 1],
              type: 'spring',
              stiffness: 100,
              damping: 15
            }}
          >
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
                className="px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl text-gray-900 dark:text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 backdrop-blur"
              >
                지금 시작하기
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
