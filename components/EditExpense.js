// components/EditExpense.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const EditExpense = ({ route, navigation }) => {
  const { expense } = route.params;
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount.toString());

  const handleSave = async () => {
    if (description && !isNaN(amount) && parseFloat(amount) !== 0) {
      try {
        const updatedExpense = { ...expense, description, amount: parseFloat(amount) };
        const expensesData = await AsyncStorage.getItem('expenses');
        const expenses = expensesData ? JSON.parse(expensesData) : [];
        const updatedExpenses = expenses.map(exp => (exp.id === expense.id ? updatedExpense : exp));
        await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        navigation.goBack();
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    } else {
      Alert.alert('Validation Error', 'Please enter valid description and amount.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#ffffff" />
        <Text style={styles.buttonText}>Save</Text>
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
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default EditExpense;
