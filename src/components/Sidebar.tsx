import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const MENU_ICONS: Record<string, string> = {
  Home: '🏠',
  Organizer: '📅',
  Prioritizer: '⚡',
  Pomodoro: '⏱️',
  Settings: '⚙️',
};

export default function Sidebar(props: any) {
  const { state, navigation } = props;
  const currentRouteName = state.routeNames[state.index];

  type MenuItem = { name: string; emoji: string; route: string };
  const menuItems: MenuItem[] = [
    { name: 'Home', emoji: '🏠', route: 'Home' },
    { name: 'Organizer', emoji: '📅', route: 'Organizer' },
    { name: 'Prioritizer', emoji: '⚡', route: 'Prioritizer' },
    { name: 'Pomodoro Timer', emoji: '⏱️', route: 'Pomodoro' },
    { name: 'Settings', emoji: '⚙️', route: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder} />
        <Text style={styles.headerText}>Focus Forge</Text>
      </View>

      <View style={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = currentRouteName === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.activeMenuItem]}
              onPress={() => navigation.navigate(item.route)}
            >
              <Text style={styles.emojiIcon}>{item.emoji}</Text>
              <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  headerText: {
    ...Typography.h2,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeMenuItem: {
    backgroundColor: Colors.surfaceHighlight,
  },
  emojiIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeMenuText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
