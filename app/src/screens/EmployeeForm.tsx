import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import { Employee } from '../types';
import { colors, spacing, radii } from '../theme';

type Props = {
  initial?: Partial<Employee>;
  onCancel: () => void;
  onSave: (data: Partial<Employee>) => void;
};

export const EmployeeForm: React.FC<Props> = ({ initial = {}, onCancel, onSave }) => {
  const [nombre, setNombre] = useState(initial.nombre ?? '');
  const [area, setArea] = useState(initial.area ?? '');
  const [turno, setTurno] = useState(initial.turno ?? '');
  const [activo, setActivo] = useState<boolean>(initial.activo ?? true);

  useEffect(() => {
    setNombre(initial.nombre ?? '');
    setArea(initial.area ?? '');
    setTurno(initial.turno ?? '');
    setActivo(initial.activo ?? true);
  }, [initial]);

  const handleSave = () => {
    if (!nombre.trim()) return setError('El nombre es requerido');
    onSave({ nombre: nombre.trim(), area, turno, activo });
  };

  const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={(v) => { setNombre(v); setError(null); }} placeholder="Nombre" />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Área</Text>
      <TextInput style={styles.input} value={area} onChangeText={setArea} placeholder="Área" />

      <Text style={styles.label}>Turno</Text>
      <TextInput style={styles.input} value={turno} onChangeText={setTurno} placeholder="Turno" />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Activo</Text>
        <Switch value={activo} onValueChange={setActivo} />
      </View>

      <View style={styles.actions}>
        <Button title="Cancelar" onPress={onCancel} />
        <Button title="Guardar" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.card, flex: 1 },
  label: { fontSize: 14, marginTop: spacing.xs, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, padding: 10, marginTop: 6 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  error: { color: colors.danger, marginTop: 6 },
});

export default EmployeeForm;
