import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { usePageStore } from '../../stores/page_store.js';

/**
 * 플로팅 네비게이션 컴포넌트
 */
export default function FloatingNav() {
  const [is_visible, set_is_visible] = useState(false);
  const { setCurrentPage: set_current_page, isDarkMode: is_dark_mode, setIsDarkMode: set_is_dark_mode } = usePageStore();

  useEffect(() => {
    const toggle_visibility = () => {
      if (window.pageYOffset > 100) {
        set_is_visible(true);
      } else {
        set_is_visible(false);
      }
    };

    window.addEventListener('scroll', toggle_visibility);
    return () => window.removeEventListener('scroll', toggle_visibility);
  }, []);

  const scroll_to_section = (section_id) => {
    const element = document.getElementById(section_id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const go_to_login = () => {
    set_current_page('login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ 
        opacity: is_visible ? 1 : 0.95, 
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="w-full px-6 lg:px-8 py-4">
        <motion.div 
          className="backdrop-blur-2xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl px-6 py-3 shadow-lg"
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">AI</span>
                </div>
                <span className="text-xl font-semibold text-gray-800 dark:text-white">콘텐츠부스트</span>
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
              
              <motion.button 
                onClick={go_to_login}
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