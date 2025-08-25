import { useState } from 'react';
import { use_dark_mode } from '../hooks/use_dark_mode.js';
import FloatingNav from '../components/common/FloatingNav.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import TransformSection from '../components/landing/TransformSection.jsx';
import ReadySection from '../components/landing/ReadySection.jsx';
import Footer from '../components/landing/Footer.jsx';
import InfoModal from '../components/common/InfoModal.jsx';

/**
 * 랜딩 페이지 메인 컴포넌트
 */
export default function LandingPage() {
  // 다크모드 훅 사용
  use_dark_mode();
  
  // InfoModal 상태 관리
  const [modal_is_open, set_modal_is_open] = useState(false);
  const [modal_title, set_modal_title] = useState('');
  const [modal_content, set_modal_content] = useState('');

  // 모달 열기 핸들러
  const handle_open_modal = (title, content) => {
    set_modal_title(title);
    set_modal_content(content);
    set_modal_is_open(true);
  };

  // 모달 닫기 핸들러
  const handle_close_modal = () => {
    set_modal_is_open(false);
    set_modal_title('');
    set_modal_content('');
  };

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
        <Footer on_open_modal={handle_open_modal} />
      </div>

      {/* Info Modal */}
      <InfoModal
        isOpen={modal_is_open}
        onClose={handle_close_modal}
        title={modal_title}
      >
        {modal_content}
      </InfoModal>
    </div>
  );
}