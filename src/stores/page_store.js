import { create } from 'zustand';

export const usePageStore = create((set) => ({
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),
  isDarkMode: false,
  setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
  language: 'ko',
  setLanguage: (lang) => set({ language: lang }),
}));