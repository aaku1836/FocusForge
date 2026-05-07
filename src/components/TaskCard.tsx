import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// Icons replaced with text for web compatibility
import { Task } from '../types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onLongPress: (task: Task) => void;
  onPress?: (task: Task) => void;
}

export default function TaskCard({ task, onComplete, onLongPress, onPress }: TaskCardProps) {
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
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        delayLongPress={300}
        onLongPress={() => onLongPress(task)}
        onPress={() => onPress && onPress(task)}
        style={styles.card}
      >
        {/* Color Accent Edge */}
        <View style={[styles.colorEdge, { backgroundColor: task.color || Colors.primary }]} />
        
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={[styles.taskName, task.completed && styles.completedText]} numberOfLines={1}>
              {task.title}
            </Text>
            {renderPriorityBadge()}
          </View>
          
          {(task.description) && (
            <View style={styles.detailsRow}>
              <Text style={styles.timeText}>
                {task.description}
              </Text>
            </View>
          )}
        </View>

        {/* Complete button */}
        <TouchableOpacity style={styles.completeButton} onPress={() => onComplete(task.id)}>
          <Text style={{ fontSize: 20 }}>{task.completed ? '✅' : '⬜'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 72,
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
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
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
  completeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
