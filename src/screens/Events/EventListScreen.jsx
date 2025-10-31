import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';

const EVENTBRITE_TOKEN = 'SMWYLD3CRESATVY55WOV'; // Replace with your own

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  
      const fetchEvents = async () => {
  try {
    const response = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?location.address=south%20africa&token=${EVENTBRITE_TOKEN}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    setEvents(data.events || []);
  } catch (error) {
    Alert.alert('Error', error.message);
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.name}>{item.name.text}</Text>
              <Text style={styles.date}>
                {item.start?.local ? new Date(item.start.local).toLocaleString() : 'No date available'}
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
});
