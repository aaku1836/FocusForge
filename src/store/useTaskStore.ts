import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../lib/db';
import { Task, Priority } from '../types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
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
      lastUsedColor: '#7C3AED',

      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: generateId(),
              createdAt: new Date().toISOString(),
              completed: false,
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
              const completed = !task.completed;
              return {
                ...task,
                completed,
                completedAt: completed ? new Date().toISOString() : undefined,
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
      storage: createJSONStorage(() => ({
        getItem: (name) => db.get(name),
        setItem: (name, value) => db.set(name, value),
        removeItem: (name) => db.remove(name),
      })),
    }
  )
);
