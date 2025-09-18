import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { usePageStore } from '@/common/stores/page-store';
import { MeaireLogo } from '@/common/ui/meaire-logo';

/**
 * 플로팅 네비게이션 컴포넌트
 */
export default function FloatingNav() {
  const [is_scrolled, set_is_scrolled] = useState(false);
  const { isDarkMode: is_dark_mode, setIsDarkMode: set_is_dark_mode } = usePageStore();

  // 쓰로틀링을 위한 함수
  const throttle = useCallback((func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // 스크롤 핸들러
  const handle_scroll = useCallback(() => {
    const scroll_position = window.pageYOffset;
    set_is_scrolled(scroll_position > 50);
  }, []);

  useEffect(() => {
    const throttled_scroll = throttle(handle_scroll, 16); // 60fps
    
    window.addEventListener('scroll', throttled_scroll, { passive: true });
    return () => window.removeEventListener('scroll', throttled_scroll);
  }, [throttle, handle_scroll]);

  const scroll_to_section = (section_id) => {
    const element = document.getElementById(section_id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    >
      <div className="w-full">
        <motion.div 
          className={`transition-all duration-500 ease-out px-6 lg:px-8 py-4 ${
            is_scrolled 
              ? 'backdrop-blur-3xl bg-white/30 dark:bg-gray-900/30 border-b border-white/50 dark:border-gray-700/50 shadow-lg' 
              : 'backdrop-blur-xl bg-white/10 dark:bg-white/5 border-b border-white/20 dark:border-white/10 shadow-sm'
          }`}
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <div className="flex items-center justify-start w-full">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
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
                <MeaireLogo size={32} showText={true} variant={is_dark_mode ? 'dark' : 'light'} />
              </motion.div>

              {/* Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <motion.button 
                  onClick={() => scroll_to_section('features')}
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
                  onClick={() => scroll_to_section('transform')}
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
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => set_is_dark_mode(!is_dark_mode)}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
              >
                {is_dark_mode ? (
                  <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
              
              <Link to="/login">
                <motion.button 
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2 rounded-lg transition-all duration-300 shadow-lg font-medium text-gray-900 dark:text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30"
                >
                  시작하기
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
