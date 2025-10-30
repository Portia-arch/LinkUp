import React, { useContext, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { firebaseAuth } from '../../config/firebase';
import { FontAwesome } from '@expo/vector-icons';
import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';

export default function FacebookSignInButton() {
  const { setUser } = useContext(AuthContext);

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(firebaseAuth, credential)
        .then((userCredential) => setUser(userCredential.user))
        .catch((err) => Alert.alert('Facebook Login Error', err.message));
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <FontAwesome name="facebook" size={24} color="white" style={{ marginRight: 10 }} />
      <Text style={styles.text}>Sign in with Facebook</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#1877F2', 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  text: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
