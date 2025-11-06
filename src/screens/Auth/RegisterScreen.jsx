import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { firebaseAuth } from '../../../config/firebase';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      setUser(userCredential.user);
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 📝</Text>

      <View style={styles.formContainer}>
        <Text>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <Text>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text>Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => {
            if (navigation?.replace) navigation.replace('LogIn');
            else navigation?.navigate?.('LogIn');
          }}
        >
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
  },
  linkText: {
    color: '#28a745',
    fontWeight: '600',
  },
});
