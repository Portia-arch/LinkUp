import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firebaseDb } from '../../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

const SERPAPI_KEY = 'ff44039cc4dd30d4326b9274714eed7d9f9f18f689f9e8f4eda6770003752e0b';

// High-quality fallback image (Unsplash)
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1528716321680-815a8d51f3c6?q=80&w=1200&auto=format&fit=crop';

export default function EventListScreen() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState([]);

  const [selectedCity, setSelectedCity] = useState('Johannesburg');
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([
    { label: 'Johannesburg', value: 'Johannesburg' },
    { label: 'Cape Town', value: 'Cape Town' },
    { label: 'Durban', value: 'Durban' },
    { label: 'Pretoria', value: 'Pretoria' },
    { label: 'Gqeberha', value: 'Gqeberha' },
  ]);

  const getEventId = (event) => {
    if (event.id) return event.id;
    return `${event.title}_${event.date}_${event.city || event.location || ''}`
      .replace(/\s+/g, '_');
  };


  const fetchGoogleEventImage = async (eventTitle) => {
    try {
      const query = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(
        eventTitle + ' poster event'
      )}&api_key=${SERPAPI_KEY}`;

      const response = await fetch(query);
      if (!response.ok) return null;

      const data = await response.json();
      const image = data.images_results?.[0]?.original || null;

      return image;
    } catch (e) {
      console.warn('Image fetch failed', e);
      return null;
    }
  };

  const fetchSERPEvents = async (city) => {
    try {
      const query = `https://serpapi.com/search.json?engine=google_events&q=events+in+${encodeURIComponent(
        city + ', South Africa'
      )}&api_key=${SERPAPI_KEY}`;

      const response = await fetch(query);
      const data = await response.json();

      const serpEvents = (data.events_results || []).map((event) => ({
        id: getEventId(event),
        title: event.title,
        date: event.date?.start_date || event.date?.when || '',
        location: event.address || event.location || city,
        description: event.description || '',
        image: null,
        source: 'SERP',
      }));

      const serpEventsWithImages = await Promise.all(
        serpEvents.map(async (event) => {
          const googleImage = await fetchGoogleEventImage(event.title);
          return {
            ...event,
            image: googleImage || FALLBACK_IMAGE,
          };
        })
      );

      return serpEventsWithImages;
    } catch (error) {
      console.error('Error fetching SERP events:', error);
      return [];
    }
  };

  const fetchFirestoreEvents = async () => {
    try {
      const snapshot = await getDocs(collection(firebaseDb, 'events'));
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          image: data.image || FALLBACK_IMAGE,
        };
      });
    } catch (error) {
      console.error('Error fetching Firestore events:', error);
      return [];
    }
  };

  const fetchUserRSVPs = useCallback(async () => {
    if (!user) return;

    try {
      const snapshot = await getDocs(collection(firebaseDb, `users/${user.uid}/rsvps`));
      setJoinedEvents(snapshot.docs.map((doc) => doc.data().id));
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    }
  }, [user]);


  const fetchEvents = useCallback(async () => {
    setLoading(true);

    try {
      const [firestoreEvents, serpEvents] = await Promise.all([
        fetchFirestoreEvents(),
        fetchSERPEvents(selectedCity),
      ]);

      setEvents([...firestoreEvents, ...serpEvents]);
      await fetchUserRSVPs();
    } catch (error) {
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCity, fetchUserRSVPs]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);


  const handleRSVP = async (event) => {
    if (!user) {
      Alert.alert('Login required', 'You need to login to RSVP.');
      return;
    }

    const eventId = getEventId(event);
    const rsvpRef = doc(firebaseDb, `users/${user.uid}/rsvps`, eventId);

    try {
      if (joinedEvents.includes(eventId)) {
        await deleteDoc(rsvpRef);
        setJoinedEvents((prev) => prev.filter((id) => id !== eventId));
        Alert.alert('RSVP Cancelled', `You unjoined "${event.title}"`);
      } else {
        await setDoc(rsvpRef, {
          id: eventId,
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description,
          image: event.image,
          createdAt: new Date(),
        });
        setJoinedEvents((prev) => [...prev, eventId]);
        Alert.alert('RSVP Confirmed', `You joined "${event.title}"`);
      }
    } catch (error) {
      console.error('RSVP Error:', error);
      Alert.alert('Error', 'Could not update RSVP.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading events...</Text>
      </View>
    );
  }

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

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const isJoined = joinedEvents.includes(getEventId(item));

          return (
            <View style={styles.eventCard}>
              <Image
                source={{ uri: item.image || FALLBACK_IMAGE }}
                style={styles.image}
              />

              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.date}>
                {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
              </Text>
              <Text style={styles.location}>{item.location || 'No location'}</Text>

              <Text style={styles.description} numberOfLines={3}>
                {item.description}
              </Text>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isJoined ? '#FFA500' : '#28a745' },
                ]}
                onPress={() => handleRSVP(item)}
              >
                <Text style={styles.buttonText}>{isJoined ? 'Joined' : 'RSVP / Join'}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
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
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  date: { fontSize: 14, color: '#777', marginVertical: 5 },
  location: { fontSize: 14, color: '#555', fontStyle: 'italic' },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: { paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
