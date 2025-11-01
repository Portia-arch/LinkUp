import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { firebaseAuth, firebaseDb } from '../../../config/firebase';
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
      doc(collection(firebaseDb, `users/${user.uid}/rsvps`), event.id?.toString() || event.title),
      {
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
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 16, marginBottom: 10 },
  date: { fontSize: 14, color: '#555', marginBottom: 20 },
});
