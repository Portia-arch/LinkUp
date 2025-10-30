import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../../config/firebase';

export default function ProfileScreen() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut(firebaseAuth);
    setUser(null);
  };

  return (
    <View style={styles.container}>
      {user.photoURL ? <Image source={{ uri: user.photoURL }} style={styles.avatar} /> : null}
      <Text style={styles.name}>{user.displayName || 'No Name'}</Text>
      <Text>{user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 20, marginBottom: 8 },
});
