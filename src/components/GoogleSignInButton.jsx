import React, { useEffect, useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { AuthContext } from '../context/AuthContext.jsx';
import { AntDesign } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const { setUser } = useContext(AuthContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
     expoClientId: '605771402121-78c4bjmrua3f4hlhql929mkk8bvm7cmb.apps.googleusercontent.com',
    webClientId: '605771402121-78c4bjmrua3f4hlhql929mkk8bvm7cmb.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    const signInWithGoogle = async () => {
      try {
        if (response?.type === 'success') {
          const { authentication } = response;
          if (!authentication?.idToken) {
            Alert.alert('Google Sign-In failed', 'Missing ID token');
            return;
          }

          const credential = GoogleAuthProvider.credential(authentication.idToken);
          const userCredential = await signInWithCredential(firebaseAuth, credential);
          setUser(userCredential.user);
        } else if (response?.type === 'error') {
          Alert.alert('Google Sign-In failed');
        }
      } catch (error) {
        Alert.alert('Firebase Sign-In Error', error.message);
        console.error('Google Sign-In Error:', error);
      }
    };

    signInWithGoogle();
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => promptAsync()}
      disabled={!request}
      activeOpacity={0.8}
    >
      <AntDesign name="google" size={22} color="white" style={{ marginRight: 10 }} />
      <Text style={styles.text}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: { color: 'white', fontSize: 16, fontWeight: '600' },
});
