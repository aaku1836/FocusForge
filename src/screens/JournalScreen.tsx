import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';
import TaskCard from '../components/TaskCard';
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay } from 'date-fns';

type ViewMode = 'Daily' | 'Weekly' | 'Monthly';

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);

export default function JournalScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('Monthly');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { tasks, toggleTaskCompletion } = useTaskStore();
  const { use24HourFormat, setUse24HourFormat } = useSettingsStore();

  const tasksForSelectedDate = tasks.filter((t) => {
    if (!t.deadline) return false;
    return t.deadline.startsWith(selectedDate);
  });

  const getTasksForHour = (hour: number) => {
    return tasksForSelectedDate.filter((t) => {
      if (!t.deadline) return false;
      const dateObj = new Date(t.deadline);
      return dateObj.getHours() === hour;
    });
  };

  // Simple built-in calendar
  const renderMonthlyCalendar = () => {
    const current = new Date(selectedDate);
    const monthStart = startOfMonth(current);
    const monthEnd = endOfMonth(current);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Pad start of month to align with day-of-week
    const startDayOfWeek = getDay(monthStart);
    const padDays = Array.from({ length: startDayOfWeek }, (_, i) => null);

    const prevMonth = () => {
      const d = new Date(current);
      d.setMonth(d.getMonth() - 1);
      setSelectedDate(format(d, 'yyyy-MM-dd'));
    };
    const nextMonth = () => {
      const d = new Date(current);
      d.setMonth(d.getMonth() + 1);
      setSelectedDate(format(d, 'yyyy-MM-dd'));
    };

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={prevMonth}><Text style={styles.calendarArrow}>◀</Text></TouchableOpacity>
          <Text style={styles.calendarTitle}>{format(current, 'MMMM yyyy')}</Text>
          <TouchableOpacity onPress={nextMonth}><Text style={styles.calendarArrow}>▶</Text></TouchableOpacity>
        </View>
        <View style={styles.calendarWeekHeader}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <Text key={d} style={styles.calendarWeekDay}>{d}</Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {padDays.map((_, i) => <View key={`pad-${i}`} style={styles.calendarCell} />)}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isSelected = dateStr === selectedDate;
            const hasTasks = tasks.some(t => t.deadline?.startsWith(dateStr));
            return (
              <TouchableOpacity
                key={dateStr}
                style={[styles.calendarCell, isSelected && styles.calendarCellSelected]}
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[styles.calendarDayText, isSelected && styles.calendarDayTextSelected]}>
                  {format(day, 'd')}
                </Text>
                {hasTasks && <View style={styles.calendarDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderDailyView = () => {
    const anyTimeTasks = tasks.filter((t) => !t.deadline || (t.deadline.startsWith(selectedDate) && new Date(t.deadline).getHours() === 0));

    return (
      <ScrollView contentContainerStyle={styles.dailyContainer}>
        <View style={styles.dailyHeaderRow}>
          <Text style={styles.agendaTitle}>Daily Schedule</Text>
          <TouchableOpacity onPress={() => setUse24HourFormat(!use24HourFormat)} style={styles.formatToggle}>
            <Text style={styles.formatToggleText}>{use24HourFormat ? '24h' : '12h'}</Text>
          </TouchableOpacity>
        </View>

        {anyTimeTasks.length > 0 && (
          <View style={styles.anytimeSection}>
            <Text style={styles.anytimeTitle}>Anytime Today</Text>
            {anyTimeTasks.map(task => (
              <TaskCard key={task.id} task={task} onComplete={toggleTaskCompletion} onLongPress={() => {}} />
            ))}
          </View>
        )}
        
        <View style={styles.timelineContainer}>
          {TIME_SLOTS.map(hour => {
            const timeLabel = use24HourFormat 
              ? `${hour.toString().padStart(2, '0')}:00` 
              : `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
            const hourTasks = getTasksForHour(hour);

            return (
              <View key={hour} style={styles.timeSlotRow}>
                <View style={styles.timeLabelContainer}>
                  <Text style={styles.timeLabel}>{timeLabel}</Text>
                </View>
                <View style={styles.timelineLine}>
                  {hourTasks.map(t => (
                    <View key={t.id} style={[styles.timelineTaskBlock, { backgroundColor: t.color || Colors.primary }]}>
                      <Text style={styles.timelineTaskText} numberOfLines={1}>{t.title}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderWeeklyView = () => {
    const start = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
    const weekDays = Array.from({length: 7}, (_, i) => addDays(start, i));

    return (
      <View style={styles.weeklyContainer}>
        <View style={styles.weekHeaderRow}>
          {weekDays.map(day => (
            <TouchableOpacity key={day.toString()} style={styles.weekDayColumn} onPress={() => setSelectedDate(format(day, 'yyyy-MM-dd'))}>
              <Text style={styles.weekDayText}>{format(day, 'EEE')}</Text>
              <Text style={[styles.weekDateText, format(day, 'yyyy-MM-dd') === selectedDate && styles.weekDateTextActive]}>
                {format(day, 'd')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={styles.weekGrid}>
            {weekDays.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const tasksForDay = tasks.filter(t => t.deadline?.startsWith(dateStr));
              return (
                <View key={day.toString()} style={[styles.weekTaskColumn, dateStr === selectedDate && styles.weekTaskColumnActive]}>
                  {tasksForDay.map(t => (
                    <View key={t.id} style={[styles.compactPill, {backgroundColor: t.color || Colors.primary}]}>
                      <Text style={styles.compactPillText} numberOfLines={2}>{t.title}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {(['Daily', 'Weekly', 'Monthly'] as ViewMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.tabButton, viewMode === mode && styles.tabButtonActive]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[styles.tabText, viewMode === mode && styles.tabTextActive]}>{mode}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {viewMode === 'Daily' && renderDailyView()}
        {viewMode === 'Weekly' && renderWeeklyView()}
        {viewMode === 'Monthly' && (
          <ScrollView>
            {renderMonthlyCalendar()}
            <View style={styles.agendaSection}>
              <Text style={styles.agendaTitle}>Schedule for {selectedDate}</Text>
              {tasksForSelectedDate.length === 0 ? (
                <Text style={styles.emptyText}>No tasks scheduled.</Text>
              ) : (
                tasksForSelectedDate.map(task => (
                  <TaskCard key={task.id} task={task} onComplete={toggleTaskCompletion} onLongPress={() => {}} />
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabsContainer: { flexDirection: 'row', backgroundColor: Colors.surface, margin: 16, borderRadius: 12, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  tabButtonActive: { backgroundColor: Colors.background, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { ...Typography.bodyMedium, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.textPrimary },
  content: { flex: 1 },

  // Calendar
  calendarContainer: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calendarTitle: { ...Typography.h3 },
  calendarArrow: { color: Colors.primary, fontSize: 18, padding: 8 },
  calendarWeekHeader: { flexDirection: 'row', marginBottom: 8 },
  calendarWeekDay: { flex: 1, textAlign: 'center', ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  calendarCellSelected: { backgroundColor: Colors.primary, borderRadius: 20 },
  calendarDayText: { ...Typography.bodyMedium, color: Colors.textPrimary },
  calendarDayTextSelected: { color: '#FFF', fontWeight: 'bold' },
  calendarDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.primary, position: 'absolute', bottom: 4 },

  // Agenda
  agendaSection: { paddingHorizontal: 16, paddingBottom: 200 },
  agendaTitle: { ...Typography.h3, marginBottom: 16 },
  emptyText: { ...Typography.bodyLarge, color: Colors.textMuted, textAlign: 'center', marginTop: 24 },

  // Daily
  dailyContainer: { padding: 16, paddingBottom: 40 },
  dailyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  formatToggle: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.surfaceHighlight, borderRadius: 8 },
  formatToggleText: { ...Typography.bodySmall, color: Colors.textPrimary },
  anytimeSection: { marginBottom: 24 },
  anytimeTitle: { ...Typography.bodyLarge, fontWeight: 'bold', marginBottom: 12 },
  timelineContainer: { flex: 1 },
  timeSlotRow: { flexDirection: 'row', minHeight: 48 },
  timeLabelContainer: { width: 60, alignItems: 'flex-end', paddingRight: 12, paddingTop: 4 },
  timeLabel: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  timelineLine: { flex: 1, borderLeftWidth: 1, borderLeftColor: Colors.border, paddingLeft: 8, paddingTop: 4, paddingBottom: 4 },
  timelineTaskBlock: { padding: 8, borderRadius: 6, marginBottom: 4 },
  timelineTaskText: { ...Typography.bodySmall, color: '#FFF', fontWeight: '600' },

  // Weekly
  weeklyContainer: { flex: 1, padding: 16 },
  weekHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 12, marginBottom: 12 },
  weekDayColumn: { flex: 1, alignItems: 'center' },
  weekDayText: { ...Typography.bodySmall, color: Colors.textSecondary, textTransform: 'uppercase' },
  weekDateText: { ...Typography.bodyLarge, fontWeight: 'bold', marginTop: 4 },
  weekDateTextActive: { color: Colors.primary },
  weekGrid: { flexDirection: 'row', minHeight: 300 },
  weekTaskColumn: { flex: 1, borderRightWidth: 0.5, borderRightColor: Colors.border, paddingHorizontal: 2 },
  weekTaskColumnActive: { backgroundColor: Colors.surfaceHighlight },
  compactPill: { padding: 4, borderRadius: 4, marginBottom: 4 },
  compactPillText: { fontSize: 9, color: '#FFF', fontWeight: 'bold' },
});
