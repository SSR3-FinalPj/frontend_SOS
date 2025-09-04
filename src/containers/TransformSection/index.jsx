import { motion } from 'framer-motion';
import { BarChart3, Rocket, Target } from 'lucide-react';
import { IMAGE_PATHS } from '@/common/constants/image-paths';
import Section from '@/common/ui/Section';

/**
 * 변화 소개 섹션 컴포넌트
 */
export default function TransformSection() {
  const benefits = [
    {
      title: "깊이 있는 인사이트",
      description: "모든 채널의 데이터를 통합 분석해 숨겨진 가치를 발견합니다.",
      image: IMAGE_PATHS.insight,
      icon: BarChart3
    },
    {
      title: "완전한 자동화",
      description: "AI가 콘텐츠 생성부터 발행까지 모든 과정을 자동화합니다.",
      image: IMAGE_PATHS.automation,
      icon: Rocket
    },
    {
      title: "실시간 최적화",
      description: "데이터 기반 인사이트로 실시간으로 전략을 조정합니다.",
      image: IMAGE_PATHS.optimization,
      icon: Target
    }
  ];

  return (
    <Section id="transform" className="relative z-10">
      {/* Section Header */}
      <div className="text-center mb-20">
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
            <span>모든 것을</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              바꿉니다
            </span>
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 font-light max-w-3xl mx-auto">
            소셜 미디어 관리의 새로운 표준
          </p>
        </motion.div>
      </div>

      {/* Benefits Grid */}
      <div className="grid lg:grid-cols-3 gap-12">
        {benefits.map((benefit, index) => {
          const { icon: Icon } = benefit;
          return (
            <motion.div
              key={index}
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
                y: -15,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
              }}
              className="group"
            >
              {/* Image */}
              <div className="relative h-64 mb-8 overflow-hidden rounded-3xl">
                <motion.img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="w-full h-full object-cover"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                  }}
                />
                <motion.div 
                  className="absolute top-6 left-6 w-12 h-12 backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-3xl font-light text-gray-800 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}