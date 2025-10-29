import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import EventCard from '../../components/EventCard';
import { fetchEvents } from '../../api/events';

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Create Event" onPress={() => navigation.navigate('CreateEvent')} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
      />
    </View>
  );
}
