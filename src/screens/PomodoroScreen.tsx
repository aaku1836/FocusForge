import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Play, Pause, RotateCcw, SkipForward, Settings as SettingsIcon } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { usePomodoroStore } from '../store/usePomodoroStore';

type SessionType = 'Work Session' | 'Short Break' | 'Long Break';

export default function PomodoroScreen() {
  const { pomodoroSettings } = usePomodoroStore();
  
  const [sessionType, setSessionType] = useState<SessionType>('Work Session');
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workSessionDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const totalTime = useRef(pomodoroSettings.workSessionDuration * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleCompleteSession();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleCompleteSession = () => {
    setIsActive(false);
    if (sessionType === 'Work Session') {
      const newCycles = cyclesCompleted + 1;
      setCyclesCompleted(newCycles);
      if (newCycles % pomodoroSettings.cyclesPerSet === 0) {
        startLongBreak();
      } else {
        startShortBreak();
      }
    } else {
      startWorkSession();
    }
  };

  const startWorkSession = () => {
    setSessionType('Work Session');
    setTimeLeft(pomodoroSettings.workSessionDuration * 60);
    totalTime.current = pomodoroSettings.workSessionDuration * 60;
  };

  const startShortBreak = () => {
    setSessionType('Short Break');
    setTimeLeft(pomodoroSettings.shortBreakDuration * 60);
    totalTime.current = pomodoroSettings.shortBreakDuration * 60;
  };

  const startLongBreak = () => {
    setSessionType('Long Break');
    setTimeLeft(pomodoroSettings.longBreakDuration * 60);
    totalTime.current = pomodoroSettings.longBreakDuration * 60;
  };

  const resetTimer = () => {
    setIsActive(false);
    if (sessionType === 'Work Session') startWorkSession();
    else if (sessionType === 'Short Break') startShortBreak();
    else startLongBreak();
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // SVG dimensions
  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / totalTime.current;
  const strokeDashoffset = circumference - progress * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={Typography.h2}>Timer</Text>
        <TouchableOpacity>
          <SettingsIcon color={Colors.textSecondary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <Svg width={size} height={size} style={styles.svgWrapper}>
          <Circle
            stroke={Colors.surfaceHighlight}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={sessionType === 'Work Session' ? Colors.priorityHigh : Colors.priorityLow}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.timeTextContainer}>
          <Text style={styles.timeText}>
            {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </Text>
          <Text style={styles.sessionLabel}>{sessionType}</Text>
        </View>
      </View>

      <View style={styles.cycleIndicators}>
        {Array.from({ length: pomodoroSettings.cyclesPerSet }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.cycleDot,
              i < cyclesCompleted % pomodoroSettings.cyclesPerSet ? styles.cycleDotCompleted : null,
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconButton} onPress={resetTimer}>
          <RotateCcw size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mainButton} onPress={toggleTimer}>
          {isActive ? (
            <Pause size={32} color="#FFF" fill="#FFF" />
          ) : (
            <Play size={32} color="#FFF" fill="#FFF" style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={handleCompleteSession}>
          <SkipForward size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  svgWrapper: {
    position: 'absolute',
  },
  timeTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  sessionLabel: {
    ...Typography.title,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  cycleIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    gap: 12,
  },
  cycleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.surfaceHighlight,
  },
  cycleDotCompleted: {
    backgroundColor: Colors.priorityHigh,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
    gap: 40,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
