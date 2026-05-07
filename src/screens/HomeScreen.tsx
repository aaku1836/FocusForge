import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTaskStore } from '../store/useTaskStore';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import FAB from '../components/FAB';
import CreateEditTaskSheet from '../components/CreateEditTaskSheet';

export default function HomeScreen() {
  const { tasks, toggleTaskCompletion } = useTaskStore();
  const sheetRef = useRef<any>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Filter tasks
  const activeTasks = tasks.filter(t => !t.completed).sort((a, b) => {
    const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
  
  const completedTasks = tasks.filter(t => t.completed);

  const handleOpenSheet = (task?: Task) => {
    setTaskToEdit(task || null);
    sheetRef.current?.present();
  };

  const handleCloseSheet = () => {
    setTaskToEdit(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {activeTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={Typography.bodyLarge}>No active tasks right now.</Text>
            <Text style={Typography.bodySmall}>Tap + to forge a new focus.</Text>
          </View>
        )}

        {activeTasks.map(task => (
           <TaskCard 
             key={task.id} 
             task={task} 
             onComplete={toggleTaskCompletion} 
             onLongPress={handleOpenSheet} 
           />
        ))}

        {completedTasks.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.completedHeader}>Completed ({completedTasks.length})</Text>
            {completedTasks.map(task => (
               <TaskCard 
                 key={task.id} 
                 task={task} 
                 onComplete={toggleTaskCompletion} 
                 onLongPress={handleOpenSheet} 
               />
            ))}
          </View>
        )}

      </ScrollView>

      <FAB onPress={() => handleOpenSheet()} />
      <CreateEditTaskSheet sheetRef={sheetRef} taskToEdit={taskToEdit} onClose={handleCloseSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Make room for FAB
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
  },
  completedSection: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  completedHeader: {
    ...Typography.h3,
    marginBottom: 16,
  }
});
