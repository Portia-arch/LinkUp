import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function EventCard({ event }) {
  const handleRSVP = () => {
    // Add RSVP logic here
    alert(`RSVP for ${event.name}`);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{event.name}</Text>
      {event.description ? <Text>{event.description}</Text> : null}
      <Text>{event.date}</Text>
      <Button title="RSVP" onPress={handleRSVP} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
});
