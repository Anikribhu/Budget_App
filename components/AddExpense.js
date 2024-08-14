import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddExpense = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const saveExpense = async () => {
    if (!amount || !description) {
      setError('Please fill out all fields.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError('Please enter a valid amount.');
      return;
    }
    setError('');

    const newExpense = { id: Date.now(), amount: parsedAmount, description, date: new Date() };
    try {
      const expenses = await AsyncStorage.getItem('expenses');
      const parsedExpenses = expenses ? JSON.parse(expenses) : [];
      await AsyncStorage.setItem('expenses', JSON.stringify([newExpense, ...parsedExpenses]));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={saveExpense}>
        <Ionicons name="save-outline" size={24} color="#ffffff" />
        <Text style={styles.buttonText}>Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
  errorText: {
    color: '#F44336',
    marginBottom: 15,
  },
});

export default AddExpense;
