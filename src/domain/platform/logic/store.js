
import { create } from 'zustand';

const usePlatformStore = create((set) => ({
  platforms: {
    google: { connected: false, linked: false, loading: true },
    reddit: { connected: false, loading: true },
  },
  setPlatformStatus: (platform, status) =>
    set((state) => ({
      platforms: {
        ...state.platforms,
        [platform]: { ...state.platforms[platform], ...status, loading: false },
      },
    })),
  setPlatformLoading: (platform, loading) =>
    set((state) => ({
      platforms: {
        ...state.platforms,
        [platform]: { ...state.platforms[platform], loading },
      },
    })),
}));

export { usePlatformStore };
