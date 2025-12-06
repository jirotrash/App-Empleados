import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Employee } from '../types';
import { colors, spacing, radii, fontSizes } from '../theme';

type Props = {
  empleado: Employee;
  onPress?: () => void;
};

export const EmployeeCard: React.FC<Props> = ({ empleado, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Empleado ${empleado.nombre}`}
    >
      <View style={styles.left}> 
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(empleado.nombre || '').split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {empleado.nombre}
        </Text>
        <Text style={styles.meta}>{empleado.area ?? 'Área desconocida'}</Text>
      </View>

      <View style={styles.right}>
        <View style={[styles.badge, empleado.activo ? styles.badgeActive : styles.badgeInactive]}>
          <Text style={styles.badgeText}>{empleado.activo ? 'Activo' : 'Inactivo'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: { paddingLeft: 12, paddingRight: 8 },
  avatar: { width: 52, height: 52, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: fontSizes.lg },
  info: { flex: 1, paddingRight: 8 },
  right: { justifyContent: 'center', alignItems: 'flex-end' },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeActive: { backgroundColor: colors.success },
  badgeInactive: { backgroundColor: colors.border },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

export default EmployeeCard;
