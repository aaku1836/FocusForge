import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Priority } from '../types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  lastUsedPriority: Priority;
  lastUsedColor: string;
  setLastUsedPriority: (priority: Priority) => void;
  setLastUsedColor: (color: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      lastUsedPriority: 'MEDIUM',
      lastUsedColor: '#7C3AED', // default primary accent

      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: generateId(),
              createdAt: new Date().toISOString(),
              isCompleted: false,
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              const isCompleted = !task.isCompleted;
              return {
                ...task,
                isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : undefined,
              };
            }
            return task;
          }),
        })),

      setLastUsedPriority: (priority) => set({ lastUsedPriority: priority }),
      setLastUsedColor: (color) => set({ lastUsedColor: color }),
    }),
    {
      name: 'focus-forge-tasks',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
