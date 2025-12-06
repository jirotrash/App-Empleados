import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';
import { setApiBaseUrl, buildApiBaseFromInput } from '../api/empleadosApi';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const IpLogin: React.FC = () => {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation: any = useNavigation();

  const handleSubmit = async () => {
    if (!ip) return Alert.alert('IP requerida', 'Introduce la IP del servidor');
    setLoading(true);
    try {
      // Primero intentamos conectar a la URL formada para validar antes de guardar
      const base = buildApiBaseFromInput(ip);
      const tmp = axios.create({ baseURL: base, timeout: 5000 });
      await tmp.get('/empleados/reporte-produccion');
      // Si pasa, guardamos la base y navegamos
      await setApiBaseUrl(ip);
      navigation.replace('Root');
    } catch (err: any) {
      console.warn('IpLogin test error', err?.message ?? err);
      Alert.alert('Error de conexión', `No se pudo conectar a ${buildApiBaseFromInput(ip)}\n${err?.message ?? ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.title}>Conectar al servidor</Text>
        <Text style={styles.sub}>Introduce la IP del servidor para continuar</Text>

        <TextInput
          value={ip}
          onChangeText={setIp}
          placeholder="192.168.0.198:3000"
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#9AA3B2"
          autoCapitalize="none"
          returnKeyType="done"
        />

        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.8 }]} onPress={handleSubmit} activeOpacity={0.9}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Conectar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface, justifyContent: 'center', padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    maxWidth: 560,
    alignSelf: 'center',
  },
  welcome: { fontSize: 30, color: colors.muted, textAlign: 'center', marginBottom: 8, fontWeight: '800' },
  title: { fontSize: fontSizes.xxxl ? fontSizes.xxxl : 28, fontWeight: '900', color: colors.text, marginBottom: 6, textAlign: 'left' },
  sub: { color: colors.muted, marginBottom: spacing.md },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EDF8',
    marginBottom: spacing.md,
    // sombras
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // sombra
    ...Platform.select({
      ios: { shadowColor: '#007AFF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16 },
      android: { elevation: 4 },
    }),
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

export default IpLogin;
