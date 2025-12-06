import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeList from '../screens/EmployeeList';
import EmployeeForm from '../screens/EmployeeForm';
import EmployeeDetails from '../screens/EmployeeDetails';
import useEmpleados from '../hooks/useEmpleados';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export const EmpleadosNavigator: React.FC = () => {
  const { employees, loading, refreshing, error, loadingMore, loadMore, fetchEmployees, createEmpleado, updateEmpleado, deleteEmpleado, refresh } = useEmpleados();

  if (loading && employees.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="List" options={{ title: 'Empleados' }}>
        {({ navigation }) => (
          <EmployeeList
            employees={employees}
            onCreate={() => navigation.navigate('Create')}
            onSelect={(id) => navigation.navigate('Details', { id })}
            onRefresh={refresh}
            refreshing={refreshing || loading}
            onEndReached={loadMore}
            loadingMore={loadingMore}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Create" options={{ title: 'Nuevo Empleado' }}>
        {({ navigation }) => (
          <EmployeeForm
            onCancel={() => navigation.goBack()}
            onSave={async (data) => {
              await createEmpleado(data as any);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Details" options={{ title: 'Detalle' }}>
        {({ navigation, route }) => {
          const id = (route.params as any)?.id as number | undefined;
          const empleado = employees.find((e) => e.id === id) ?? null;
          return (
            <EmployeeDetails
              empleado={empleado}
              onBack={() => navigation.goBack()}
              onEdit={(emp) => navigation.navigate('Edit', { id: emp.id })}
              onDelete={async (idDel) => {
                await deleteEmpleado(idDel as number);
                navigation.navigate('List');
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="Edit" options={{ title: 'Editar Empleado' }}>
        {({ navigation, route }) => {
          const id = (route.params as any)?.id as number | undefined;
          const empleado = employees.find((e) => e.id === id) ?? undefined;
          return (
            <EmployeeForm
              initial={empleado}
              onCancel={() => navigation.goBack()}
              onSave={async (data) => {
                if (id != null) await updateEmpleado(id, data as any);
                navigation.navigate('List');
              }}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default EmpleadosNavigator;