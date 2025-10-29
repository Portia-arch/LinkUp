import React, { useEffect, useState, createContext, useContext } from 'react';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens as default exports
import AuthScreen from './screens/AuthScreen';
import EventListScreen from './screens/EventListScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';

// Mock events are used by default; created events are stored in state+AsyncStorage
const eventsMock = require('./mock/events.json');

LogBox.ignoreAllLogs(true); // optional: hide yellow-box logs during development

const Stack = createNativeStackNavigator();
const AuthContext = createContext();

// Move this AFTER creating AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function App() {
  const [user, setUser] = useState(null); // { uid, email, displayName, photoURL } or simple { email }
  const [rsvps, setRsvps] = useState([]); // array of event ids
  const [eventsCreated, setEventsCreated] = useState([]); // events user created

  // load persisted state
  useEffect(() => {
    (async () => {
      try {
        const rawUser = await AsyncStorage.getItem('linkup_user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          // Convert string booleans to actual booleans
          if (typeof parsed.isVerified === 'string') {
            parsed.isVerified = parsed.isVerified === 'true';
          }
          setUser(parsed);
        }
        
        const rawRsvps = await AsyncStorage.getItem('linkup_rsvps');
        if (rawRsvps) setRsvps(JSON.parse(rawRsvps));

        const rawCreated = await AsyncStorage.getItem('linkup_created');
        if (rawCreated) setEventsCreated(JSON.parse(rawCreated));
      } catch (err) {
        console.warn('Error loading persisted state', err);
      }
    })();
  }, []);

  // Persist helpers
  const persistUser = async (u) => {
    try {
      if (u) await AsyncStorage.setItem('linkup_user', JSON.stringify(u));
      else await AsyncStorage.removeItem('linkup_user');
    } catch (e) {
      console.warn('persistUser error', e);
    }
  };

  const persistRsvps = async (list) => {
    try {
      await AsyncStorage.setItem('linkup_rsvps', JSON.stringify(list));
    } catch (e) {
      console.warn('persistRsvps error', e);
    }
  };

  const persistCreated = async (list) => {
    try {
      await AsyncStorage.setItem('linkup_created', JSON.stringify(list));
    } catch (e) {
      console.warn('persistCreated error', e);
    }
  };

  // Auth functions (email/password are stubs you can replace with Firebase calls)
  const signIn = async (email, password) => {
    // TODO: replace stub with Firebase signInWithEmailAndPassword when configured:
    // await signInWithEmailAndPassword(auth, email, password);
    // const current = auth.currentUser; setUser({ uid: current.uid, email: current.email, displayName: current.displayName, photoURL: current.photoURL });
    const u = { email };
    setUser(u);
    await persistUser(u);
    return u;
  };

  const register = async (email, password) => {
    // TODO: replace stub with Firebase createUserWithEmailAndPassword when configured.
    const u = { email };
    setUser(u);
    await persistUser(u);
    return u;
  };

  const signOut = async () => {
    // If using Firebase: await firebaseSignOut(auth);
    setUser(null);
    await persistUser(null);
  };

  // Google sign-in example note:
  // To implement Google sign-in with Expo:
  // 1) use expo-auth-session to get id_token/access_token
  // 2) create firebase credential with GoogleAuthProvider.credential(idToken, accessToken)
  // 3) signInWithCredential(auth, credential)
  //
  // Because client IDs differ per project you must add your WEB_CLIENT_ID in app.json (extra.googleClientId)
  const signInWithGoogle = async () => {
    // Placeholder. Replace with Expo AuthSession + Firebase credential flow.
    console.log('signInWithGoogle placeholder - wire AuthSession + Firebase here');
    // Example after successful sign-in:
    // const firebaseUser = { uid: 'google-123', email: 'jane@example.com', displayName: 'Jane' };
    // setUser(firebaseUser); await persistUser(firebaseUser);
  };

  // Event and RSVP functions
  const toggleRSVP = async (event) => {
    setRsvps((prev) => {
      const exists = prev.includes(event.id);
      const next = exists ? prev.filter((id) => id !== event.id) : [...prev, event.id];
      persistRsvps(next).catch((e) => console.warn(e));
      return next;
    });
  };

  const addEvent = async (payload) => {
    // payload: { name, description, date }
    const newEvent = { ...payload, id: Date.now() }; // simple unique id
    setEventsCreated((prev) => {
      const next = [newEvent, ...prev];
      persistCreated(next).catch((e) => console.warn(e));
      return next;
    });
    return newEvent;
  };

  // Derived getters for dashboard
  const rsvpEvents = (() => {
    const all = [...eventsMock, ...eventsCreated];
    return all.filter((e) => rsvps.includes(e.id));
  })();

  const events = (() => {
    return [...eventsMock, ...eventsCreated];
  })();

  // Exposed context
  const authContext = {
    user,
    signIn,
    register,
    signOut,
    signInWithGoogle,
    rsvps,
    toggleRSVP,
    addEvent,
    eventsCreated,
    events,
    rsvpEvents,
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen name="Events" component={EventListScreen} />
              <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          ) : (
            <Stack.Screen name="SignIn" component={AuthScreen} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
