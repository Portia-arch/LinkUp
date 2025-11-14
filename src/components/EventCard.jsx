// import React, { useContext } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../context/AuthContext';

// export default function EventCard({ event }) {
//   const navigation = useNavigation();
//   const { user } = useContext(AuthContext);

//   return (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate('EventDetail', { event })}
//     >
//       <Text style={styles.name}>{event.name}</Text>
//       <Text style={styles.date}>
//         {event.date ? new Date(event.date).toLocaleString() : 'No date'}
//       </Text>
//       <Text style={styles.description} numberOfLines={2}>
//         {event.description || 'No description available.'}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   name: { fontSize: 18, fontWeight: '600', color: '#333' },
//   date: { fontSize: 14, color: '#777', marginVertical: 5 },
//   description: { fontSize: 14, color: '#555' },
// });

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function EventCard({ event, onRSVP, isJoined }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const eventDate = event.date ? new Date(event.date).toLocaleString() : 'No date';
  const location = event.location || event.city || 'Location not specified';
  const description = event.description || 'No description available';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { event })}
    >
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} />
      )}

      <Text style={styles.name}>{event.title || event.name}</Text>
      <Text style={styles.date}>📅 {eventDate}</Text>
      <Text style={styles.venue}>📍 {location}</Text>
      <Text style={styles.description} numberOfLines={3}>{description}</Text>

      {onRSVP && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isJoined ? '#FFA500' : '#28a745' }]}
          onPress={() => onRSVP(event)}
        >
          <Text style={styles.buttonText}>{isJoined ? 'Joined' : 'RSVP / Join'}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  date: { fontSize: 14, color: '#777', marginVertical: 5 },
  venue: { fontSize: 14, color: '#555', fontStyle: 'italic' },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
