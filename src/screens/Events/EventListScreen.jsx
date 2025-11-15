// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   StyleSheet,
// } from 'react-native';

// import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
// import { firebaseDb } from '../../../config/firebase';
// import { AuthContext } from '../../context/AuthContext';

// const SERPAPI_KEY = 'ff44039cc4dd30d4326b9274714eed7d9f9f18f689f9e8f4eda6770003752e0b';

// const FALLBACK_IMAGE =
//   'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format';

// export default function EventListScreen() {
//   const { user } = useContext(AuthContext);

//   const [events, setEvents] = useState([]);
//   const [joinedEvents, setJoinedEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const [selectedCity, setSelectedCity] = useState('Johannesburg');
//   const cities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Gqeberha'];

//   /** -----------------------------------------
//    * Generate consistent event ID
//    ------------------------------------------- */
//   const getEventId = (event) => {
//     if (event.id) return event.id;
//     return `${event.title}_${event.date}_${event.city || event.location}`
//       .replace(/\s+/g, '_')
//       .toLowerCase();
//   };

//   /** -----------------------------------------
//    * Fetch RSVP IDs
//    ------------------------------------------- */
//   const fetchUserRSVPs = useCallback(async () => {
//     if (!user) return;

//     const snapshot = await getDocs(collection(firebaseDb, `users/${user.uid}/rsvps`));
//     const ids = snapshot.docs.map((d) => d.id);

//     setJoinedEvents(ids);
//   }, [user]);

//   /** -----------------------------------------
//    * Load INTERNAL Firestore events
//    ------------------------------------------- */
//   const fetchInternalEvents = async () => {
//     try {
//       const snapshot = await getDocs(collection(firebaseDb, 'events'));
//       return snapshot.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//         source: 'INTERNAL',
//         image: FALLBACK_IMAGE,
//       }));
//     } catch (e) {
//       console.error('Error fetching internal events:', e);
//       return [];
//     }
//   };

//   /** -----------------------------------------
//    * Fetch an image from Google Images via SerpAPI
//    ------------------------------------------- */
//   const fetchGoogleImage = async (query) => {
//     try {
//       const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(
//         query
//       )}&api_key=${SERPAPI_KEY}`;

//       const res = await fetch(url);
//       const json = await res.json();

//       return json.images_results?.[0]?.original || FALLBACK_IMAGE;
//     } catch {
//       return FALLBACK_IMAGE;
//     }
//   };

//   /** -----------------------------------------
//    * Load external Google Events
//    ------------------------------------------- */
//   const fetchExternalEvents = async (city) => {
//     try {
//       const url = `https://serpapi.com/search.json?engine=google_events&q=events+in+${encodeURIComponent(
//         city
//       )}&api_key=${SERPAPI_KEY}`;

//       const res = await fetch(url);
//       const json = await res.json();

//       const events = json.events_results || [];

//       const withImages = await Promise.all(
//         events.map(async (ev) => {

//           const img = await fetchGoogleImage(ev.title + ' event');

//           return {
//             id: getEventId(ev),
//             title: ev.title,
//             date: ev.date?.start_date || ev.date?.when || '',
//             location: ev.address || ev.location || city,
//             description: ev.description || '',
//             source: 'EXTERNAL',
//             image: img,
//           };
//         })
//       );

//       return withImages;
//     } catch (e) {
//       console.error('External fetch error:', e);
//       return [];
//     }
//   };

//   /** -----------------------------------------
//    * Main fetch function
//    ------------------------------------------- */
//   const fetchEvents = useCallback(async () => {
//     setLoading(true);

//     try {
//       const [internal, external] = await Promise.all([
//         fetchInternalEvents(),
//         fetchExternalEvents(selectedCity),
//       ]);

//       setEvents([...internal, ...external]);
//       await fetchUserRSVPs();
//     } catch (e) {
//       Alert.alert('Error', 'Failed to load events');
//     }

//     setLoading(false);
//     setRefreshing(false);
//   }, [selectedCity, fetchUserRSVPs]);

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   /** -----------------------------------------
//    * Refresh
//    ------------------------------------------- */
//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchEvents();
//   };

//   /** -----------------------------------------
//    * RSVP Logic
//    ------------------------------------------- */
//   const handleRSVP = async (event) => {
//     if (!user) {
//       Alert.alert('Login required', 'You need to login to RSVP.');
//       return;
//     }

