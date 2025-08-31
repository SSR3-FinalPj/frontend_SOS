import { useState } from 'react';
import { use_dark_mode } from '@/common/hooks/use-dark-mode';
import FloatingNav from '@/common/ui/FloatingNav';
import InfoModal from '@/common/ui/InfoModal';

// FSD Blocks 조합
import HeroSection from '@/containers/HeroSection';
import FeaturesSection from '@/containers/FeaturesSection';
import TransformSection from '@/containers/TransformSection';
import ReadySection from '@/containers/ReadySection';
import Footer from '@/containers/Footer';

/**
 * LandingPage 페이지
 * 랜딩 페이지 - FSD 아키텍처의 조립 레이어
 */
export default function LandingPage() {
  // 다크모드 훅 사용
  use_dark_mode();
  
  // InfoModal 상태 관리
  const [modal_is_open, set_modal_is_open] = useState(false);
  const [modal_title, set_modal_title] = useState('');
  const [modal_content, set_modal_content] = useState('');

  // 모달 핸들러
  const handle_open_modal = (title, content) => {
    set_modal_title(title);
    set_modal_content(content);
    set_modal_is_open(true);
  };

  const handle_close_modal = () => {
    set_modal_is_open(false);
    set_modal_title('');
    set_modal_content('');
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      <FloatingNav />
      
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <TransformSection />
        <ReadySection />
        <Footer on_open_modal={handle_open_modal} />
      </div>

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