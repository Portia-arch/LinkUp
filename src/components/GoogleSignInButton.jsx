// import React, { useEffect, useContext } from 'react';
// import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { makeRedirectUri } from 'expo-auth-session';
// import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { firebaseAuth } from '../../config/firebase';
// import { AuthContext } from '../context/AuthContext.jsx';
// import { AntDesign } from '@expo/vector-icons';

// WebBrowser.maybeCompleteAuthSession();

// export default function GoogleSignInButton() {
//   const { setUser } = useContext(AuthContext);

//   const redirectUri = makeRedirectUri({
//   useProxy: true, // This forces Expo to use the auth.expo.dev proxy
// });


//   const expoClientId = '605771402121-i7iso4e2mv46skdp37fif8skeg1phc6o.apps.googleusercontent.com'; // Web client ID for Expo Go
//   const iosClientId = '605771402121-8ulc7f9c97vv2b5vt7e15u5puii69ccd.apps.googleusercontent.com';
//   // const webClientId = '605771402121-lk2q85em3rtjqs1vsi15mhd3n3pvbbp1.apps.googleusercontent.com';

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId,
//     iosClientId,
//     // webClientId,
//   redirectUri, // use the generated one

//     scopes: ['profile', 'email'],
//   });
// console.log(request.redirectUri);

//   useEffect(() => {
//     const handleSignIn = async () => {
//       if (response?.type === 'success') {
//         try {
//           const { idToken } = response.authentication;

//           if (!idToken) {
//             Alert.alert('Google Sign-In failed', 'Missing ID Token');
//             return;
//           }

//           const credential = GoogleAuthProvider.credential(idToken);
//           const userCredential = await signInWithCredential(firebaseAuth, credential);

//           setUser(userCredential.user);
//         } catch (error) {
//           console.error('Firebase Sign-In Error:', error);
//           Alert.alert('Login Error', error.message);
//         }
//       } else if (response?.type === 'error') {
//         console.error('Google Auth Error:', response.error);
//         Alert.alert('Google Sign-In failed', response.error);
//       }
//     };

//     handleSignIn();
//   }, [response]);

//   return (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={async () => {
//         try {
//           await promptAsync();
//         } catch (err) {
//           console.error('Prompt Async Error:', err);
//           Alert.alert('Error', err.message);
//         }
//       }}
//       disabled={!request}
//       activeOpacity={0.8}
//     >
//       <AntDesign name="google" size={22} color="white" style={{ marginRight: 10 }} />
//       <Text style={styles.text}>Continue with Google</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: 'row',
//     backgroundColor: '#DB4437',
//     padding: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 8,
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });


import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { AntDesign } from "@expo/vector-icons";

const AUTH0_DOMAIN = "https://dev-v3e75p3t5h0rdrr0.us.auth0.com";
const AUTH0_CLIENT_ID = "MFMe6i4kUH6qvrjQ3SkKNJntn2eBp7lH";

// Must match your app.json scheme
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "linkup",
  useProxy: true,   // Expo Go requirement
});

export default function GoogleButton() {
  const loginWithGoogle = async () => {
    try {
      const authUrl =
        `${AUTH0_DOMAIN}/authorize?` +
        `client_id=${AUTH0_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_type=token` +
        `&scope=openid profile email` +
        `&connection=google-oauth2`;

      console.log("Opening URL:", authUrl);

      const result = await AuthSession.startAsync({
        authUrl,
        returnUrl: REDIRECT_URI,
      });

      console.log("Auth0 Result:", result);

      if (result.type === "success") {
        Alert.alert("Success", "Google login successful!");
      } else {
        Alert.alert("Cancelled", "Google login cancelled");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={loginWithGoogle}>
      <AntDesign name="google" size={22} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.text}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#DB4437",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