//     const eventId = getEventId(event);
//     const ref = doc(firebaseDb, `users/${user.uid}/rsvps`, eventId);

//     try {
//       if (joinedEvents.includes(eventId)) {
//         await deleteDoc(ref);
//         setJoinedEvents((prev) => prev.filter((id) => id !== eventId));
//         Alert.alert('RSVP Cancelled', `You have unjoined "${event.title}"`);
//       } else {
//         await setDoc(ref, {
//           id: eventId,
//           ...event,
//           createdAt: new Date(),
//         });
//         setJoinedEvents((prev) => [...prev, eventId]);
//         Alert.alert('RSVP Confirmed', `You have joined "${event.title}"`);
//       }
//     } catch (e) {
//       console.error('RSVP error:', e);
//       Alert.alert('Error', 'RSVP failed');
//     }
//   };

//   /** -----------------------------------------
//    * UI
//    ------------------------------------------- */
//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" />
//         <Text>Loading events...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Events in {selectedCity}</Text>

//       <FlatList
//         data={events}
//         // keyExtractor={(item) => item.id}
//         keyExtractor={(item) => getEventId(item)} 
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         renderItem={({ item }) => {
//           const isJoined = joinedEvents.includes(getEventId(item));

//           return (
//             <View style={styles.card}>
//               <Image source={{ uri: item.image }} style={styles.image} />

//               <Text style={styles.title}>{item.title}</Text>
//               <Text style={styles.tag}>{item.source === 'INTERNAL' ? 'INTERNAL EVENT' : 'EXTERNAL EVENT'}</Text>

//               <Text style={styles.date}>{item.date}</Text>
//               <Text style={styles.location}>{item.location}</Text>
//               <Text style={styles.desc} numberOfLines={3}>
//                 {item.description}
//               </Text>

//               <TouchableOpacity
//                 style={[
//                   styles.btn,
//                   { backgroundColor: isJoined ? '#d97706' : '#28a745' },
//                 ]}
//                 onPress={() => handleRSVP(item)}
//               >
//                 <Text style={styles.btnText}>{isJoined ? 'Joined' : 'Join / RSVP'}</Text>
//               </TouchableOpacity>
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// }

// /** -----------------------------------------
//  * Styles
//  ------------------------------------------- */
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 14, backgroundColor: '#f5f5f5' },
//   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//   header: { fontSize: 22, fontWeight: '700', marginBottom: 10, textAlign: 'center' },

//   card: {
//     backgroundColor: '#fff',
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 14,
//     elevation: 3,
//   },

//   image: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },

//   title: { fontSize: 18, fontWeight: '700' },
//   tag: {
//     backgroundColor: '#007AFF',
//     color: 'white',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//     marginVertical: 4,
//     fontSize: 12,
//   },

//   date: { color: '#555', marginTop: 4 },
//   location: { color: '#777', marginBottom: 6 },
//   desc: { color: '#444' },

//   btn: { padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
//   btnText: { color: 'white', fontWeight: '700' },
// });

import React, { useEffect, useState, useContext, useCallback, memo } from 'react';
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

import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firebaseDb } from '../../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

const SERPAPI_KEY = 'ff44039cc4dd30d4326b9274714eed7d9f9f18f689f9e8f4eda6770003752e0b';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format';

/** -----------------------------------------
 * Memoized Event Card
 ------------------------------------------- */
const EventCard = memo(({ event, isJoined, onRSVP }) => (
  <View style={styles.card}>
    <Image source={{ uri: event.image }} style={styles.image} />

    <Text style={styles.title}>{event.title}</Text>
    <Text style={styles.tag}>{event.source === 'INTERNAL' ? 'INTERNAL EVENT' : 'EXTERNAL EVENT'}</Text>

    <Text style={styles.date}>{event.date}</Text>
    <Text style={styles.location}>{event.location}</Text>
    <Text style={styles.desc} numberOfLines={3}>{event.description}</Text>

    <TouchableOpacity
      style={[styles.btn, { backgroundColor: isJoined ? '#d97706' : '#28a745' }]}
      onPress={() => onRSVP(event)}
    >
      <Text style={styles.btnText}>{isJoined ? 'Joined' : 'Join / RSVP'}</Text>
    </TouchableOpacity>
  </View>
));

