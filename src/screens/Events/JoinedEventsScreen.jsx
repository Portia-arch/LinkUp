import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firebaseDb } from '../../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

export default function JoinedEventsScreen() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRSVPs = async () => {
    if (!user) {
      Alert.alert('Please login', 'You need to log in to see joined events.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setLoading(true);
      const rsvpsRef = collection(firebaseDb, `users/${user.uid}/rsvps`);
      const snapshot = await getDocs(rsvpsRef);

      const joinedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(joinedEvents);
    } catch (error) {
      console.error('Error loading RSVPs:', error);
      Alert.alert('Error', 'Could not load joined events.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, [user]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRSVPs();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading joined events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Joined Events</Text>

      {events.length === 0 ? (
        <Text style={styles.noEvents}>You haven’t joined any events yet.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.date}>
                {item.date ? new Date(item.date).toLocaleString() : 'No date available'}
              </Text>
              <Text style={styles.venue}>{item.location || 'No location specified'}</Text>
              <Text style={styles.desc}>{item.description || 'No description available'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  noEvents: { textAlign: 'center', color: '#666', marginTop: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: '600' },
  date: { fontSize: 14, color: '#555', marginVertical: 5 },
  venue: { fontSize: 14, color: '#555', fontStyle: 'italic' },
  desc: { fontSize: 14, color: '#444' },
});
