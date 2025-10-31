// import React, { useEffect, useContext } from 'react';
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { firebaseAuth } from '../../config/firebase';
// import { AuthContext } from '../context/AuthContext';
// import { AntDesign } from '@expo/vector-icons';

// WebBrowser.maybeCompleteAuthSession();

// export default function GoogleSignInButton() {
//   const { setUser } = useContext(AuthContext);

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
//     iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
//     webClientId: '605771402121-8irmonot0i5gn2qjrq46k0hih3njrs1q.apps.googleusercontent.com',
//     scopes: ['profile', 'email'],
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params;

//       const credential = GoogleAuthProvider.credential(id_token);
//       signInWithCredential(firebaseAuth, credential)
//         .then((userCredential) => {
//           setUser(userCredential.user);
//           console.log('Google login success', userCredential.user);
//         })
//         .catch((err) => console.error('Firebase login error:', err));
//     }
//   }, [response]);

//   return (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={() => promptAsync()}
//       disabled={!request}
//     >
//       <AntDesign name="google" size={24} color="white" style={{ marginRight: 10 }} />
//       <Text style={styles.text}>Sign in with Google</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: 'row',
//     backgroundColor: '#DB4437',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 5,
//   },
//   text: { color: 'white', fontSize: 16, fontWeight: 'bold' },
// });


// src/components/GoogleSignInButton.jsx
import React, { useEffect, useContext } from 'react';
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { AuthContext } from '../context/AuthContext.jsx';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const { setUser } = useContext(AuthContext);

  // 👇 replace with your Web client ID (NOT iOS or Android)
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '214948578936-m24id4bh0oqe7nv5l8euh0j09h6j29hd.apps.googleusercontent.com',
    webClientId: '214948578936-m24id4bh0oqe7nv5l8euh0j09h6j29hd.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(firebaseAuth, credential)
        .then((userCredential) => {
          setUser(userCredential.user);
        })
        .catch((error) => {
          Alert.alert('Firebase Sign-In Error', error.message);
        });
    } else if (response?.type === 'error') {
      Alert.alert('Google Sign-In failed');
    }
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}
