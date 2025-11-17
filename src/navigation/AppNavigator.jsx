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
import ProfileScreen from '../screens/Profile/ProfileScreen';
import JoinedEventsScreen from '../screens/Events/JoinedEventsScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';


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
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Events':
              iconName = 'calendar-outline';
              break;
            case 'CreateEvent':
              iconName = 'add-circle-outline';
              break;
            case 'JoinedEvents':
              iconName = 'information-circle-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Events" component={EventListScreen} />
      <Tab.Screen name="CreateEvent" component={CreateEventScreen} />
      <Tab.Screen name="JoinedEvents" component={JoinedEventsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName={user ? 'MainTabs' : 'LogIn'}
      screenOptions={{
        header: () => <Header />,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      {user == null ? (
        <>
          <Stack.Screen name="LogIn" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      )}

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />

    </Stack.Navigator>


  );
}
