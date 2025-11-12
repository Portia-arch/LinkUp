import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function EventCard({ event }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { event })}
    >
      <Text style={styles.name}>{event.name}</Text>
      <Text style={styles.date}>
        {event.date ? new Date(event.date).toLocaleString() : 'No date'}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {event.description || 'No description available.'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  date: { fontSize: 14, color: '#777', marginVertical: 5 },
  description: { fontSize: 14, color: '#555' },
});
