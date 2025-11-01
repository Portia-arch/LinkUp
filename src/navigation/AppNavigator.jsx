import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import EventListScreen from '../screens/Events/EventListScreen';
import CreateEventScreen from '../screens/Events/CreateEventScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ProfileScreen from '../screens/Auth/ProfileScreen';
import EventDetailScreen from '../screens/Events/EventDetailScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 4, height: 60 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Events':
              iconName = 'calendar-outline';
              break;
            case 'CreateEvent':
              iconName = 'add-circle-outline';
              break;
            case 'Dashboard':
              iconName = 'list-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Events" component={EventListScreen} />
      <Tab.Screen name="CreateEvent" component={CreateEventScreen} />
            <Tab.Screen name="EventDetail" component={EventDetailScreen} />

      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName={user ? 'MainTabs' : 'Login'}
      screenOptions={{
        header: () => <Header />,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      {user == null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
