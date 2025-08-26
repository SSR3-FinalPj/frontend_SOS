import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useYouTubeStore = create(
  persist(
    (set) => ({
      channelId: null,
      channelTitle: null,
      setChannelInfo: (info) =>
        set((state) => ({
          ...state,
          channelId: info.channelId,
          channelTitle: info.channelTitle,
        })),
      clearChannelInfo: () =>
        set((state) => ({
          ...state,
          channelId: null,
          channelTitle: null,
        })),
    }),
    {
      name: 'youtube-channel-storage', // name of the item in the storage (must be unique)
    }
  )
);
