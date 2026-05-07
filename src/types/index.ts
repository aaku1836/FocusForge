export type ItemType = 'task' | 'event' | 'habit'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Recurrence = 'daily' | 'weekly'

export interface BaseItem {
  id: string
  title: string
  type: ItemType
  date?: string
}

export interface Task extends BaseItem {
  type: 'task'
  deadline?: string
  completed: boolean
  priority: Priority
  color: string
  description?: string
  createdAt: string
  completedAt?: string
}

export interface Event extends BaseItem {
  type: 'event'
  startTime: string
  endTime: string
  color?: string
  description?: string
  createdAt: string
  completedAt?: string
  completed: boolean
}

export interface Habit extends BaseItem {
  type: 'habit'
  recurrence: Recurrence
  streak: number
  longestStreak: number
  isBestStreak: boolean
  completedDates: string[]
  color?: string
  description?: string
  createdAt: string
  lastCompletedDate?: string
  bestStreakDate?: string
  target?: string
}

export interface PomodoroSettings {
  workSessionDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  cyclesPerSet: number
}

export interface QuickTask {
  id: string
  name: string
  order: number
}

export interface Schedule {
  date: string
  taskIds: string[]
}

export interface JournalEntry {
  id: string
  date: string
  content: string
  gratefulFor?: string[]
  createdAt: string
  updatedAt: string
}
