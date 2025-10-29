import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, FlatList, ActivityIndicator, Share } from 'react-native';
import { useAuth } from '../auth';
import EventCard from '../../components/EventCard';
import eventsMock from '../../mock/events.json';

export default function EventListScreen({ navigation }) {
  const { rsvps, toggleRSVP } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEvents(eventsMock);
    setLoading(false);
  }, []);

  async function handleShare(event) {
    try {
      await Share.share({
        message: `Join me at ${event.name} on ${event.date}! ${event.description}`
      });
    } catch (e) {
      console.warn(e);
    }
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }}>
        <Text style={{ fontSize: 18 }}>Events</Text>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Create" onPress={() => navigation.navigate('CreateEvent')} />
          <View style={{ width: 8 }} />
          <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
        </View>
      </View>
      <FlatList
        data={events}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            onRSVP={toggleRSVP}
            onShare={handleShare}
            joined={rsvps.includes(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}
