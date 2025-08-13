import { useEffect, useState } from 'react';
import { tryRefreshOnBoot } from './src/lib/auth_bootstrap.js';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageStore } from './src/stores/page_store.js';
import LandingInteractive from './src/components/LandingInteractive.jsx';
import LoginPage from './src/pages/LoginPage.jsx';
import Dashboard from './src/pages/Dashboard.jsx';

export default function App() {
    const { currentPage, isDarkMode, setIsDarkMode, language, setLanguage, setCurrentPage } = usePageStore();
    const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await tryRefreshOnBoot();
      if (currentPage !== 'login') {
        setCurrentPage(ok ? 'dashboard' : 'landing');
      }
      setBootDone(true);
    })();
    }, []);
  // Initialize dark mode and language from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('contentboost-dark-mode');
    const savedLanguage = localStorage.getItem('contentboost-language');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [setIsDarkMode, setLanguage]);

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

  // Save language preference
  useEffect(() => {
    localStorage.setItem('contentboost-language', language);
  }, [language]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 1.01, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -20 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            <LandingInteractive />
          </motion.div>
        );
      case 'login':
        return (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 1.01, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -20 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            <LoginPage />
          </motion.div>
        );
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.01, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -20 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            <Dashboard />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!bootDone ? <div /> : renderCurrentPage()}
    </AnimatePresence>
  );
}