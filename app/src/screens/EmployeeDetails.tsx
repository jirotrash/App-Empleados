import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Employee } from '../types';
import { colors, spacing, fontSizes } from '../theme';

type Props = {
  empleado?: Employee | null;
  onBack: () => void;
  onEdit: (emp: Employee) => void;
  onDelete: (id: number) => void;
};

export const EmployeeDetails: React.FC<Props> = ({ empleado, onBack, onEdit, onDelete }) => {
  if (!empleado) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Empleado no encontrado</Text>
      </View>
    );
  }

  const fullName = [empleado.nombre, empleado.apellido_p, empleado.apellido_m].filter(Boolean).join(' ').trim();
  const initials = (fullName || empleado.nombre || '')
    .split(' ')
    .map(s => s[0])
    .slice(0,2)
    .join('')
    .toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{fullName || empleado.nombre}</Text>
          <Text style={styles.sub}>{empleado.area ?? '-'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información</Text>
        {/* Primary quick fields */}
        <View style={styles.row}>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{empleado.id_empleado ?? empleado.id ?? '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Apellido</Text>
          <Text style={styles.value}>{[empleado.apellido_p, empleado.apellido_m].filter(Boolean).join(' ') || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Turno</Text>
          <Text style={styles.value}>{empleado.turno ?? '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado</Text>
          <Text style={styles.value}>{empleado.activo ? 'Activo' : 'Inactivo'}</Text>
        </View>

        {/* Additional optional fields */}
        {typeof empleado.salarioDiario !== 'undefined' && (
          <View style={styles.row}>
            <Text style={styles.label}>Salario diario</Text>
            <Text style={styles.value}>{Number(empleado.salarioDiario).toLocaleString(undefined, { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 })}</Text>
          </View>
        )}

        {Array.isArray(empleado.produccion) && (
          <View style={styles.row}>
            <Text style={styles.label}>Registros producción</Text>
            <Text style={styles.value}>{empleado.produccion.length}</Text>
          </View>
        )}

        {Array.isArray(empleado.asistencia) && (
          <View style={styles.row}>
            <Text style={styles.label}>Registros asistencia</Text>
            <Text style={styles.value}>{empleado.asistencia.length}</Text>
          </View>
        )}

        {empleado.email && (
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{empleado.email}</Text>
          </View>
        )}

        {empleado.telefono && (
          <View style={styles.row}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>{empleado.telefono}</Text>
          </View>
        )}
      </View>

      <View style={{ height: 8 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.surface },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: fontSizes.lg },
  name: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  sub: { color: colors.muted, marginTop: 4 },
  card: { padding: spacing.md, backgroundColor: colors.card, borderRadius: 12 },
  sectionTitle: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.muted, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: colors.muted },
  value: { fontSize: fontSizes.md, color: colors.text },
  
  empty: { textAlign: 'center', color: colors.muted }
});

export default EmployeeDetails;
