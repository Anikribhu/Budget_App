import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <LinearGradient colors={['#24293E','#2d3860']} style={styles.container}>
      <BlurView style={styles.blurContainer}>
        <SafeAreaView style={styles.card}>
          <Text style={styles.title}>Add New Expense</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount (₹)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#aaaaaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#aaaaaa"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={saveExpense}>
            <Ionicons name="save-outline" size={24} color="#ffffff" />
            <Text style={styles.buttonText}>Save Expense</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  blurContainer: {
    borderRadius: 40,
    overflow:"hidden"

  },
  card: {
    backgroundColor: '#38405a', // Semi-transparent background
    borderRadius: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 20.00,

    elevation: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff', // Slightly transparent input background
    padding: 15,
    borderRadius: 30,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8EBBFF',
    padding: 15,
    borderRadius: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddExpense;
