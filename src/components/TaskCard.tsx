import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { Task } from '../types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onLongPress: (task: Task) => void;
  onPress?: (task: Task) => void;
}

const SWIPE_THRESHOLD = 80;

export default function TaskCard({ task, onComplete, onLongPress, onPress }: TaskCardProps) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(80); // Approximate default height
  const opacity = useSharedValue(1);

  const completeTask = () => {
    onComplete(task.id);
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      // Only allow swipe right
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(400, { duration: 250 }, () => {
          opacity.value = withTiming(0, { duration: 150 });
          itemHeight.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(completeTask)();
          });
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      opacity: opacity.value,
      marginBottom: itemHeight.value > 0 ? 12 : 0,
    };
  });

  const renderPriorityBadge = () => {
    let color = Colors.priorityLow;
    if (task.priority === 'HIGH') color = Colors.priorityHigh;
    if (task.priority === 'MEDIUM') color = Colors.priorityMedium;

    return (
      <View style={[styles.priorityBadge, { backgroundColor: color }]}>
        <Text style={styles.priorityText}>{task.priority}</Text>
      </View>
    );
  };

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.backgroundContainer}>
        <Check size={28} color={Colors.success} />
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <TouchableOpacity
            activeOpacity={0.9}
            delayLongPress={300}
            onLongPress={() => onLongPress(task)}
            onPress={() => onPress && onPress(task)}
            style={styles.innerCard}
          >
            {/* Color Accent Edge */}
            <View style={[styles.colorEdge, { backgroundColor: task.color || Colors.primary }]} />
            
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.taskName} numberOfLines={1}>
                  {task.name}
                </Text>
                {renderPriorityBadge()}
              </View>
              
              {(task.description || task.scheduledTime) && (
                <View style={styles.detailsRow}>
                  {task.scheduledTime && (
                    <Text style={styles.timeText}>
                      {new Date(task.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surfaceHighlight, // or a green complete bg
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 80,
  },
  colorEdge: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskName: {
    ...Typography.title,
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsRow: {
    marginTop: 8,
    flexDirection: 'row',
  },
  timeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
