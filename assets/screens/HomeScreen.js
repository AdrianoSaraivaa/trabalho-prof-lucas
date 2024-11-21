
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const addTask = (taskText, priority, deadline, description) => {
    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((t) =>
          t.key === editingTask.key
            ? { ...t, value: taskText, priority, deadline, description }
            : t
        )
      );
      setEditingTask(null);
    } else {
      const newTask = {
        key: Math.random().toString(),
        value: taskText,
        priority,
        deadline,
        description,
        completed: false,
        postponementHistory: []
      };
      setTasks((currentTasks) => [...currentTasks, newTask]);
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
  };

  const deleteTask = (taskKey) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.key !== taskKey)
    );
  };

  const viewTaskDetails = (task) => {
    navigation.navigate('TaskDetail', { task });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <TaskInput onAddTask={addTask} editingTask={editingTask} />
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onDelete={() => deleteTask(item.key)}
              onEdit={() => editTask(item)}
              onToggleComplete={() => viewTaskDetails(item)}
            />
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noTasksText}>Nenhuma tarefa adicionada.</Text>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setEditingTask(null)}>
        <Ionicons name="add-circle" size={70} color="#1e90ff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: '#f1f1f1',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100,
  },
  noTasksText: {
    color: '#bbb',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1e90ff',
    borderRadius: 35,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

