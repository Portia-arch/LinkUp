import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../App';

export default function AuthScreen() {
  const { signIn, register, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Welcome — sign in</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Button title="Sign in" onPress={() => { setLoading(true); signIn(email, password).finally(() => setLoading(false)); }} />
      <View style={{ height: 8 }} />
      <Button title="Register" onPress={() => register(email, password)} />
      <View style={{ height: 16 }} />
      <Button title="Sign in with Google" onPress={() => signInWithGoogle()} />
      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
    </SafeAreaView>
  );
}