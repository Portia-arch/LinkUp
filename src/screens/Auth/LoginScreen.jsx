import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../../../config/firebase';
import { AuthContext } from '../../context/AuthContext.jsx';
import GoogleSignInButton from '../../components/GoogleSignInButton.jsx';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/linkup-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />


        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <GoogleSignInButton />

          <Text style={styles.link}>
            Don’t have an account?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
              Register
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  logo: {
    width: 160,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
  },
  linkText: {
    color: '#007bff',
    fontWeight: '600',
  },
});
