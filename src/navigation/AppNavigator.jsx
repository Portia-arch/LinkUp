import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import EventListScreen from '../screens/Events/EventListScreen';
import CreateEventScreen from '../screens/Events/CreateEventScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ProfileScreen from '../screens/Auth/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext); 

  return (
    <Stack.Navigator
      initialRouteName="LogIn"
      screenOptions={{
        header: () => <Header />,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      {user == null ? (
        
        <>
          <Stack.Screen name="LogIn" component={LoginScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Events" component={EventListScreen} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
