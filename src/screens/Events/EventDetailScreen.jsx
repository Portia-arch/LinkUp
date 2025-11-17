import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { firebaseDb } from '../../../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

export default function EventDetailScreen({ route }) {
  const { event } = route.params;
  const { user } = useContext(AuthContext);

  const handleRSVP = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to RSVP.');
      return;
    }

    try {
      await setDoc(
        doc(
          collection(firebaseDb, `users/${user.uid}/rsvps`),
          event.id?.toString() || event.title
        ),
        {
          id: event.id?.toString() || event.title,
          name: event.title || event.name,
          date: event.date_start || event.date,
          description: event.description || '',
          joinedAt: new Date(),
        }
      );
      Alert.alert('Success', `You have registered for ${event.title || event.name}`);
    } catch (err) {
      console.error('RSVP error:', err);
      Alert.alert('Error', 'Failed to register for event.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{event.title || event.name}</Text>
        <Text style={styles.date}>
          {event.date_start
            ? new Date(event.date_start).toLocaleString()
            : 'Date not available'}
        </Text>
        <Text style={styles.description}>
          {event.description || 'No description available.'}
        </Text>

        <TouchableOpacity style={styles.rsvpButton} onPress={handleRSVP}>
          <Text style={styles.rsvpText}>RSVP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1F4F8',
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 25,
  },
  rsvpButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rsvpText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
