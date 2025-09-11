import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMediaRequestStore = create(
  persist(
    (set, get) => ({
      lastVideoRequest: null,
      setLastVideoRequest: (requestData) => set({ lastVideoRequest: requestData }),
      clearLastVideoRequest: () => set({ lastVideoRequest: null }),
      
      getLastRequestInfo: () => {
        const { lastVideoRequest } = get();
        return lastVideoRequest;
      },
    }),
    {
      name: 'meaire-media-request-store',
      partialize: (state) => ({ lastVideoRequest: state.lastVideoRequest }),
    }
  )
);