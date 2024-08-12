import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

// App logo Link for future use
const logoUrl = 'https://example.com/logo.png';

export default function Onboarding({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Image 
        source={{ uri: logoUrl }} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.welcomeText}>Welcome to Budget Buddy</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Registration')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.link} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#212529',
  },
  button: {
    backgroundColor: '#28A745', 
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginVertical: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
