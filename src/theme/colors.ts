export const Colors = {
  // Base Palette
  background: '#0F0F14',      // Deep charcoal base
  surface: '#1A1A24',         // Card surfaces
  surfaceHighlight: '#2A2A35',// Slightly lighter surface for hover/pressed states
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',   // Gray-400
  textMuted: '#52525B',       // Gray-600
  border: '#272730',

  // Accent & Priority Colors
  primary: '#0d941cff',         // Primary Accent (Green)
  priorityHigh: '#ee0606ff',    // Red
  priorityMedium: '#d9c406ff',  // Yellow
  priorityLow: '#0d941cff',     // Green

  // Extended Palette for Task Colors (Color Customizer)
  palette: {
    deepRed: '#B91C1C',
    orange: '#C2410C',
    amber: '#D97706',
    teal: '#0D9488',
    indigo: '#4338CA',
    violet: '#7C3AED',
    pink: '#BE185D',
    slate: '#475569',
    green: '#15803D',
    rose: '#E11D48',
  },

  // UI Semantic
  error: '#EF4444',
  success: '#10B981',
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
