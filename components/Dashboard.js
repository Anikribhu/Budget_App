import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};

const ExpenseItem = ({ item, onEdit, onRemove }) => (
  <View style={styles.expenseItem}>
    <View style={styles.expenseIconContainer}>
      <Ionicons 
        name={item.amount >= 0 ? "remove-circle" : "add-circle"} 
        size={24} 
        color={item.amount >= 0 ? "red" : "green"}
      />
    </View>
    <View style={styles.expenseDetails}>
      <Text style={styles.expenseDescription}>{item.description}</Text>
      <Text style={[styles.expenseAmount, { color: item.amount >= 0 ? "red" : "green" }]}>
        ₹{Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
    <View style={styles.timestampContainer}>
      <Text style={styles.timestampText}>{formatDate(item.date)}</Text>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionButton}>
        <Ionicons name="pencil-outline" size={20} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.actionButton}>
        <Ionicons name="trash-outline" size={20} color="#F44336" />
      </TouchableOpacity>
    </View>
  </View>
);

const Dashboard = ({ navigation }) => {
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadExpenses();
    });

    return unsubscribe;
  }, [navigation]);

  const loadExpenses = async () => {
    try {
      const expensesData = await AsyncStorage.getItem('expenses');
      const parsedExpenses = expensesData ? JSON.parse(expensesData) : [];
      const sortedExpenses = parsedExpenses
        .map(expense => ({ ...expense, date: new Date(expense.date) }))
        .sort((a, b) => b.date - a.date);
      setExpenses(sortedExpenses);
      const total = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpense(Math.max(total, 0));
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleEditExpense = (expense) => {
    const expenseWithDateString = {
      ...expense,
      date: expense.date.toISOString(), 
    };
    navigation.navigate('EditExpense', { expense: expenseWithDateString });
  };

  const handleRemoveExpense = (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updatedExpenses = expenses.filter(expense => expense.id !== id);
              await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
              setExpenses(updatedExpenses);
              const total = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
              setTotalExpense(Math.max(total, 0));
            } catch (error) {
              console.error('Error deleting expense:', error);
            }
          },
        },
      ],
    );
  };

  const handleRemoveAllExpenses = () => {
    Alert.alert(
      'Remove All Entries',
      'Are you sure you want to remove all entries?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove All',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('expenses');
              setExpenses([]);
              setTotalExpense(0);
            } catch (error) {
              console.error('Error removing all expenses:', error);
            }
          },
        },
      ],
    );
  };

  const ListHeader = () => (
    <View style={styles.header}>
      <View style={styles.totalExpenseContainer}>
        <Ionicons name="wallet-outline" size={48} color="#4a4a4a" />
        <Text style={styles.totalExpenseText}>Total Expense</Text>
        <Text style={styles.totalExpenseAmount}>₹{totalExpense.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SavingGoals')}
      >
        <Ionicons name="trophy-outline" size={24} color="#ffffff" />
        <Text style={styles.buttonText}>Saving Goals</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <ExpenseItem 
            item={item} 
            onEdit={handleEditExpense} 
            onRemove={handleRemoveExpense} 
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.removeAllButton}
        onPress={handleRemoveAllExpenses}
      >
        <Ionicons name="trash-outline" size={24} color="#ffffff" />
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
  listContent: {
    paddingBottom: 80, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalExpenseContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  totalExpenseText: {
    fontSize: 18,
    color: '#4a4a4a',
  },
  totalExpenseAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  expenseIconContainer: {
    marginRight: 15,
  },
  expenseDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseDescription: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestampContainer: {
    marginLeft: 10,
  },
  timestampText: {
    fontSize: 14,
    color: '#4a4a4a',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
  },
  removeAllButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, 
  },
});

export default Dashboard;
