import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const SERPAPI_KEY = 'ff44039cc4dd30d4326b9274714eed7d9f9f18f689f9e8f4eda6770003752e0b';

export default function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState('Johannesburg');
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([
    { label: 'Johannesburg', value: 'Johannesburg' },
    { label: 'Cape Town', value: 'Cape Town' },
    { label: 'Durban', value: 'Durban' },
    { label: 'Pretoria', value: 'Pretoria' },
    { label: 'Gqeberha', value: 'Gqeberha' },
  ]);

  const fetchEvents = async (city) => {
    setLoading(true);
    try {
      const query = `https://serpapi.com/search.json?engine=google_events&q=events+in+${encodeURIComponent(
        city + ', South Africa'
      )}&api_key=${SERPAPI_KEY}`;

      const response = await fetch(query);

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data.events_results || []);
    } catch (error) {
      Alert.alert('Error fetching events', error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedCity);
  }, [selectedCity]);

  const handleRSVP = (url) => {
    if (url) Linking.openURL(url);
    else Alert.alert('No RSVP URL available');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events in {selectedCity}</Text>

      <DropDownPicker
        open={open}
        value={selectedCity}
        items={cities}
        setOpen={setOpen}
        setValue={setSelectedCity}
        setItems={setCities}
        containerStyle={{ marginBottom: 15, zIndex: 1000 }}
        zIndex={1000} 
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10 }}>Loading events...</Text>
        </View>
      ) : events.length === 0 ? (
        <Text style={styles.noEventsText}>No events found.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const eventDate =
              item.date?.start_date
                ? new Date(item.date.start_date).toLocaleDateString()
                : item.date?.when || 'Date not available';

            const imageUri = item.thumbnail || item.image?.url || null;

            return (
              <View style={styles.eventCard}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.noImage]}>
                    <Text style={{ color: '#888' }}>No Image</Text>
                  </View>
                )}

                <Text style={styles.name}>{item.title}</Text>

                <Text style={styles.date}>{eventDate}</Text>

                <Text style={styles.venue}>
                  {item.address || item.location || 'Venue not specified'}
                </Text>

                <Text style={styles.description} numberOfLines={3}>
                  {item.description || 'No description available.'}
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleRSVP(item.link)}
                >
                  <Text style={styles.buttonText}>RSVP / View</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  noImage: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  date: { fontSize: 14, color: '#777', marginVertical: 5 },
  venue: { fontSize: 14, color: '#555', fontStyle: 'italic' },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
