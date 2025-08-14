import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Smartphone, 
  Video, 
  Camera, 
  Twitter, 
  BarChart3, 
  Brain, 
  MessageSquare, 
  Heart,
  Sparkles,
  Rocket,
  Clock,
  TrendingUp,
  Palette,
  Target,
  Mail,
  Phone,
  Moon,
  Sun,
  ChevronDown,
  ArrowRight,
  Play,
  Zap
} from 'lucide-react';
import { usePageStore } from '../stores/page_store.js';
// Placeholder for images - replace with actual image paths when available
const imgAi = "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=AI+Dashboard";
const img = "https://via.placeholder.com/600x400/EC4899/FFFFFF?text=Platform+View";
const imgAi1 = "https://via.placeholder.com/600x400/10B981/FFFFFF?text=Analytics";
const img1 = "https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Integration";
const img2 = "https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Insights";
const imgAi2 = "https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Automation";
const img3 = "https://via.placeholder.com/600x400/06B6D4/FFFFFF?text=Optimization";


// Glass card component for features
function GlassFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  index 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
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
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <motion.div 
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/40 dark:border-white/20 flex items-center justify-center mb-6"
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

// Enhanced section wrapper
function Section({ 
  children, 
  className = "",
  id
}) {
  return (
    <section id={id} className={`relative min-h-screen flex items-center justify-center py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {children}
      </div>
    </section>
  );
}

// Floating navigation
function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const { setCurrentPage, isDarkMode, setIsDarkMode } = usePageStore();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.95, 
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <motion.div 
          className="backdrop-blur-2xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl px-6 py-3 shadow-lg"
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              }}
              whileTap={{ 
                scale: 0.97,
                transition: { duration: 0.1 }
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-semibold">AI</span>
              </div>
              <span className="text-xl font-semibold text-gray-800 dark:text-white">콘텐츠부스트</span>
            </motion.div>

            {/* Navigation - 한국어로 변경 */}
            <div className="hidden md:flex items-center gap-6">
              <motion.button 
                onClick={() => scrollToSection('features')}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                기능
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('transform')}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                소개
              </motion.button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setIsDarkMode(!isDarkMode)}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
              
              <motion.button 
                onClick={goToLogin}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg font-medium"
              >
                시작하기
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}

// Hero Section - "기능 살펴보기" 버튼 제거
function HeroSection() {
  const { setCurrentPage } = usePageStore();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const goToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <Section>
      <motion.div
        ref={containerRef}
        style={{ opacity, scale, y }}
        className="text-center relative z-10"
      >
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
              콘텐츠의
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
              진화
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
            당신의 반응이 완성합니다.
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

        {/* CTA Button - 하나의 버튼만 유지 */}
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
          <motion.button
            onClick={goToLogin}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-5 rounded-xl text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-3"
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
          className="relative max-w-5xl mx-auto"
        >
          <motion.div
            whileHover={{ 
              scale: 1.02, 
              y: -8,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
            className="relative"
          >
            <img 
              src={imgAi} 
              alt="AI Dashboard Preview" 
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
            {/* Play button overlay */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 2, 
                duration: 0.6,
                type: "spring", 
                stiffness: 200,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.15, 
                  rotate: 5,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                }}
                whileTap={{ 
                  scale: 0.9,
                  transition: { duration: 0.1 }
                }}
                className="w-20 h-20 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
}

// Features Section with Glass Cards
function FeaturesSection() {
  const features = [
    {
      icon: Smartphone,
      title: "통합 관리",
      description: "모든 소셜 미디어 플랫폼을 하나의 대시보드에서 통합 관리하세요."
    },
    {
      icon: Brain,
      title: "AI 분석",
      description: "실시간 데이터 분석으로 콘텐츠 성과를 예측하고 최적화합니다."
    },
    {
      icon: Zap,
      title: "자동 최적화",
      description: "AI가 최적의 시간에 가장 효과적인 콘텐츠를 자동으로 발행합니다."
    }
  ];

  return (
    <Section id="features" className="relative z-10">
      <div className="text-center mb-20">
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

// Transform Section
function TransformSection() {
  const benefits = [
    {
      title: "깊이 있는 인사이트",
      description: "모든 채널의 데이터를 통합 분석해 숨겨진 가치를 발견합니다.",
      image: img2,
      icon: BarChart3
    },
    {
      title: "완전한 자동화",
      description: "AI가 콘텐츠 생성부터 발행까지 모든 과정을 자동화합니다.",
      image: imgAi2,
      icon: Rocket
    },
    {
      title: "실시간 최적화",
      description: "데이터 기반 인사이트로 실시간으로 전략을 조정합니다.",
      image: img3,
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
              viewport={{ once: true, margin: "-100px" }}
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

// Final CTA Section
function ReadySection() {
  const { setCurrentPage } = usePageStore();

  const goToLogin = () => {
    setCurrentPage('login');
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
            onClick={goToLogin}
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

// Main Component
export default function LandingInteractive() {
  const { isDarkMode, setIsDarkMode } = usePageStore();

  // Load preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('contentboost-dark-mode');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, [setIsDarkMode]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('contentboost-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);


  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Floating Navigation */}
      <FloatingNav />
      
      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <TransformSection />
        <ReadySection />
      </div>
    </div>
  );
}