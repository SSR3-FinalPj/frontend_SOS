import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePageStore = create(
  persist(
    (set) => ({
      currentPage: 'landing',
      setCurrentPage: (page) => set({ currentPage: page }),
      isDarkMode: false,
      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
    }),
    {
      name: 'meaire-page-store',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);