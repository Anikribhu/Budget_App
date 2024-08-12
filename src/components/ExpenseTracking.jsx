import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { db, auth } from '../utils/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function ExpenseTracking() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const expensesData = [];
        querySnapshot.forEach((doc) => {
          expensesData.push({ id: doc.id, ...doc.data() });
        });
        setExpenses(expensesData);
      });
      return () => unsubscribe();
    }
  }, []);

  const addExpense = async () => {
    if (!amount || !category) {
      Alert.alert('Input Error', 'Please enter both amount and category.');
      return;
    }
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'expenses'), {
        userId: user.uid,
        amount: parseFloat(amount),
        category,
        date: new Date(),
      });
      setAmount('');
      setCategory('');
    }
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, 'expenses', id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracking</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity style={styles.button} onPress={addExpense}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.amount} - {item.category}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteExpense(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529', 
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF', 
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF', 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
  },
  itemText: {
    fontSize: 16,
    color: '#212529',
  },
  deleteButton: {
    backgroundColor: '#FF4D4D', 
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
