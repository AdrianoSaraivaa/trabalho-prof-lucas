import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskItem({ task, onDelete, onEdit, onToggleComplete, onPostpone }) {
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useState(new Animated.Value(0))[0];
  const overdueAnim = useState(new Animated.Value(1))[0]; // Animação para tarefas atrasadas

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(expandAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Animação para tarefas atrasadas
  useEffect(() => {
    if (new Date(task.deadline) < new Date() && !task.completed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(overdueAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(overdueAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [task]);

  const expandHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  // Objeto de cores das bordas para cada prioridade
  const borderColorStyles = {
    Alta: { borderColor: '#ff6347' },
    Média: { borderColor: '#ffa500' },
    Baixa: { borderColor: '#32cd32' },
  };

  // Normaliza a prioridade para coincidir com as chaves
  const normalizedPriority = task.priority?.trim();

  return (
    <Animated.View
      style={[
        styles.taskContainer,
        borderColorStyles[normalizedPriority] || {},
        new Date(task.deadline) < new Date() && !task.completed
          ? { opacity: overdueAnim } // Aplica a animação para tarefas atrasadas
          : {},
      ]}
    >
      <Text style={[styles.taskText, task.completed && styles.completedText]}>
        {task.value}
      </Text>
      <Text style={styles.priorityText}>Prioridade: {task.priority}</Text>
      <Text style={styles.deadlineText}>
        Prazo: {task.deadline ? new Date(task.deadline).toLocaleString() : 'Sem data'}
      </Text>
      <TouchableOpacity onPress={toggleExpand} style={styles.menuButton}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </TouchableOpacity>

      <Animated.View style={[styles.actionsContainer, { height: expandHeight }]}>
        {expanded && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Ionicons name="create" size={20} color="#4a90e2" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Ionicons name="trash" size={20} color="#ff6347" />
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onToggleComplete} style={styles.actionButton}>
              <Ionicons
                name={task.completed ? 'undo' : 'checkmark-done'}
                size={20}
                color="#32cd32"
              />
              <Text style={styles.actionText}>
                {task.completed ? 'Desmarcar' : 'Concluído'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPostpone} style={styles.actionButton}>
              <Ionicons name="time" size={20} color="#ffa500" />
              <Text style={styles.actionText}>Adiar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#2b2b3e',
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  taskText: {
    color: '#f1f1f1',
    fontSize: 18,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  priorityText: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 5,
  },
  deadlineText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  actionsContainer: {
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
  },
});
