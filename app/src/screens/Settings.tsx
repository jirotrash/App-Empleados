import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform, BackHandler, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSizes } from '../theme';
import { setApiBaseUrl, loadApiBaseUrl, clearApiBase, buildApiBaseFromInput } from '../api/empleadosApi';
import axios from 'axios';

const SettingsScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [ip, setIp] = useState<string>('');
  const [loadingIp, setLoadingIp] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingIp(true);
    loadApiBaseUrl()
      .then((url) => {
        if (!mounted) return;
        // extraer host/port de la url si tiene formato http://ip:port/...
        try {
          const u = new URL(url);
          setIp(u.hostname);
        } catch (e) {
          // si no es URL completa, usa como viene
          setIp(url ?? '');
        }
      })
      .catch(() => {})
      .finally(() => setLoadingIp(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveIp = async () => {
    if (!ip) return Alert.alert('IP requerida', 'Introduce la IP del servidor');
    try {
      await setApiBaseUrl(ip);
      Alert.alert('Listo', 'La dirección del API se guardó correctamente.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar la dirección del API.');
    }
  };

  const handleTestConnection = async () => {
    if (!ip) return Alert.alert('IP requerida', 'Introduce la IP del servidor');
    const url = buildApiBaseFromInput(ip);
    const tmp = axios.create({ baseURL: url, timeout: 5000 });
    try {
      // Intentamos el endpoint de reporte-produccion como prueba
      await tmp.get('/empleados/reporte-produccion');
      Alert.alert('Conexión exitosa', `Se pudo conectar a ${url}`);
    } catch (err: any) {
      console.warn('testConnection error', err?.message ?? err);
      Alert.alert('Error de conexión', `No se pudo conectar a ${url}\n${err?.message ?? ''}`);
    }
  };

  const handleSalir = () => {
    Alert.alert('Salir', '¿Deseas cerrar sesión y volver a la pantalla de conexión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearApiBase();
          } catch (e) {
            console.warn('clearApiBase failed', e);
          }
          // Reemplazamos la pila por la pantalla de IpLogin
          navigation.replace('IpLogin');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      <Text style={styles.sub}>Opciones de la aplicación, perfiles y preferencias.</Text>

      <View style={{ marginTop: spacing.md }}>
        <Text style={{ marginBottom: 6, color: colors.muted }}>IP del servidor API</Text>
        <TextInput
          value={ip}
          onChangeText={setIp}
          placeholder="192.168.0.198"
          keyboardType="numbers-and-punctuation"
          style={{ backgroundColor: colors.card, padding: spacing.sm, borderRadius: 8 }}
        />
        <View style={{ marginTop: spacing.sm, flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Button title={loadingIp ? 'Cargando...' : 'Guardar IP'} onPress={handleSaveIp} />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Button title="Probar conexión" onPress={handleTestConnection} />
          </View>
        </View>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <Button title="Salir" color={colors.danger} onPress={handleSalir} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.surface },
  title: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  sub: { marginTop: 8, color: colors.muted },
});

export default SettingsScreen;
