import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firebaseDb } from '../../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import CityDropdown from '../../components/CityDropdown';
import EventCard from '../../components/EventCard';

const SERPAPI_KEY = 'ff44039cc4dd30d4326b9274714eed7d9f9f18f689f9e8f4eda6770003752e0b';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format';

export default function EventListScreen() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCity, setSelectedCity] = useState('Johannesburg');
  const cities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Gqeberha'];

  /** Generate consistent event ID */
  const getEventId = (event) =>
    `${event.title || ''}_${event.date || ''}_${event.location || ''}`
      .replace(/\s+/g, '_')
      .toLowerCase();

  const fetchUserRSVPs = useCallback(async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(collection(firebaseDb, `users/${user.uid}/rsvps`));
      setJoinedEvents(snapshot.docs.map((d) => d.id));
    } catch (e) {
      console.error('Failed to fetch RSVPs', e);
      Alert.alert('Error', 'Failed to fetch your RSVPs.');
    }
  }, [user]);

  const fetchInternalEvents = async () => {
    try {
      const snapshot = await getDocs(collection(firebaseDb, 'events'));
      return snapshot.docs.map((d) => ({
        ...d.data(),
        computedId: d.id,
        source: 'INTERNAL',
        image: d.data().image || FALLBACK_IMAGE,
      }));
    } catch (e) {
      console.error('Error fetching internal events:', e);
      return [];
    }
  };

  const fetchGoogleImage = async (query) => {
    try {
      const res = await fetch(`https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`);
      const json = await res.json();
      return json.images_results?.[0]?.original || FALLBACK_IMAGE;
    } catch {
      return FALLBACK_IMAGE;
    }
  };

  const fetchExternalEvents = async (city) => {
    try {
      const res = await fetch(`https://serpapi.com/search.json?engine=google_events&q=events+in+${encodeURIComponent(city)}&api_key=${SERPAPI_KEY}`);
      const json = await res.json();
      const results = json.events_results || [];

      return await Promise.all(
        results.map(async (ev) => ({
          computedId: getEventId(ev),
          title: ev.title,
          date: ev.date?.start_date || ev.date?.when || '',
          location: ev.address || ev.location || city,
          description: ev.description || '',
          source: 'EXTERNAL',
          image: await fetchGoogleImage(ev.title + ' event'),
        }))
      );
    } catch (e) {
      console.error('External fetch error:', e);
      return [];
    }
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [internal, external] = await Promise.all([
        fetchInternalEvents(),
        fetchExternalEvents(selectedCity),
      ]);

      const map = new Map();
      [...internal, ...external].forEach((ev) => map.set(ev.computedId, ev));
      setEvents(Array.from(map.values()));

      await fetchUserRSVPs();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load events.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCity, fetchUserRSVPs]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const handleRSVPUpdate = (eventId, joined) => {
    setJoinedEvents((prev) =>
      joined ? [...prev, eventId] : prev.filter((id) => id !== eventId)
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events in {selectedCity}</Text>

      <CityDropdown
        cities={cities}
        selectedCity={selectedCity}
        onSelect={(city) => setSelectedCity(city)}
      />

      <FlatList
        data={events}
        keyExtractor={(item) => item.computedId}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            initialJoined={joinedEvents.includes(item.computedId)}
            onRSVP={handleRSVPUpdate}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: '#f5f5f5' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
});
