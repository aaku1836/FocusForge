import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors, Shadows } from '../theme/colors';

interface FABProps {
  onPress: () => void;
}

export default function FAB({ onPress }: FABProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.plusText}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
});
