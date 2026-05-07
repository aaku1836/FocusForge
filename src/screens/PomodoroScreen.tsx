import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

  // Progress ring via CSS-like approach
  const progress = timeLeft / totalTime.current;
  const ringColor = sessionType === 'Work Session' ? Colors.priorityHigh : Colors.priorityLow;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Timer</Text>
        <Text style={{ fontSize: 20 }}>⚙️</Text>
      </View>

      <View style={styles.timerContainer}>
        {/* Outer ring background */}
        <View style={[styles.ringOuter, { borderColor: Colors.surfaceHighlight }]}>
          {/* Progress indicator - simplified for web */}
          <View style={[styles.ringInner, { borderColor: ringColor, borderTopColor: progress > 0.75 ? ringColor : 'transparent', borderRightColor: progress > 0.5 ? ringColor : 'transparent', borderBottomColor: progress > 0.25 ? ringColor : 'transparent' }]} />
          <View style={styles.timeContent}>
            <Text style={styles.timeText}>
              {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </Text>
            <Text style={styles.sessionLabel}>{sessionType}</Text>
          </View>
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
          <Text style={styles.controlEmoji}>🔄</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mainButton} onPress={toggleTimer}>
          <Text style={styles.playPauseText}>{isActive ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={handleCompleteSession}>
          <Text style={styles.controlEmoji}>⏭</Text>
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
  headerTitle: {
    ...Typography.h2,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  ringOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 12,
  },
  timeContent: {
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
  controlEmoji: {
    fontSize: 24,
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
  playPauseText: {
    fontSize: 32,
    color: '#FFF',
  },
});
