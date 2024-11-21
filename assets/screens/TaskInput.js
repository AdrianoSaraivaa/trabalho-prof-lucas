
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function TaskInput({ onAddTask, editingTask }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadlineDate, setDeadlineDate] = useState(null);
  const [deadlineTime, setDeadlineTime] = useState(null);
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0]; 

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.value);
      setPriority(editingTask.priority || 'medium');
      setDeadlineDate(editingTask.deadline ? new Date(editingTask.deadline) : null);
      setDeadlineTime(editingTask.deadline ? new Date(editingTask.deadline) : null);
      setDescription(editingTask.description || '');
    }
  }, [editingTask]);

  const handleAddTask = () => {
    const deadline = deadlineDate && deadlineTime
      ? new Date(deadlineDate.setHours(deadlineTime.getHours(), deadlineTime.getMinutes()))
      : null;
    onAddTask(task, priority, deadline, description);
    setTask('');
    setPriority('medium');
    setDeadlineDate(null);
    setDeadlineTime(null);
    setDescription('');
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Título da Tarefa"
        placeholderTextColor="#bbb"
        style={styles.input}
        value={task}
        onChangeText={setTask}
      />
      <TextInput
        placeholder="Descrição"
        placeholderTextColor="#bbb"
        style={[styles.input, styles.descriptionInput]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.priorityContainer}>
        <Text style={styles.label}>Prioridade:</Text>
        <Picker
          selectedValue={priority}
          style={styles.picker}
          onValueChange={(itemValue) => setPriority(itemValue)}
        >
          <Picker.Item label="Alta" value="Alta" />
          <Picker.Item label="Média" value="Média" />
          <Picker.Item label="Baixa" value="Baixa" />

        </Picker>
      </View>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {deadlineDate ? deadlineDate.toLocaleDateString() : 'Definir Data Limite'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {deadlineTime ? deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Definir Horário Limite'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={deadlineDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDeadlineDate(selectedDate);
          }}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={deadlineTime || new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setDeadlineTime(selectedTime);
          }}
        />
      )}

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTask}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.addButtonText}>{editingTask ? "Salvar" : "Adicionar"}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Efeito glassmorphism
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    color: '#E5E5E5',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    color: '#E5E5E5',
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#E5E5E5',
    backgroundColor: '#333',
    borderRadius: 8,
  },
  dateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  dateText: {
    color: '#E5E5E5',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});




