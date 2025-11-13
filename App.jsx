import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator.jsx';
import { AuthProvider } from './src/context/AuthContext.jsx';
import { RSVPProvider } from './src/context/RSVPContext.jsx';

export default function App() {
  return (
    <AuthProvider>
      <RSVPProvider />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