export default function EventListScreen() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCity, setSelectedCity] = useState('Johannesburg');
  const cities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Gqeberha'];

  /** -----------------------------------------
   * Generate consistent event ID
   ------------------------------------------- */
  const getEventId = (event) => {
    if (event.id) return event.id;
    return `${event.title}_${event.date}_${event.city || event.location}`
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  /** -----------------------------------------
   * Fetch RSVP IDs
   ------------------------------------------- */
  const fetchUserRSVPs = useCallback(async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(collection(firebaseDb, `users/${user.uid}/rsvps`));
      const ids = snapshot.docs.map((d) => d.id);
      setJoinedEvents(ids);
    } catch (e) {
      console.error('Failed to fetch RSVPs', e);
    }
  }, [user]);

  /** -----------------------------------------
   * Load INTERNAL Firestore events
   ------------------------------------------- */
  const fetchInternalEvents = async () => {
    try {
      const snapshot = await getDocs(collection(firebaseDb, 'events'));
      return snapshot.docs.map((d) => ({
        ...d.data(),
        computedId: d.id,
        source: 'INTERNAL',
        image: FALLBACK_IMAGE,
      }));
    } catch (e) {
      console.error('Error fetching internal events:', e);
      return [];
    }
  };

  /** -----------------------------------------
   * Fetch Google Images
   ------------------------------------------- */
  const fetchGoogleImage = async (query) => {
    try {
      const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      return json.images_results?.[0]?.original || FALLBACK_IMAGE;
    } catch {
      return FALLBACK_IMAGE;
    }
  };

  /** -----------------------------------------
   * Load EXTERNAL Google Events
   ------------------------------------------- */
  const fetchExternalEvents = async (city) => {
    try {
      const url = `https://serpapi.com/search.json?engine=google_events&q=events+in+${encodeURIComponent(city)}&api_key=${SERPAPI_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      const results = json.events_results || [];

      const eventsWithIds = await Promise.all(
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

      return eventsWithIds;
    } catch (e) {
      console.error('External fetch error:', e);
      return [];
    }
  };

  /** -----------------------------------------
   * Main fetch function
   ------------------------------------------- */
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [internal, external] = await Promise.all([
        fetchInternalEvents(),
        fetchExternalEvents(selectedCity),
      ]);
      const combined = [...internal, ...external];
      setEvents(combined);
      await fetchUserRSVPs();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCity, fetchUserRSVPs]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /** -----------------------------------------
   * Pull-to-refresh
   ------------------------------------------- */
  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  /** -----------------------------------------
   * RSVP Logic
   ------------------------------------------- */
  const handleRSVP = useCallback(async (event) => {
    if (!user) {
      Alert.alert('Login required', 'You need to login to RSVP.');
      return;
    }

    const eventId = event.computedId;
    const ref = doc(firebaseDb, `users/${user.uid}/rsvps`, eventId);

    try {
      if (joinedEvents.includes(eventId)) {
        await deleteDoc(ref);
        setJoinedEvents((prev) => prev.filter((id) => id !== eventId));
        Alert.alert('RSVP Cancelled', `You have unjoined "${event.title}"`);
      } else {
        await setDoc(ref, { ...event, createdAt: new Date() });
        setJoinedEvents((prev) => [...prev, eventId]);
        Alert.alert('RSVP Confirmed', `You have joined "${event.title}"`);
      }
    } catch (e) {
      console.error('RSVP error:', e);
      Alert.alert('Error', 'RSVP failed');
    }
  }, [joinedEvents, user]);

  /** -----------------------------------------
   * UI
   ------------------------------------------- */
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

      <FlatList
        data={events}
        keyExtractor={(item) => item.computedId}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isJoined={joinedEvents.includes(item.computedId)}
            onRSVP={handleRSVP}
          />
        )}
      />
    </View>
  );
}

/** -----------------------------------------
 * Styles
 ------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: '#f5f5f5' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 10, textAlign: 'center' },

  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 14, elevation: 3 },
  image: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '700' },
  tag: { backgroundColor: '#007AFF', color: 'white', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginVertical: 4, fontSize: 12 },
  date: { color: '#555', marginTop: 4 },
  location: { color: '#777', marginBottom: 6 },
  desc: { color: '#444' },
  btn: { padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700' },
});
