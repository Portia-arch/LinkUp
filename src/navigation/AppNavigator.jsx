import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen.jsx';
import RegisterScreen from '../screens/Auth/RegisterScreen.jsx';
import ProfileScreen from '../screens/Auth/ProfileScreen.jsx';
import EventListScreen from '../screens/Events/EventListScreen.jsx';
import EventCreateScreen from '../screens/Events/EventCreateScreen.jsx';
import DashboardScreen from '../screens/Dashboard/DashboardScreen.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Events" component={EventListScreen} />
          <Stack.Screen name="CreateEvent" component={EventCreateScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
