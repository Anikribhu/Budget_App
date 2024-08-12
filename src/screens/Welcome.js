import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function Welcome({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={styles.welcomeText}>Welcome to Budget Buddy!</Text>
      <Text style={styles.descriptionText}>Let's start managing your finances.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Homepage')}>
        <Text style={styles.buttonText}>Go to Homepage</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 18,
    color: '#666', 
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007BFF', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: '600',
  },
});
