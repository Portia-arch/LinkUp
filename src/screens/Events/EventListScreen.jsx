import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

const EVENTBRITE_TOKEN = 'QC5LULX7LCFS7UNGGACU';


export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const url = 'https://www.eventbriteapi.com/v3/events/search/?q=music&location.address=Cape%20Town'
        // 'https://www.eventbriteapi.com/v3/events/search/?q=community&sort_by=date&location.address=South%20Africa';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events from Eventbrite.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events Near You</Text>

      {events.length === 0 ? (
        <Text style={styles.noEventsText}>No events found.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              {item.logo ? (
                <Image source={{ uri: item.logo.url }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.noImage]}>
                  <Text style={{ color: '#888' }}>No image</Text>
                </View>
              )}
              <Text style={styles.name}>{item.name.text}</Text>
              <Text style={styles.date}>
                {new Date(item.start.local).toLocaleString()}
              </Text>
              <Text style={styles.description} numberOfLines={3}>
                {item.description?.text || 'No description available.'}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  Alert.alert('RSVP', `Redirecting to: ${item.url}`)
                }
              >
                <Text style={styles.buttonText}>View / RSVP</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#222',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: '#555' },
  noEventsText: { textAlign: 'center', color: '#888', fontSize: 16 },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  date: { fontSize: 14, color: '#777', marginVertical: 5 },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
