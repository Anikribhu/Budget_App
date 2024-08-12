import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import ExpenseTracking from '../components/ExpenseTracking';
import SavingsGoals from '../components/SavingsGoals';

export default function Homepage({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <ExpenseTracking />
      <SavingsGoals />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
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
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: '600',
  },
});
