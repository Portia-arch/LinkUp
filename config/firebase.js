
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB6C-gCyiCDfz_NsbO_aGQ4DYIBJ5gVBNE",
  authDomain: "linkup-c1929.firebaseapp.com",
  projectId: "linkup-c1929",
  storageBucket: "linkup-c1929.firebasestorage.app",
  messagingSenderId: "605771402121",
  appId: "1:605771402121:web:5c73816cbb656d8134ef58"
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, firebaseAuth };