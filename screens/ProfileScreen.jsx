import React from 'react';
import { SafeAreaView, View, Text, Image, Button } from 'react-native';
import { useAuth } from '../App';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, padding: 12, alignItems: 'center' }}>
      {user?.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={{ width: 96, height: 96, borderRadius: 48 }} />
      ) : (
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center' }}>
          <Text>?</Text>
        </View>
      )}
      <Text style={{ fontSize: 18, marginTop: 12 }}>{user?.displayName || user?.email}</Text>
      <View style={{ height: 12 }} />
      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
    </SafeAreaView>
  );
}