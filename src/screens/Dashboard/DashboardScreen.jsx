import React from 'react';
import { SafeAreaView, Text, FlatList, View, Button } from 'react-native';
import { useAuth } from '../auth';

export default function DashboardScreen() {
  const { eventsCreated, rsvpEvents, signOut } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18 }}>Your Dashboard</Text>
      <Text style={{ marginTop: 8 }}>Events you joined:</Text>
      <FlatList
        data={rsvpEvents}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>{item.name} — {item.date}</Text>
          </View>
        )}
      />
      <View style={{ height: 12 }} />
      <Text style={{ marginTop: 8 }}>Events you created:</Text>
      <FlatList
        data={eventsCreated}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>{item.name} — {item.date}</Text>
          </View>
        )}
      />
      <View style={{ marginTop: 16 }}>
        <Button title="Sign out" onPress={() => signOut()} />
      </View>
    </SafeAreaView>
  );
}
