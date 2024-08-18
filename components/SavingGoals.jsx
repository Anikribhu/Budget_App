import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8EBBFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
  goalList: {
    flex: 1,
  },
  goalItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  goalAmount: {
    fontSize: 16,
    color: '#007AFF',
  },
  goalDeadline: {
    fontSize: 14,
    color: '#4a4a4a',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dateInput: {
    backgroundColor: '#E9ECEF',
    padding: 10,
    borderRadius: 10,
    width: '30%',
    textAlign: 'center',
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  datePickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

const CustomDatePicker = ({ isVisible, onClose, onDateChange, selectedDate }) => {
  const [date, setDate] = useState(selectedDate);

  const onChange = (type, value) => {
    const newDate = new Date(date);
    if (type === 'year') newDate.setFullYear(value);
    if (type === 'month') newDate.setMonth(value - 1);
    if (type === 'day') newDate.setDate(value);
    setDate(newDate);
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <BlurView intensity={80} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.datePickerContainer}>
            <TextInput
              style={styles.dateInput}
              keyboardType="numeric"
              maxLength={4}
              value={date.getFullYear().toString()}
              onChangeText={(text) => onChange('year', parseInt(text))}
            />
            <TextInput
              style={styles.dateInput}
              keyboardType="numeric"
              maxLength={2}
              value={(date.getMonth() + 1).toString().padStart(2, '0')}
              onChangeText={(text) => onChange('month', parseInt(text))}
            />
            <TextInput
              style={styles.dateInput}
              keyboardType="numeric"
              maxLength={2}
              value={date.getDate().toString().padStart(2, '0')}
              onChangeText={(text) => onChange('day', parseInt(text))}
            />
          </View>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => { onDateChange(date); onClose(); }}>
            <Text style={styles.datePickerButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const SavingGoals = () => {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem('savingGoals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoal = async () => {
    if (name && amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const newGoal = { id: Date.now(), name, amount: parseFloat(amount), deadline };
      try {
        const updatedGoals = [...goals, newGoal];
        await AsyncStorage.setItem('savingGoals', JSON.stringify(updatedGoals));
        setGoals(updatedGoals);
        setName('');
        setAmount('');
        setDeadline(new Date());
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  const renderGoal = ({ item }) => (
    <View style={styles.goalItem}>
      <Text style={styles.goalName}>{item.name}</Text>
      <Text style={styles.goalAmount}>₹{item.amount.toFixed(2)}</Text>
      <Text style={styles.goalDeadline}>{new Date(item.deadline).toDateString()}</Text>
    </View>
  );

  return (
    <LinearGradient  colors={['#24293D', '#2d3860']} style={styles.container}>
      <SafeAreaView style={styles.container} >
      <TextInput
        style={styles.input}
        placeholder="Goal Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>Set Deadline: {deadline.toDateString()}</Text>
      </TouchableOpacity>
      <CustomDatePicker
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={(date) => setDeadline(date)}
        selectedDate={deadline}
      />
      <TouchableOpacity style={styles.button} onPress={saveGoal}>
        <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
        <Text style={styles.buttonText}>Add Saving Goal</Text>
      </TouchableOpacity>
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id.toString()}
        style={styles.goalList}
      />
    </SafeAreaView>
    </LinearGradient>
    
  );
};

export default SavingGoals;
