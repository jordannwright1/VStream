import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("vstream-theme") || "aqua",
  setTheme: (theme) => {
    localStorage.setItem("vstream-theme", theme);
    set({ theme });
  },
}))
