import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      size={28}
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
      <Ionicons name="pencil-outline" size={22} color="#007AFF" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.actionButton}>
      <Ionicons name="trash-outline" size={22} color="#F44336" />
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
    <BlurView intensity={10} style={styles.header}>
      <View style={styles.totalExpenseContainer}>
        <Ionicons name="wallet-outline" size={48} color="#ffffff" />
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
    </BlurView>
  );

  return (
    <LinearGradient colors={['#24293E','#2d3860']} style={styles.container}>
       <SafeAreaView >
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
      {expenses.length > 0 && (
        <TouchableOpacity
          style={styles.removeAllButton}
          onPress={handleRemoveAllExpenses}
        >
          <Ionicons name="trash-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
    </LinearGradient>
   
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: '#2e3653',
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  totalExpenseContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalExpenseText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
  },
  totalExpenseAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8EBBFF',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4FC',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontWeight: '500',
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
    top: '120%',
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});



export default Dashboard;
