import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import RSVPButton from './RSVPButton';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';

export default function EventCard({ event, isJoined, onRSVP }) {
  const navigation = useNavigation();

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(
        `Check out this event: ${event.title}\n${event.date}\n${event.location}\n\n${event.description}`
      );
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventDetail', { event })}
    >
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

      <View style={styles.buttonRow}>
        <RSVPButton
          event={event}
          initialJoined={isJoined}
          onChange={onRSVP}
          style={styles.button}
        />
        
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
