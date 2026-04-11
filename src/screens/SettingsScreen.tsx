import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useSettingsStore, AppTheme } from '../store/useSettingsStore';

export default function SettingsScreen() {
  const {
    theme,
    setTheme,
    taskRemindersEnabled,
    setTaskRemindersEnabled,
    pomodoroAlertsEnabled,
    setPomodoroAlertsEnabled,
    defaultPostponeDuration,
    setDefaultPostponeDuration,
    use24HourFormat,
    setUse24HourFormat,
  } = useSettingsStore();

  return (
    <ScrollView style={styles.container}>
      
      {/* General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.card}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 16, marginBottom: 16 }]}>
            <Text style={styles.rowLabel}>App Theme</Text>
            <View style={styles.themeSelector}>
              {(['light', 'dark', 'system'] as AppTheme[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.themePill, theme === t && styles.themePillActive]}
                  onPress={() => setTheme(t)}
                >
                  <Text style={[styles.themePillText, theme === t && { color: '#FFF' }]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Use 24-Hour Clock Format</Text>
            <Switch
              value={use24HourFormat}
              onValueChange={setUse24HourFormat}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.textPrimary}
            />
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 16, marginBottom: 16 }]}>
            <Text style={styles.rowLabel}>Task Reminders</Text>
            <Switch
              value={taskRemindersEnabled}
              onValueChange={setTaskRemindersEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.textPrimary}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Pomodoro Alerts</Text>
            <Switch
              value={pomodoroAlertsEnabled}
              onValueChange={setPomodoroAlertsEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.textPrimary}
            />
          </View>
        </View>
      </View>

      {/* Postpone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Postpone Defaults</Text>
        <View style={styles.card}>
          <View style={styles.rowColumn}>
            <Text style={styles.rowLabel}>Default Postpone (Minutes)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={defaultPostponeDuration.toString()}
              onChangeText={(val) => {
                const parsed = parseInt(val, 10);
                if (!isNaN(parsed)) setDefaultPostponeDuration(parsed);
              }}
            />
          </View>
        </View>
      </View>
      
      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Focus Forge</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValueText}>1.0.0 (Build 12)</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    ...Typography.label,
    marginBottom: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    ...Typography.bodyLarge,
  },
  rowValueText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  themeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 4,
  },
  themePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  themePillActive: {
    backgroundColor: Colors.primary,
  },
  themePillText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 80,
    textAlign: 'center',
  },
});
