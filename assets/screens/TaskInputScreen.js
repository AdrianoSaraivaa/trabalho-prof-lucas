import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Alert } from 'react-native';
import TaskInput from './TaskInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function TaskInputScreen({ navigation, route }) {
  const { task } = route.params || {};
  const [tasks, setTasks] = useState([]);
  const cancelButtonScale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      setTasks(parsedTasks);
    } catch (error) {
      console.log('Erro ao carregar tarefas:', error);
    }
  };

  const addOrEditTask = async (taskText, priority, deadline, description) => {
    if (!taskText || !priority || !deadline) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    let updatedTasks;
    if (task) {
      // Editar tarefa existente
      updatedTasks = tasks.map(t =>
        t.key === task.key
          ? { ...t, value: taskText, priority, deadline, description }
          : t
      );
    } else {
      // Adicionar nova tarefa
      const newTask = {
        key: Math.random().toString(),
        value: taskText,
        priority,
        deadline,
        description,
        completed: false,
        postponementHistory: [],
      };
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    navigation.goBack();
  };

  const handleCancelPressIn = () => {
    Animated.spring(cancelButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleCancelPressOut = () => {
    Animated.spring(cancelButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.glassEffectContainer}>
        <TaskInput
          onAddTask={addOrEditTask}
          editingTask={task}
        />
      </View>
      <Animated.View
        style={[styles.cancelButtonContainer, { transform: [{ scale: cancelButtonScale }] }]}
      >
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          onPressIn={handleCancelPressIn}
          onPressOut={handleCancelPressOut}
        >
          <Ionicons name="close-circle" size={36} color="#ff6b6b" />
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f0f20',
  },
  glassEffectContainer: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cancelButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272750',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  cancelText: {
    color: '#ff6b6b',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
});
