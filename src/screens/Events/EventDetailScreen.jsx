import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function EventDetailScreen({ route }) {
  const { event } = route.params;

  const handleRSVP = () => {
    Alert.alert('RSVP', `You have registered for ${event.name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{event.name}</Text>
      {event.description ? <Text>{event.description}</Text> : null}
      <Text>{event.date}</Text>
      <Button title="RSVP" onPress={handleRSVP} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
