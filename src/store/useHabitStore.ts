import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../lib/db';
import { Habit, Recurrence } from '../types';

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'longestStreak' | 'isBestStreak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (habitData) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habitData,
              id: generateId(),
              createdAt: new Date().toISOString(),
              streak: 0,
              longestStreak: 0,
              isBestStreak: false,
              completedDates: [],
            },
          ],
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),

      completeHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id === id) {
              const today = new Date().toISOString().split('T')[0];
              const lastCompleted = habit.lastCompletedDate?.split('T')[0];
              
              // Only increment streak if not already completed today
              if (lastCompleted === today) {
                return habit;
              }
              
              const newStreak = habit.streak + 1;
              const isBestStreak = newStreak > habit.longestStreak;
              return {
                ...habit,
                streak: newStreak,
                longestStreak: isBestStreak ? newStreak : habit.longestStreak,
                isBestStreak,
                lastCompletedDate: new Date().toISOString(),
                bestStreakDate: isBestStreak ? new Date().toISOString() : habit.bestStreakDate,
                completedDates: [...habit.completedDates, today],
              };
            }
            return habit;
          }),
        })),
    }),
    {
      name: 'focus-forge-habits',
      storage: createJSONStorage(() => ({
        getItem: (name) => db.get(name),
        setItem: (name, value) => db.set(name, value),
        removeItem: (name) => db.remove(name),
      })),
    }
  )
);
