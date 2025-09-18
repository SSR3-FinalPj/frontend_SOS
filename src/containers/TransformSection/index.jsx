import { motion } from 'framer-motion';
import { AlertTriangle, Clock, BarChart3, Target, Sparkles, Share2, PieChart } from 'lucide-react';
import Section from '@/common/ui/Section';

/**
 * 지역 홍보 문제/해결/핵심 기능 소개 섹션
 */
export default function TransformSection() {
  const painPoints = [
    {
      icon: AlertTriangle,
      title: '아이디어 고갈',
      body: '"매력적인 홍보 아이템, 더 이상 찾기 힘드신가요?"'
    },
    {
      icon: Clock,
      title: '예산과 시간 부족',
      body: '"한정된 예산과 시간 때문에 영상 제작, 엄두도 못 내고 계신가요?"'
    },
    {
      icon: BarChart3,
      title: '성과 측정의 어려움',
      body: '"만들기만 하고 끝? 어떤 콘텐츠가 인기 있었는지 성과 측정이 막막하신가요?"'
    },
    {
      icon: Target,
      title: '타겟 고객 소통',
      body: '"MZ세대에게 통하는 트렌디한 홍보, 어떻게 시작해야 할지 모르시겠나요?"'
    }
  ];

  const coreFeatures = [
    {
      icon: Sparkles,
      title: 'AI 영상 자동 생성',
      description: '대표 이미지와 간단한 키워드만 입력하면, AI가 지역 특색을 살린 숏폼 영상을 여러 개 제안합니다.'
    },
    {
      icon: Share2,
      title: '원클릭 SNS 동시 배포',
      description: '완성된 영상을 YouTube, Reddit 등 원하는 채널에 한 번에 업로드하고 관리할 수 있습니다.'
    },
    {
      icon: PieChart,
      title: '성과 분석 대시보드',
      description: '어떤 영상이 인기였는지, 주 시청자는 누구인지 직관적인 데이터로 확인하세요.'
    }
  ];

  return (
    <Section id="transform" className="relative z-10">
      {/* Problem Section */}
      <div className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl lg:text-6xl font-semibold tracking-tight text-[#17171B] dark:text-gray-100 mb-6">
            혹시, 이런 고민하고 계신가요?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-blue-100/60 dark:border-blue-200/10 bg-white/80 dark:bg-gray-900/40 backdrop-blur-lg p-8 shadow-xl"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {painPoints.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-200/80 to-purple-200/80 border border-blue-200/40 dark:border-blue-200/20 flex items-center justify-center text-blue-700 dark:text-blue-200">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[#17171B] dark:text-gray-100">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Solution Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/40 dark:border-blue-200/20 backdrop-blur-lg p-10 mb-20 shadow-xl"
      >
        <h3 className="text-4xl font-semibold text-[#17171B] dark:text-gray-100 mb-4">
          Meaire가 지역 홍보의 새로운 기준이 됩니다.
        </h3>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-200">
          단 한 장의 사진만 있어도 괜찮습니다. Me-aire의 AI가 지역의 특색과 공공 데이터를 분석해
          가장 주목받을 만한 숏폼 영상을 자동으로 생성하고, 클릭 한 번으로 여러 SNS 채널에
          확산시킵니다. 이제 복잡한 실무는 Meaire에 맡기고, 담당자님은 더 넓은 그림을 그리는 데 집중하세요.
        </p>
      </motion.div>

      {/* Core Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h3 className="text-5xl font-semibold mb-4 text-[#17171B] dark:text-gray-100">
          Me-aire의 핵심 기능
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          공공 홍보 담당자를 위한 맞춤 기능으로 영상 제작부터 성과 분석까지 한 번에 해결합니다.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {coreFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-120px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-3xl border border-blue-100/60 dark:border-blue-200/10 bg-white/80 dark:bg-gray-900/50 backdrop-blur-lg p-6 shadow-lg text-left space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-200/80 to-blue-200/80 border border-blue-200/40 dark:border-blue-200/20 flex items-center justify-center text-purple-700 dark:text-purple-200">
              <feature.icon className="w-5 h-5" />
            </div>
            <h4 className="text-2xl font-semibold text-[#17171B] dark:text-gray-100">{feature.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
