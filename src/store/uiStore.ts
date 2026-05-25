import { create } from "zustand";

interface UIState {
  bannerVisible: boolean;
  dismissBanner: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  bannerVisible: true,
  dismissBanner: () => set({ bannerVisible: false }),
}));
