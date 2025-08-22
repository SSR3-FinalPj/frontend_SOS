import { create } from "zustand";

export const useYouTubeStore = create((set) => ({
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
}));
