import React from 'react';
import { View, Text, Button } from 'react-native';

export default function EventCard({ item, onRSVP, onShare, joined }) {
  return (
    <View style={{ padding: 12, borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>{item.name}</Text>
      <Text>{item.date}</Text>
      <Text numberOfLines={2}>{item.description}</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Button title={joined ? 'Joined' : 'RSVP'} onPress={() => onRSVP(item)} disabled={joined} />
        <View style={{ width: 8 }} />
        <Button title="Share" onPress={() => onShare(item)} />
      </View>
    </View>
  );
}