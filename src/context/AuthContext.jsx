import React, { createContext, useState } from "react";
import { firebaseAuth } from "../../config/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import * as AuthSession from "expo-auth-session";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  const logoutFirebase = async () => {
    try {
      await firebaseAuth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Firebase logout error:", err);
    }
  };

  const logoutAuth0 = (domain) => {
    setUser(null);
    const logoutUrl = `https://${domain}/v2/logout`;
    fetch(logoutUrl).catch(console.error);
  };

  const logout = () => {
    if (user?.sub) {
      logoutAuth0("dev-v3e75p3t5h0rdrr0.us.auth0.com");
    } else {
      logoutFirebase();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser, 
        logout,
        logoutFirebase,
        logoutAuth0,
        updateUser, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};