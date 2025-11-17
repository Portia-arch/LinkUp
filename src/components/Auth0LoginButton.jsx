import React, { useEffect, useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuthRequest } from 'expo-auth-session';
import { AuthContext } from '../context/AuthContext.jsx';

WebBrowser.maybeCompleteAuthSession();

const AUTH0_DOMAIN = 'dev-v3e75p3t5h0rdrr0.us.auth0.com';
const AUTH0_CLIENT_ID = 'MFMe6i4kUH6qvrjQ3SkKNJntn2eBp7lH';

export default function Auth0LoginButton() {
  const { setUser } = useContext(AuthContext);

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  console.log('Redirect URI:', redirectUri);


  const discovery = {
    authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
    tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
    revocationEndpoint: `https://${AUTH0_DOMAIN}/v2/logout`,
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      responseType: 'token',
      scopes: ['openid', 'profile', 'email'],
      connection: undefined,
    },
    discovery
  );

  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === 'success') {
        const accessToken = response.params.access_token;

        if (!accessToken) {
          Alert.alert('Login failed', 'No access token returned');
          return;
        }

        const userInfoRes = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userInfo = await userInfoRes.json();

        setUser({ ...userInfo, accessToken });
      }
    };

    handleAuth();
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => promptAsync({ useProxy: true })}
      disabled={!request}
    >
      <Text style={styles.text}>Continue with Google / Apple</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
