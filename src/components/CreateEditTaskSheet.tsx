import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Calendar, Clock } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Priority, Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface CreateEditTaskSheetProps {
  sheetRef: any;
  taskToEdit?: Task | null;
  onClose: () => void;
}

export default function CreateEditTaskSheet({ sheetRef, taskToEdit, onClose }: CreateEditTaskSheetProps) {
  const { addTask, updateTask, lastUsedPriority, lastUsedColor, setLastUsedPriority, setLastUsedColor } = useTaskStore();
  const snapPoints = useMemo(() => ['85%'], []);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(lastUsedPriority);
  const [selectedColor, setSelectedColor] = useState(lastUsedColor);

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setSelectedColor(taskToEdit.color);
    } else {
      setName('');
      setDescription('');
      setPriority(lastUsedPriority);
      setSelectedColor(lastUsedColor);
    }
  }, [taskToEdit, lastUsedPriority, lastUsedColor]);

  const handleSave = () => {
    if (!name.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        name,
        description,
        priority,
        color: selectedColor,
      });
    } else {
      addTask({
        name,
        description,
        priority,
        color: selectedColor,
      });
    }
    
    setLastUsedPriority(priority);
    setLastUsedColor(selectedColor);
    sheetRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: Colors.surface }}
      handleIndicatorStyle={{ backgroundColor: Colors.border }}
      onDismiss={onClose}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.nameInput}
          placeholder="What needs to be done?"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus={!taskToEdit}
        />
        
        <TextInput
          style={styles.descInput}
          placeholder="Add details... (optional)"
          placeholderTextColor={Colors.textMuted}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            {['HIGH', 'MEDIUM', 'LOW'].map((p) => {
              const isActive = priority === p;
              let bgColor = Colors.surfaceHighlight;
              if (isActive) {
                if (p === 'HIGH') bgColor = Colors.priorityHigh;
                if (p === 'MEDIUM') bgColor = Colors.priorityMedium;
                if (p === 'LOW') bgColor = Colors.priorityLow;
              }
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityChip, { backgroundColor: bgColor, borderColor: isActive ? bgColor : Colors.border }]}
                  onPress={() => setPriority(p as Priority)}
                >
                  <Text style={[styles.priorityChipText, isActive && { color: '#FFF' }]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Theme Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
            {Object.values(Colors.palette).map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorSwatch, { backgroundColor: c }, selectedColor === c && styles.colorSwatchSelected]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{taskToEdit ? 'Save Changes' : 'Save Task'}</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  nameInput: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  descInput: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    minHeight: 60,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    ...Typography.label,
    marginBottom: 12,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityChipText: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  colorScroll: {
    flexDirection: 'row',
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  spacer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    ...Typography.title,
    color: '#FFF',
    fontWeight: '700',
  },
});
