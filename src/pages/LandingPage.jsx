import { use_dark_mode } from '../hooks/use_dark_mode.js';
import FloatingNav from '../components/common/FloatingNav.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import TransformSection from '../components/landing/TransformSection.jsx';
import ReadySection from '../components/landing/ReadySection.jsx';

/**
 * 랜딩 페이지 메인 컴포넌트
 */
export default function LandingPage() {
  // 다크모드 훅 사용
  use_dark_mode();

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