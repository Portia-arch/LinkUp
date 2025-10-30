import React, { useContext } from 'react';
import { Button, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { firebaseAuth } from '../../config/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext.jsx';

const CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

export default function GoogleSignInButton() {
  const { setUser } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    try {
      const result = await Google.startAsync({
        clientId: CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        const { idToken, accessToken } = result.params;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        const userCredential = await signInWithCredential(firebaseAuth, credential);
        setUser(userCredential.user);
      } else {
        Alert.alert('Google Sign-In cancelled');
      }
    } catch (error) {
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  return <Button title="Sign in with Google" onPress={handleGoogleSignIn} />;
}
