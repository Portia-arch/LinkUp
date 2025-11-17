import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import RSVPButton from './RSVPButton';

export default function EventCard({ event, isJoined, onRSVPUpdate }) {
  return (
    <View style={styles.card}>
      {event.image && <Image source={{ uri: event.image }} style={styles.image} />}

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.tag}>
        {event.source === 'INTERNAL' ? 'INTERNAL EVENT' : 'EXTERNAL EVENT'}
      </Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.location}>{event.location}</Text>
      <Text style={styles.desc} numberOfLines={3}>
        {event.description}
      </Text>

      <RSVPButton event={event} isJoined={isJoined} onUpdate={onRSVPUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 14, elevation: 3 },
  image: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '700' },
  tag: {
    backgroundColor: '#007AFF',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 4,
    fontSize: 12,
  },
  date: { color: '#555', marginTop: 4 },
  location: { color: '#777', marginBottom: 6 },
  desc: { color: '#444' },
});
