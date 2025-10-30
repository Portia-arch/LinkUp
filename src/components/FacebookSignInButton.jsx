import React, { useContext, useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { firebaseAuth } from '../../config/firebase';
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

  return <Button title="Sign in with Facebook" onPress={() => promptAsync()} />;
}
