import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Trash2, GripVertical, Plus } from 'lucide-react-native';
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

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<QuickTask>) => {
    const index = getIndex() ?? 0;
    
    return (
      <ScaleDecorator>
        <View style={[styles.taskItem, isActive && styles.taskItemActive]}>
          <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
            <GripVertical color={Colors.textSecondary} size={20} />
          </TouchableOpacity>
          
          <View style={styles.rankCircle}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          
          <Text style={styles.taskText} numberOfLines={1}>{item.name}</Text>
          
          <TouchableOpacity onPress={() => deleteQuickTask(item.id)} style={styles.deleteButton}>
            <Trash2 color={Colors.error} size={20} />
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

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
          <Plus color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={quickTasks}
        onDragEnd={({ data }) => reorderQuickTasks(data)}
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
  taskItemActive: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.primary,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dragHandle: {
    paddingRight: 12,
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
