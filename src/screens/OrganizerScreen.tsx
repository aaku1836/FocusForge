import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';
import TaskCard from '../components/TaskCard';
import { format, addDays, startOfWeek } from 'date-fns';
import { Task } from '../types';

type ViewMode = 'Daily' | 'Weekly' | 'Monthly';

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i); // Full 24 Hours (0 to 23)

export default function OrganizerScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('Monthly');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { tasks, toggleTaskCompletion } = useTaskStore();
  const { use24HourFormat, setUse24HourFormat } = useSettingsStore();

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const tasksForSelectedDate = tasks.filter((t) => {
    if (!t.scheduledTime) return false;
    return t.scheduledTime.startsWith(selectedDate);
  });

  const getTasksForHour = (hour: number) => {
    return tasksForSelectedDate.filter((t) => {
      const dateObj = new Date(t.scheduledTime!);
      return dateObj.getHours() === hour;
    });
  };

  const generateMarkedDates = () => {
    const marks: any = {};
    marks[selectedDate] = { selected: true, selectedColor: Colors.primary };
    
    tasks.forEach(t => {
      if (t.scheduledTime) {
        const dateStr = t.scheduledTime.split('T')[0];
        if (dateStr !== selectedDate) {
          marks[dateStr] = { marked: true, dotColor: t.color || Colors.primary };
        } else {
          marks[dateStr].marked = true;
          marks[dateStr].dotColor = t.color || Colors.primary;
        }
      }
    });
    return marks;
  };

  const renderDailyView = () => {
    const anyTimeTasks = tasks.filter((t) => !t.scheduledTime || (t.scheduledTime.startsWith(selectedDate) && new Date(t.scheduledTime).getHours() === 0));

    return (
      <ScrollView contentContainerStyle={styles.dailyContainer}>
        <View style={styles.dailyHeaderRow}>
          <Text style={styles.agendaTitle}>Daily Schedule</Text>
          <TouchableOpacity onPress={() => setUse24HourFormat(!use24HourFormat)} style={styles.formatToggle}>
            <Text style={styles.formatToggleText}>{use24HourFormat ? '24h Format' : '12h Format'}</Text>
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
                      <Text style={styles.timelineTaskText} numberOfLines={1}>{t.name}</Text>
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
    const start = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 }); // Monday start
    const weekDays = Array.from({length: 7}, (_, i) => addDays(start, i));

    return (
      <View style={styles.weeklyContainer}>
         <View style={styles.weekHeaderRow}>
            {weekDays.map(day => (
               <View key={day.toString()} style={styles.weekDayColumn}>
                  <Text style={styles.weekDayText}>{format(day, 'EEE')}</Text>
                  <Text style={[styles.weekDateText, format(day, 'yyyy-MM-dd') === selectedDate && styles.weekDateTextActive]}>
                    {format(day, 'd')}
                  </Text>
               </View>
            ))}
         </View>
         <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
            <View style={styles.weekGrid}>
               {weekDays.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const tasksForDay = tasks.filter(t => t.scheduledTime?.startsWith(dateStr));
                  return (
                     <View key={day.toString()} style={[styles.weekTaskColumn, dateStr === selectedDate && styles.weekTaskColumnActive]}>
                        {tasksForDay.map(t => (
                           <View key={t.id} style={[styles.compactPill, {backgroundColor: t.color || Colors.primary}]}>
                              <Text style={styles.compactPillText} numberOfLines={2}>{t.name}</Text>
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
      {/* Tabs */}
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
          <View>
            <Calendar
              current={selectedDate}
              onDayPress={handleDayPress}
              markedDates={generateMarkedDates()}
              theme={{
                backgroundColor: Colors.background,
                calendarBackground: Colors.surface,
                textSectionTitleColor: Colors.textSecondary,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: Colors.primary,
                dayTextColor: Colors.textPrimary,
                textDisabledColor: Colors.textMuted,
                dotColor: Colors.primary,
                selectedDotColor: '#ffffff',
                arrowColor: Colors.primary,
                monthTextColor: Colors.textPrimary,
              }}
              style={styles.calendar}
            />
            <ScrollView style={{ flex: 1 }}>
              <View style={styles.agendaSection}>
                <Text style={styles.agendaTitle}>Schedule for {selectedDate}</Text>
                {tasksForSelectedDate.length === 0 ? (
                  <Text style={styles.emptyText}>No tasks scheduled.</Text>
                ) : (
                  tasksForSelectedDate.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={toggleTaskCompletion}
                      onLongPress={() => {}}
                    />
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  calendar: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  agendaSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 200, // accommodate calendar height push
  },
  agendaTitle: {
    ...Typography.h3,
    marginBottom: 16,
  },
  emptyText: {
    ...Typography.bodyLarge,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
  dailyContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  dailyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formatToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 8,
  },
  formatToggleText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  anytimeSection: {
    marginBottom: 24,
  },
  anytimeTitle: {
    ...Typography.bodyLarge,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timelineContainer: {
    flex: 1,
  },
  timeSlotRow: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timeLabelContainer: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 8,
  },
  timeLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  timelineLine: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  timelineTaskBlock: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  timelineTaskText: {
    ...Typography.bodySmall,
    color: '#FFF',
    fontWeight: '600',
  },
  weeklyContainer: {
    flex: 1,
    padding: 16,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  weekDayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  weekDateText: {
    ...Typography.bodyLarge,
    fontWeight: 'bold',
    marginTop: 4,
  },
  weekDateTextActive: {
    color: Colors.primary,
  },
  weekGrid: {
    flexDirection: 'row',
    height: '100%',
  },
  weekTaskColumn: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: Colors.border,
    paddingHorizontal: 2,
  },
  weekTaskColumnActive: {
    backgroundColor: Colors.surfaceHighlight,
  },
  compactPill: {
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  compactPillText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
