import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Employee } from '../types';
import EmployeeCard from '../components/EmployeeCard';
import { colors, spacing, fontSizes } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

type Props = {
  employees: Employee[];
  onCreate: () => void;
  onSelect: (id: number) => void;
  onRefresh: () => void;
  refreshing: boolean;
  onEndReached?: () => void;
  loadingMore?: boolean;
};

export const EmployeeList: React.FC<Props> = ({ employees, onCreate, onSelect, onRefresh, refreshing, onEndReached, loadingMore }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const areas = [
    { key: 'OFICINA', label: 'OFICINA', icon: 'account-tie', color: '#2F80ED' },
    { key: 'PRODUCCION', label: 'PRODUCCIÓN', icon: 'clipboard-check-outline', color: '#F2994A' },
    { key: 'INVENTARIO', label: 'INVENTARIO', icon: 'warehouse', color: '#27AE60' },
  ];

  const filtered = useMemo(() => {
    let list = employees;
    if (filter) {
      list = list.filter(e => (String(e.area || '')).toUpperCase() === String(filter).toUpperCase());
    }
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter(e => (e.nombre || '').toLowerCase().includes(q) || (e.area || '').toLowerCase().includes(q));
  }, [employees, query, filter]);
  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.searchWrap}>
        <TextInput placeholder="Buscar empleado o área" value={query} onChangeText={setQuery} style={styles.searchInput} />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Empleados</Text>
        
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.topRow}>
          {areas.slice(0, 2).map(a => {
            const active = filter === a.key;
            return (
              <TouchableOpacity
                key={a.key}
                style={[
                  styles.topButton,
                  active && { backgroundColor: a.color, borderColor: a.color },
                ]}
                onPress={() => setFilter(active ? null : a.key)}
              >
                <View style={styles.filterInner}>
                  <MaterialCommunityIcons name={a.icon as any} size={18} color={active ? '#fff' : a.color} style={styles.filterIcon} />
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{a.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomRow}>
          {(() => {
            const a = areas[2];
            const active = filter === a.key;
            return (
              <TouchableOpacity
                key={a.key}
                style={[
                  styles.bottomButton,
                  active && { backgroundColor: a.color, borderColor: a.color },
                ]}
                onPress={() => setFilter(active ? null : a.key)}
              >
                <View style={styles.filterInner}>
                  <MaterialCommunityIcons name={a.icon as any} size={20} color={active ? '#fff' : a.color} style={styles.filterIcon} />
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{a.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })()}
        </View>
      </View>

      {refreshing && employees.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id ?? (item as any).id_empleado ?? Math.random())}
          renderItem={({ item }) => {
            const id = item.id ?? (item as any).id_empleado;
            return <EmployeeCard empleado={item} onPress={() => id != null && onSelect(id)} />;
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReachedThreshold={0.5}
          onEndReached={() => { if (onEndReached) onEndReached(); }}
          ListFooterComponent={loadingMore ? <View style={{ padding: 12 }}><ActivityIndicator /></View> : null}
          ListEmptyComponent={() => (
            <View style={styles.empty}><Text style={styles.emptyText}>No hay empleados aún.</Text></View>
          )}
        />
      )}

      {/* FAB removed as requested */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  newButton: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  newButtonText: { color: '#fff', fontWeight: '700' },
  searchWrap: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface },
  searchInput: { backgroundColor: '#fff', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border, fontSize: fontSizes.md },
  empty: { padding: 20, alignItems: 'center' },
  emptyText: { color: colors.muted },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filtersContainer: { paddingHorizontal: spacing.md, paddingVertical: 8 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  topButton: { flex: 0.48, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  bottomRow: { marginTop: 14, alignItems: 'center' },
  bottomButton: { width: '72%', paddingVertical: 16, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  filterText: { color: colors.text, fontWeight: '700', fontSize: fontSizes.md },
  filterTextActive: { color: '#fff' },
  filterInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  filterIcon: { marginRight: 8 },
});

export default EmployeeList;
