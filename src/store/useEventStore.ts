import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../lib/db';
import { Event } from '../types';

interface EventState {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'completed'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  toggleEventCompletion: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: [],

      addEvent: (eventData) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...eventData,
              id: generateId(),
              createdAt: new Date().toISOString(),
              completed: false,
            },
          ],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      toggleEventCompletion: (id) =>
        set((state) => ({
          events: state.events.map((event) => {
            if (event.id === id) {
              const completed = !event.completed;
              return {
                ...event,
                completed,
                completedAt: completed ? new Date().toISOString() : undefined,
              };
            }
            return event;
          }),
        })),
    }),
    {
      name: 'focus-forge-events',
      storage: createJSONStorage(() => ({
        getItem: (name) => db.get(name),
        setItem: (name, value) => db.set(name, value),
        removeItem: (name) => db.remove(name),
      })),
    }
  )
);
