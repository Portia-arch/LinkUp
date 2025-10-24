import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View } from 'react-native';
import { useAuth } from '../App';

export default function CreateEventScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const { addEvent } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18 }}>Create Event</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, marginTop: 8, padding: 8 }} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, marginTop: 8, padding: 8 }} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={{ borderWidth: 1, marginTop: 8, padding: 8 }} />
      <View style={{ height: 12 }} />
      <Button title="Save" onPress={() => { addEvent({ name, description, date }).then(() => { navigation.goBack(); }); }} />
    </SafeAreaView>
  );
}