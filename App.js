// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import SavingGoals from './components/SavingGoals';
import EditExpense from './components/EditExpense';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Xpenzer' }} />
        <Stack.Screen name="AddExpense" component={AddExpense} options={{ title: 'Add Expense' }} />
        <Stack.Screen name="SavingGoals" component={SavingGoals} options={{ title: 'Saving Goals' }} />
        <Stack.Screen name="EditExpense" component={EditExpense} options={{ title: 'Edit Expense' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
