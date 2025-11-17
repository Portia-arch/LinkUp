import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import RSVPButton from './RSVPButton';

export default function EventCard({ event, initialJoined, onRSVP }) {
  return (
    <View style={styles.card}>
      {event.image && <Image source={{ uri: event.image }} style={styles.image} />}

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.tagContainer}>
        <Text style={styles.tag}>
          {event.source === 'INTERNAL' ? 'INTERNAL EVENT' : 'EXTERNAL EVENT'}
        </Text>
      </View>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.location}>{event.location || 'No location specified'}</Text>
      <Text style={styles.desc} numberOfLines={3}>
        {event.description || 'No description available'}
      </Text>

      <RSVPButton event={event} isJoined={initialJoined} onUpdate={onRSVP} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  tag: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  desc: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 10,
  },
  rsvpButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rsvpText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
