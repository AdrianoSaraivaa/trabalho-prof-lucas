
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from './assets/screens/TaskListScreen';
import TaskInputScreen from './assets/screens/TaskInputScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="TaskList" 
          component={TaskListScreen} 
          options={{ title: 'Minhas Tarefas' }} 
        />
        <Stack.Screen 
          name="TaskInput" 
          component={TaskInputScreen} 
          options={{ title: 'Adicionar Tarefa' }} 
        /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}