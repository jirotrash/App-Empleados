import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootNavigator from './src/navigator/RootNavigator';
import IpLogin from './src/screens/IpLogin';
import { useEffect, useState } from 'react';
import { getStoredApiBase, loadApiBaseUrl } from './src/api/empleadosApi';

const Stack = createNativeStackNavigator();

export default function App() {
  // Forzar que la pantalla de login por IP sea la inicial siempre.
  // Esto muestra `IpLogin` al iniciar incluso si hay una base guardada.
  useEffect(() => {
    // Cargar base guardada para que `empleadosApi` tenga el valor por defecto si existe.
    loadApiBaseUrl().catch(() => {});
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IpLogin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="IpLogin" component={IpLogin} />
        <Stack.Screen name="Root" component={RootNavigator} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

