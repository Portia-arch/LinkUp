import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import EventCard from '../../components/EventCard';

// Mock registered events
const registeredEvents = [
  { id: 1, name: 'Community Meetup', date: '2025-11-05' },
  { id: 2, name: 'Charity Run', date: '2025-11-10' },
];

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Registered Events</Text>
      <FlatList
        data={registeredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
});
