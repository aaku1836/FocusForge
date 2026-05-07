/**
 * Graph metadata for configuration files
 * This file ensures config files are included in the knowledge graph
 */

import appConfig from './app.json';
import packageConfig from './package.json';
import tsConfig from './tsconfig.json';

// Export config metadata for graph extraction
export const configMetadata = {
  app: {
    _graph: "Expo App Configuration",
    _connects: [
      "Adaptive Icon Target Grid",
      "Light App Icon Target Grid",
      "Splash Icon Target Grid"
    ]
  },
  package: {
    _graph: "Project Manifest",
    _connects: [
      "React Navigation Dark Theme Override",
      "Zustand Persistent State Pattern"
    ]
  },
  tsconfig: {
    _graph: "TypeScript Compiler Configuration",
    _connects: [
      "Task Type",
      "Event Type",
      "Habit Type",
      "Schedule Type",
      "PomodoroSettings Type",
      "QuickTask Type"
    ],
    _resolves_types_for: [
      "Task Type",
      "Event Type",
      "Habit Type",
      "Schedule Type",
      "PomodoroSettings Type",
      "QuickTask Type"
    ]
  }
};

// Export actual configs for reference
export { appConfig, packageConfig, tsConfig };