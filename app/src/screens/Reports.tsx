import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Button, ScrollView } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';
import AppHeader from '../components/AppHeader';
import { LineChart } from 'react-native-chart-kit';
import { empleadosApi } from '../api/empleadosApi';

// Definición de tipos
type SeriesPoint = { label: string; value: number };

const SCREEN_WIDTH = Dimensions.get('window').width - spacing.md * 2;
const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// Generador de datos de ejemplo
const makeSampleLast12 = (): SeriesPoint[] => {
  const now = new Date();
  const out: SeriesPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mm = d.getMonth();
    const base = 300 + (i * 30) + Math.round(Math.random() * 60);
    out.push({ label: monthNames[mm], value: base });
  }
  return out;
};

const sampleData = makeSampleLast12();

const ReportsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<SeriesPoint[]>(sampleData);
  const [monthlySeries, setMonthlySeries] = useState<{ key: string; label: string; total: number; days: SeriesPoint[] }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'ejemplo'|'backend'|'unknown'>('unknown');

  const monthKeyFrom = (dateLike: any) => {
    if (!dateLike) return null;
    const d = new Date(String(dateLike));
    if (!isNaN(d.getTime())) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    const parts = String(dateLike).split(/[-_/]/);
    if (parts.length >= 2) return `${parts[0]}-${String(parts[1]).padStart(2, '0')}`;
    return null;
  };

  const fetchProduction = async () => {
    setLoading(true);
    setError(null);
    let usedBackend = false;
    try {
      const res = await empleadosApi.get('/empleados/reporte-produccion');
      const payload = res.data?.data ?? res.data;
      
      if (!Array.isArray(payload) || payload.length === 0) {
        setPoints(sampleData);
        setMonthlySeries([]);
        setSource('ejemplo');
        return;
      }

      // Aggregate by month
      const map = new Map<string, number>();
      const rawArray = payload as any[];
      for (const it of rawArray) {
        const k = monthKeyFrom(it.p_fecha ?? it.fecha ?? it.date ?? it.p_fecha_registro ?? it.fecha_registro);
        if (!k) continue;
        const v = Number(it.p_unidadesProducidas ?? it.unidades ?? it.unidadesProducidas ?? it.unidades_producidas ?? 0) || 0;
        map.set(k, (map.get(k) ?? 0) + v);
      }

      // last 12 months keys
      const now = new Date();
      const last12: string[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last12.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }

      const monthlyPoints = last12.map((k) => {
        const parts = k.split('-');
        const mm = Number(parts[1]) - 1;
        return { label: monthNames[mm], value: map.get(k) ?? 0 } as SeriesPoint;
      });
      setPoints(monthlyPoints);

      // Build per-month day series (best-effort)
      const monthsData: { key: string; label: string; total: number; days: SeriesPoint[] }[] = [];
      for (const k of last12) {
        const [yStr, mStr] = k.split('-');
        const y = Number(yStr);
        const m = Number(mStr) - 1;
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const daySeries: SeriesPoint[] = [];
        
        for (let d = 1; d <= daysInMonth; d++) {
          const dayLabel = String(d);
          // sum items for this day
          const dayTotal = rawArray.reduce((acc, item) => {
            const dateStr = item.p_fecha ?? item.fecha ?? item.date ?? item.p_fecha_registro ?? item.fecha_registro;
            if (!dateStr) return acc;
            const parsed = new Date(String(dateStr));
            if (!isNaN(parsed.getTime())) {
              if (parsed.getFullYear() === y && parsed.getMonth() === m && parsed.getDate() === d) {
                return acc + (Number(item.p_unidadesProducidas ?? item.unidades ?? item.unidadesProducidas ?? item.unidades_producidas ?? 0) || 0);
              }
            }
            return acc;
          }, 0);
          daySeries.push({ label: dayLabel, value: dayTotal });
        }
        const totalForMonth = daySeries.reduce((s, it) => s + (it.value || 0), 0);
        monthsData.push({ key: k, label: monthNames[m], total: totalForMonth, days: daySeries });
      }
      setMonthlySeries(monthsData);
      usedBackend = true;
      setSource('backend');

    } catch (err: any) {
      console.warn('fetchProduction error', err?.message ?? err);
      setError('No se pudieron cargar datos; mostrando ejemplo');
      setPoints(sampleData);
      setMonthlySeries([]);
      setSource('ejemplo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduction(); }, []);

  const total = points.reduce((s, p) => s + (p.value || 0), 0);
  const average = points.length ? Math.round(total / points.length) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Reportes" subtitle="Métricas de producción por mes" />
      <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
        <View style={{ marginTop: spacing.lg }}>
          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.metricLabel}>Total (12 meses)</Text>
              <Text style={styles.metricValue}>{total}</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Promedio / mes</Text>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{average}</Text>
            </View>
          </View>

          {loading && monthlySeries.length === 0 ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : monthlySeries.length > 0 ? (
            monthlySeries.map((m) => {
              const w = SCREEN_WIDTH;
              const daysLabels = m.days.map((d) => d.label);
              const daysData = m.days.map((d) => d.value);
              return (
                <View key={m.key} style={styles.monthCard}>
                  <View style={styles.monthHeader}>
                    <Text style={styles.monthTitle}>{m.label}</Text>
                    <Text style={{ color: colors.muted }}>Total: {m.total}</Text>
                  </View>
                  <LineChart
                    data={{ labels: daysLabels, datasets: [{ data: daysData }] }}
                    width={w}
                    height={120}
                    chartConfig={{
                      backgroundGradientFrom: '#fff',
                      backgroundGradientTo: '#fff',
                      color: (_opacity = 1) => `rgba(10,108,245, ${_opacity})`,
                      labelColor: (_o = 1) => `rgba(11,18,32, ${_o * 0.8})`,
                      propsForDots: { r: '3', strokeWidth: '1', stroke: colors.primary },
                      style: { borderRadius: 8 },
                    }}
                    withInnerLines={false}
                    withOuterLines={false}
                    withDots={false}
                    style={{ borderRadius: 8 }}
                  />
                </View>
              );
            })
          ) : (
            <Text style={{ color: colors.muted }}>No hay datos mensuales disponibles.</Text>
          )}

          <View style={{ marginTop: spacing.md }}>
            <Button title="Actualizar" onPress={fetchProduction} />
            {error ? <Text style={{ color: '#b91c1c', marginTop: 8 }}>{error}</Text> : null}
            <Text style={{ marginTop: 8, color: colors.muted }}>
                Fuente: {source === 'backend' ? 'Servidor' : source === 'ejemplo' ? 'Ejemplo local' : 'Desconocida'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  metricLabel: { fontSize: 14, color: colors.muted },
  metricValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  monthCard: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  monthTitle: { fontWeight: '700', fontSize: 16 },
});

export default ReportsScreen;