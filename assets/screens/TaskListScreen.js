import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Animated, PanResponder } from 'react-native';
import TaskItem from './TaskItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({ pending: 0, postponed: 0, total: 0 });
  const [filter, setFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const pan = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0]; // Estado para o movimento do botão

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      setTasks(parsedTasks);
      updateTaskCounts(parsedTasks);
    } catch (error) {
      console.log('Erro ao carregar tarefas:', error);
    }
  };

  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      console.log('Erro ao salvar tarefas:', error);
    }
  };

  const updateTaskCounts = (tasksToCount) => {
    const pending = tasksToCount.filter(task => !task.completed && task.postponementHistory.length === 0).length;
    const postponed = tasksToCount.filter(task => task.postponementHistory.length > 0).length;
    const total = tasksToCount.length;
    setTaskCounts({ pending, postponed, total });
  };

  const deleteTask = (taskKey) => {
    const updatedTasks = tasks.filter(task => task.key !== taskKey);
    setTasks(updatedTasks);
  };

  const toggleCompleteTask = (taskKey) => {
    const updatedTasks = tasks.map(task =>
      task.key === taskKey ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const editTask = (task) => {
    navigation.navigate('TaskInput', { task });
  };

  const postponeTask = (taskKey) => {
    const updatedTasks = tasks.map(task => {
      if (task.key === taskKey) {
        const newDeadline = new Date(task.deadline || Date.now());
        newDeadline.setDate(newDeadline.getDate() + 1);
        return {
          ...task,
          deadline: newDeadline,
          postponementHistory: [...task.postponementHistory, new Date()],
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'priority') return task.priority === 'Alta';
    if (filter === 'overdue') return new Date(task.deadline) < new Date() && !task.completed;
    return false;
  });

  const tasksToShow = showCompleted
    ? filteredTasks
    : filteredTasks.filter(task => !task.completed);

  // Configuração do PanResponder para o botão móvel
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    },
    onPanResponderMove: Animated.event(
      [
        null,
        { dx: pan.x, dy: pan.y }
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('all')}>
          <Text style={[styles.filterButton, filter === 'all' && styles.activeFilter]}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('priority')}>
          <Text style={[styles.filterButton, filter === 'priority' && styles.activeFilter]}>Alta Prioridade</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('overdue')}>
          <Text style={[styles.filterButton, filter === 'overdue' && styles.activeFilter]}>Atrasadas</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setShowCompleted(!showCompleted)}>
        <Text style={styles.showCompletedButton}>
          {showCompleted ? 'Ocultar Concluídas' : 'Mostrar Concluídas'}
        </Text>
      </TouchableOpacity>
      <View style={styles.counters}>
        <Text style={styles.counterText}>Pendentes: {taskCounts.pending}</Text>
        <Text style={styles.counterText}>Adiadas: {taskCounts.postponed}</Text>
        <Text style={styles.counterText}>Total: {taskCounts.total}</Text>
      </View>
      <FlatList
        data={tasksToShow}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={() => deleteTask(item.key)}
            onEdit={() => editTask(item)}
            onToggleComplete={() => toggleCompleteTask(item.key)}
            onPostpone={() => postponeTask(item.key)}
          />
        )}
        keyExtractor={item => item.key}
      />
      <Animated.View
        style={[
          styles.addButtonContainer,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('TaskInput')}
        >
          <Ionicons name="add" size={32} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2a2d3e',
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    color: '#ccc',
    fontSize: 16,
  },
  activeFilter: {
    color: '#fff',
    fontWeight: 'bold',
  },
  showCompletedButton: {
    color: '#4a90e2',
    textAlign: 'center',
    marginVertical: 10,
  },
  counters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
  },
  counterText: {
    color: '#cfcfcf',
    fontSize: 16,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
