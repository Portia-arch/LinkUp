import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Share } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { firebaseDb } from '../../../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function EventDetailScreen({ route }) {
  const { event } = route.params;
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleRSVP = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to RSVP.');
      return;
    }

    try {
      await setDoc(
        doc(collection(firebaseDb, `users/${user.uid}/rsvps`), event.id?.toString() || event.title),
        {
          id: event.id?.toString() || event.title,
          name: event.title || event.name,
          date: event.date_start || event.date,
          description: event.description || '',
          joinedAt: new Date(),
        }
      );
      Alert.alert('Success', `You have registered for ${event.title || event.name}`);
    } catch (err) {
      console.error('RSVP error:', err);
      Alert.alert('Error', 'Failed to register for event.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n${event.description}\nDate: ${event.date_start || event.date}`,
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to share the event.');
    }
  };

  const coords = event.locationCoords || { latitude: -26.2041, longitude: 28.0473 }; 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.name}>{event.title || event.name}</Text>
        <Text style={styles.date}>{event.date}</Text>
        <Text style={styles.description}>
          {event.description || 'No description available.'}
        </Text>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={coords} title={event.title} description={event.description} />
        </MapView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1F4F8',
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
