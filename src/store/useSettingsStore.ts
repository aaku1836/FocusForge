import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppTheme = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: AppTheme;
  language: string;
  taskRemindersEnabled: boolean;
  pomodoroAlertsEnabled: boolean;
  defaultPostponeDuration: number; // in minutes
  use24HourFormat: boolean;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: string) => void;
  setTaskRemindersEnabled: (enabled: boolean) => void;
  setPomodoroAlertsEnabled: (enabled: boolean) => void;
  setDefaultPostponeDuration: (duration: number) => void;
  setUse24HourFormat: (use24h: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark', // the app is dark-first
      language: 'en',
      taskRemindersEnabled: true,
      pomodoroAlertsEnabled: true,
      defaultPostponeDuration: 5,
      use24HourFormat: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTaskRemindersEnabled: (enabled) => set({ taskRemindersEnabled: enabled }),
      setPomodoroAlertsEnabled: (enabled) => set({ pomodoroAlertsEnabled: enabled }),
      setDefaultPostponeDuration: (duration) => set({ defaultPostponeDuration: duration }),
      setUse24HourFormat: (use24h) => set({ use24HourFormat: use24h }),
    }),
    {
      name: 'focus-forge-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
