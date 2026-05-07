import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Priority, Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface CreateEditTaskSheetProps {
  sheetRef: any;
  taskToEdit?: Task | null;
  onClose: () => void;
}

// On web we use a Modal; on native we use BottomSheetModal
export default function CreateEditTaskSheet({ sheetRef, taskToEdit, onClose }: CreateEditTaskSheetProps) {
  const { addTask, updateTask, lastUsedPriority, lastUsedColor, setLastUsedPriority, setLastUsedColor } = useTaskStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(lastUsedPriority);
  const [selectedColor, setSelectedColor] = useState(lastUsedColor);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [visible, setVisible] = useState(false);

  // Expose present/dismiss via sheetRef for cross-platform
  useEffect(() => {
    if (sheetRef) {
      sheetRef.current = {
        present: () => setVisible(true),
        dismiss: () => { setVisible(false); onClose(); },
      };
    }
  }, [sheetRef, onClose]);

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setSelectedColor(taskToEdit.color);
      if (taskToEdit.scheduledTime) {
        const d = new Date(taskToEdit.scheduledTime);
        setScheduledDate(format(d, 'yyyy-MM-dd'));
        setScheduledTime(format(d, 'HH:mm'));
      } else {
        setScheduledDate('');
        setScheduledTime('');
      }
    } else {
      setName('');
      setDescription('');
      setPriority(lastUsedPriority);
      setSelectedColor(lastUsedColor);
      setScheduledDate('');
      setScheduledTime('');
    }
  }, [taskToEdit, lastUsedPriority, lastUsedColor]);

  const handleSave = () => {
    if (!name.trim()) return;

    let finalScheduledTime: string | undefined = undefined;
    if (scheduledDate || scheduledTime) {
      const safeDate = scheduledDate.trim() || format(new Date(), 'yyyy-MM-dd');
      const safeTime = scheduledTime.trim() || '12:00';
      try {
        const dateObj = new Date(`${safeDate}T${safeTime}:00`);
        if (!isNaN(dateObj.getTime())) {
          finalScheduledTime = format(dateObj, "yyyy-MM-dd'T'HH:mm:ss");
        }
      } catch (e) {
        // Ignore invalid dates
      }
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        name,
        description,
        priority,
        color: selectedColor,
        scheduledTime: finalScheduledTime,
      });
    } else {
      addTask({
        name,
        description,
        priority,
        color: selectedColor,
        scheduledTime: finalScheduledTime,
      });
    }
    
    setLastUsedPriority(priority);
    setLastUsedColor(selectedColor);
    setVisible(false);
    onClose();
  };

  const content = (
    <View style={styles.container}>
      <TextInput
        style={styles.nameInput}
        placeholder="What needs to be done?"
        placeholderTextColor={Colors.textMuted}
        value={name}
        onChangeText={setName}
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
        <Text style={styles.sectionLabel}>Date & Time (Optional)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textMuted}
            value={scheduledDate}
            onChangeText={setScheduledDate}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
            placeholder="HH:mm (24h)"
            placeholderTextColor={Colors.textMuted}
            value={scheduledTime}
            onChangeText={setScheduledTime}
          />
        </View>
      </View>

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

      <TouchableOpacity style={styles.cancelButton} onPress={() => { setVisible(false); onClose(); }}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { setVisible(false); onClose(); }}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handleBar} />
          {content}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 12,
  },
  container: {
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
  row: {
    flexDirection: 'row',
  },
  input: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceHighlight,
    padding: 12,
    borderRadius: 8,
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
    height: 24,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    ...Typography.title,
    color: '#FFF',
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButtonText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
});
