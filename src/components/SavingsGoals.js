import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { db, auth } from '../utils/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'savingsGoals'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const goalsData = [];
        querySnapshot.forEach((doc) => {
          goalsData.push({ id: doc.id, ...doc.data() });
        });
        setGoals(goalsData);
      });
      return () => unsubscribe();
    }
  }, []);

  const addGoal = async () => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'savingsGoals'), {
        userId: user.uid,
        name,
        targetAmount: parseFloat(targetAmount),
        deadline: new Date(deadline),
        currentAmount: 0,
      });
      setName('');
      setTargetAmount('');
      setDeadline('');
    }
  };

  const deleteGoal = async (id) => {
    await deleteDoc(doc(db, 'savingsGoals', id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings Goals</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={globalStyles.input}
          placeholder="Goal Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Target Amount"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Deadline (YYYY-MM-DD)"
          value={deadline}
          onChangeText={setDeadline}
        />
        <Button title="Add Goal" onPress={addGoal} />
      </View>
      <FlatList
        style={styles.list}
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>{item.name}</Text>
            <Text>Target Amount: {item.targetAmount}</Text>
            <Text>Deadline: {item.deadline.toDate().toLocaleDateString()}</Text>
            <Text>Progress: {item.currentAmount} / {item.targetAmount}</Text>
            <Button title="Delete" onPress={() => deleteGoal(item.id)} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  goalItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
