import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>My Profile</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              user?.photoURL ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.displayName || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email || 'No email available'}</Text>
      </View>

      {/* Actions */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Events')}
        >
          <Text style={styles.buttonText}>View Community Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={styles.buttonText}>Create New Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginVertical: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  buttonContainer: {
    width: '90%',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 16,
  },
});
