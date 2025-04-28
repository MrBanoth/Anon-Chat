import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'light' | 'dark' | 'system' | 'premium1' | 'premium2' | 'premium3';

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
