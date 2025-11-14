import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, RefreshControl } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { firebaseDb } from '../../../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const SERPAPI_KEY = 'ff44039cc4dd30d4326b9274714eed7d9f9f18f689f9e8f4eda6770003752e0b';

export default function EventListScreen({ route }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCity, setSelectedCity] = useState('Johannesburg');
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([
    { label: 'Johannesburg', value: 'Johannesburg' },
    { label: 'Cape Town', value: 'Cape Town' },
    { label: 'Durban', value: 'Durban' },
    { label: 'Pretoria', value: 'Pretoria' },
    { label: 'Gqeberha', value: 'Gqeberha' },
  ]);

  const [joinedEvents, setJoinedEvents] = useState([]);

  // ------------------ Fetch Firestore Events ------------------
  const fetchFirestoreEvents = async () => {
    try {
      const eventsRef = collection(firebaseDb, 'events');
      const q = query(eventsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const firestoreEvents = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.city || data.city === selectedCity) {
          firestoreEvents.push({
            id: doc.id,
            title: data.title,
            date: data.date,
            description: data.description,
            city: data.city || 'Unknown',
            source: 'Created',
          });
        }
      });
      return firestoreEvents;
    } catch (error) {
      console.error('Error fetching Firestore events:', error);
      return [];
    }
  };

  // ------------------ Fetch SERP API Events ------------------
  const fetchSERPEvents = async () => {
    try {
      const queryUrl = `https://serpapi.com/search.json?engine=google_events&q=events+in+${encodeURIComponent(
        selectedCity + ', South Africa'
      )}&api_key=${SERPAPI_KEY}`;

      const response = await fetch(queryUrl);
      if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
      const data = await response.json();

      return (data.events_results || []).map((e, index) => ({
        id: `serp-${index}`,
        title: e.title,
        date: e.date?.start_date || e.date?.when,
        description: e.description,
        city: selectedCity,
        image: e.thumbnail || e.image?.url,
        source: 'External',
      }));
    } catch (error) {
      Alert.alert('Error fetching SERP API events', error.message);
      return [];
    }
  };

  // ------------------ Fetch All Events ------------------
  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const [firestoreEvents, serpEvents] = await Promise.all([fetchFirestoreEvents(), fetchSERPEvents()]);
      const merged = [...firestoreEvents, ...serpEvents].sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date();
        const dateB = b.date ? new Date(b.date) : new Date();
        return dateA - dateB;
      });
      setEvents(merged);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Pull-to-Refresh ------------------
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAllEvents();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchAllEvents();
  }, [selectedCity]);

  // Refresh if coming back from CreateEventScreen
  useEffect(() => {
    if (route.params?.refresh) fetchAllEvents();
  }, [route.params]);

  const handleRSVP = (event) => {
    if (joinedEvents.includes(event.id)) {
      setJoinedEvents((prev) => prev.filter((id) => id !== event.id));
      Alert.alert('RSVP Cancelled', `You have unjoined "${event.title}".`);
    } else {
      setJoinedEvents((prev) => [...prev, event.id]);
      Alert.alert('RSVP Confirmed', `You have joined "${event.title}".`);
    }
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

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10 }}>Loading events...</Text>
        </View>
      ) : events.length === 0 ? (
        <Text style={styles.noEventsText}>No events found.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const eventDate = item.date ? new Date(item.date).toLocaleDateString() : 'Date not available';
            const isJoined = joinedEvents.includes(item.id);

            return (
              <View style={styles.eventCard}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.noImage]}>
                    <Text style={{ color: '#888' }}>No Image</Text>
                  </View>
                )}

                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.date}>{eventDate}</Text>
                <Text style={styles.venue}>{item.city}</Text>
                <Text style={styles.description} numberOfLines={3}>{item.description || 'No description available.'}</Text>

                <Text style={styles.sourceBadge}>{item.source}</Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isJoined ? '#FFA500' : '#28a745' }]}
                  onPress={() => handleRSVP(item)}
                >
                  <Text style={styles.buttonText}>{isJoined ? 'Joined' : 'RSVP / Join'}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007bff" colors={['#007bff']} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noEventsText: { textAlign: 'center', color: '#888', fontSize: 16 },
  eventCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, padding: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3 },
  image: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },
  noImage: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  date: { fontSize: 14, color: '#777', marginVertical: 5 },
  venue: { fontSize: 14, color: '#555', fontStyle: 'italic' },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },
  sourceBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, backgroundColor: '#007bff', color: '#fff', fontWeight: '600', marginBottom: 10 },
  button: { paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
