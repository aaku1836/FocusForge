import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuickTask, PomodoroSettings } from '../types';

interface PomodoroQuickTaskState {
  quickTasks: QuickTask[];
  addQuickTask: (name: string) => void;
  deleteQuickTask: (id: string) => void;
  reorderQuickTasks: (tasks: QuickTask[]) => void;
  
  pomodoroSettings: PomodoroSettings;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultPomodoroSettings: PomodoroSettings = {
  workSessionDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 20,
  cyclesPerSet: 4,
};

export const usePomodoroStore = create<PomodoroQuickTaskState>()(
  persist(
    (set) => ({
      quickTasks: [],
      addQuickTask: (name) =>
        set((state) => {
          const newTask: QuickTask = {
            id: generateId(),
            name,
            order: state.quickTasks.length,
          };
          return { quickTasks: [...state.quickTasks, newTask] };
        }),
      deleteQuickTask: (id) =>
        set((state) => ({
          quickTasks: state.quickTasks.filter((t) => t.id !== id),
        })),
      reorderQuickTasks: (tasks) => set({ quickTasks: tasks }),

      pomodoroSettings: defaultPomodoroSettings,
      updatePomodoroSettings: (updates) =>
        set((state) => ({
          pomodoroSettings: { ...state.pomodoroSettings, ...updates },
        })),
    }),
    {
      name: 'focus-forge-pomodoro-quick',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
