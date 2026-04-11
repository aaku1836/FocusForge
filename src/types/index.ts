export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: Priority;
  color: string; // Accent color from the palette
  scheduledTime?: string; // ISO date string
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string (null if not completed)
  isCompleted: boolean;
}

export interface QuickTask {
  id: string;
  name: string;
  order: number; // For manual sorting in Prioritizer
}

export interface PomodoroSettings {
  workSessionDuration: number; // in minutes (default 25)
  shortBreakDuration: number; // in minutes (default 5)
  longBreakDuration: number; // in minutes (default 20)
  cyclesPerSet: number; // default 4
}
