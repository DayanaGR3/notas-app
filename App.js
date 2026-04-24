import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import ConsultaScreen          from './screens/ConsultaScreen';
import RegistroEstudianteScreen from './screens/RegistroEstudianteScreen';
import RegistroNotaScreen       from './screens/RegistroNotaScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Consulta:        '🔍',
              'Reg. Estud.':   '👤',
              'Reg. Nota':     '📝',
            };
            return <Text style={{ fontSize: size - 4 }}>{icons[route.name]}</Text>;
          },
          tabBarActiveTintColor:   '#3498db',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            height: 60,
            paddingBottom: 8,
          },
          headerStyle:            { backgroundColor: '#2c3e50' },
          headerTintColor:        '#fff',
          headerTitleStyle:       { fontWeight: 'bold' },
          tabBarLabelStyle:       { fontSize: 12, fontWeight: '600' },
        })}
      >
        <Tab.Screen
          name="Consulta"
          component={ConsultaScreen}
          options={{ title: 'Consulta de Notas' }}
        />
        <Tab.Screen
          name="Reg. Estud."
          component={RegistroEstudianteScreen}
          options={{ title: 'Registro Estudiante' }}
        />
        <Tab.Screen
          name="Reg. Nota"
          component={RegistroNotaScreen}
          options={{ title: 'Registro de Nota' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
