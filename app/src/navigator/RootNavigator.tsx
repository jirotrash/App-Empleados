import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import EmpleadosNavigator from './EmpleadosNavigator';
import ReportsScreen from '../screens/Reports';
import SettingsScreen from '../screens/Settings';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8b9db6',
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIcon: ({ color, size }) => {
          let name: React.ComponentProps<typeof MaterialIcons>['name'] = 'home';
          if (route.name === 'Empleados') name = 'people';
          if (route.name === 'Reportes') name = 'analytics';
          if (route.name === 'Ajustes') name = 'settings';
          return <MaterialIcons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Empleados" component={EmpleadosNavigator} />
      <Tab.Screen name="Reportes" component={ReportsScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default RootNavigator;
