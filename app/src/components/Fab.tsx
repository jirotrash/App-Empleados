import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  onPress: () => void;
  style?: ViewStyle;
};

export const Fab: React.FC<Props> = ({ onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.fab, style]} accessibilityRole="button" accessibilityLabel="Agregar empleado">
      <MaterialIcons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});

export default Fab;
