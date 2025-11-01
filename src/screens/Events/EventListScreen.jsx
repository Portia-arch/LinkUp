import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';

export default function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      // FOSSASIA Open Event API (public events)
      const response = await fetch('https://eventyay.com/api/v1/events');

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data.data || []); // `data.data` contains the list of events
    } catch (error) {
      Alert.alert('Error fetching events', error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>
                {item.starts_at ? new Date(item.starts_at).toLocaleString() : 'No date available'}
              </Text>
              <Text style={styles.venue}>
                {item.venue_name || 'Venue not specified'}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>No events found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  eventCard: { padding: 15, backgroundColor: '#f4f4f4', borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '500' },
  date: { color: '#555', marginTop: 5 },
  venue: { color: '#777', marginTop: 3, fontStyle: 'italic' },
});
