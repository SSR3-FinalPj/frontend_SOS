import { motion } from 'framer-motion';
import { Smartphone, Brain, Zap } from 'lucide-react';
import Section from '../../common/ui/Section.jsx';
import GlassFeatureCard from '../../common/ui/GlassFeatureCard.jsx';

/**
 * 기능 소개 섹션 컴포넌트
 */
export default function FeaturesSection() {
  const features = [
    {
      icon: Smartphone,
      title: "통합 관리",
      description: "소셜 미디어 플랫폼을 하나의 대시보드에서 통합 관리하세요."
    },
    {
      icon: Brain,
      title: "AI 분석",
      description: "실시간 데이터 분석으로 콘텐츠 성과를 예측하고 최적화합니다."
    },
    {
      icon: Zap,
      title: "자동 최적화",
      description: "AI가 최적의 시간에 콘텐츠를 자동으로 생성합니다."
    }
  ];

  return (
    <Section id="features" className="relative z-10">
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
            핵심 기능
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 font-light max-w-3xl mx-auto">
            세 가지 혁신으로 콘텐츠 관리가 달라집니다
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <GlassFeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
}