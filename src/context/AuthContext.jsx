import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      setJoinedEvents([]); 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,         
        logout,
        joinedEvents,
        setJoinedEvents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
