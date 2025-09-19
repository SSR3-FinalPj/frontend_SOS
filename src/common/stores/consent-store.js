import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConsentStore = create(
  persist(
    (set, get) => ({
      cookieConsent: false,
      setCookieConsent: (consent) => set({ cookieConsent: consent }),
      
      hasCookieConsent: () => {
        const { cookieConsent } = get();
        return cookieConsent;
      },
    }),
    {
      name: 'meaire-consent-store',
      partialize: (state) => ({ cookieConsent: state.cookieConsent }),
    }
  )
);