import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
// Icons replaced with emoji for web compatibility
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { QuickTask } from '../types';

export default function PrioritizerScreen() {
  const { quickTasks, addQuickTask, deleteQuickTask, reorderQuickTasks } = usePomodoroStore();
  const [inputText, setInputText] = useState('');

  const handleAddTask = () => {
    if (inputText.trim()) {
      addQuickTask(inputText.trim());
      setInputText('');
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newTasks = [...quickTasks];
    [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
    reorderQuickTasks(newTasks);
  };

  const moveDown = (index: number) => {
    if (index === quickTasks.length - 1) return;
    const newTasks = [...quickTasks];
    [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    reorderQuickTasks(newTasks);
  };

  const renderItem = ({ item, index }: { item: QuickTask; index: number }) => (
    <View style={styles.taskItem}>
      <View style={styles.reorderButtons}>
        <TouchableOpacity onPress={() => moveUp(index)} style={styles.arrowButton}>
          <Text style={styles.arrowText}>▲</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => moveDown(index)} style={styles.arrowButton}>
          <Text style={styles.arrowText}>▼</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rankCircle}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      
      <Text style={styles.taskText} numberOfLines={1}>{item.name}</Text>
      
      <TouchableOpacity onPress={() => deleteQuickTask(item.id)} style={styles.deleteButton}>
        <Text style={{ color: Colors.error, fontSize: 18 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quick Tasks</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New quick task..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '300' }}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={quickTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    ...Typography.h1,
    marginBottom: 24,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButton: {
    width: 52,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reorderButtons: {
    marginRight: 8,
    alignItems: 'center',
  },
  arrowButton: {
    padding: 2,
  },
  arrowText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  taskText: {
    flex: 1,
    ...Typography.bodyLarge,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});
