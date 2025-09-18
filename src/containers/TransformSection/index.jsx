import { motion } from 'framer-motion';
import Section from '@/common/ui/Section';
import aiGenerateGif from '@/assets/images/LandingImg/AI_gen.gif';
import uploadGif from '@/assets/images/LandingImg/upload.gif';
import analysisGif from '@/assets/images/LandingImg/analysis.gif';

/**
 * 지역 홍보 문제/해결/핵심 기능 소개 섹션
 */
export default function TransformSection() {
  const coreFeatures = [
    {
      title: 'AI 영상 자동 생성',
      description: '대표 이미지와 간단한 키워드만 입력하면, AI가 지역 특색을 살린 숏폼 영상을 여러 개 제안합니다.',
      media: aiGenerateGif,
      mediaAlt: 'AI가 제안한 숏폼 영상 샘플 애니메이션'
    },
    {
      title: '원클릭 SNS 동시 배포',
      description: '완성된 영상을 YouTube, Reddit 등 원하는 채널에 한 번에 업로드하고 관리할 수 있습니다.',
      media: uploadGif,
      mediaAlt: '여러 SNS 채널에 동시에 업로드하는 과정 애니메이션'
    },
    {
      title: '성과 분석 대시보드',
      description: '어떤 영상이 인기였는지, 주 시청자는 누구인지 직관적인 데이터로 확인하세요.',
      media: analysisGif,
      mediaAlt: '성과 분석 대시보드 미리보기 애니메이션'
    }
  ];

  return (
    <Section id="transform" className="relative z-10">
      {/* Core Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h3 className="text-5xl font-semibold mb-4 text-[#17171B] dark:text-gray-100">
          Meaire의 핵심 기능
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          공공 홍보 담당자를 위한 맞춤 기능으로 영상 제작부터 성과 분석까지 한 번에 해결합니다.
        </p>
      </motion.div>

      <div className="space-y-16">
        {coreFeatures.map((feature, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-120px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid gap-6 md:grid-cols-2 md:items-center"
            >
              <div
                className={`rounded-3xl border border-blue-100/60 dark:border-blue-200/10 bg-white dark:bg-gray-900 overflow-hidden shadow-lg ${
                  isEven ? 'order-1' : 'order-1 md:order-2'
                }`}
              >
                <img
                  src={feature.media}
                  alt={feature.mediaAlt}
                  className="block w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div
                className={`space-y-3 text-left ${
                  isEven ? 'order-2' : 'order-2 md:order-1'
                }`}
              >
                <h4 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
