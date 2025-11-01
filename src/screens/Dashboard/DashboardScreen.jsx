import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import EventCard from '../../components/EventCard';

const registeredEvents = [
  { id: 1, name: 'Community Meetup', date: '2025-11-05', description: 'Join us for a community gathering!' },
  { id: 2, name: 'Charity Run', date: '2025-11-10', description: 'A 5km run for charity.' },
];

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Registered Events</Text>
      <FlatList
        data={registeredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}

      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#222' },
});
