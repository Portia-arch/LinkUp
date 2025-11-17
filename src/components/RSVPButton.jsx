import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firebaseDb } from '../../config/firebase';
import { AuthContext } from '../context/AuthContext';

export default function RSVPButton({ event, initialJoined, onChange, style }) {
  const { user } = useContext(AuthContext);
  const [isJoined, setIsJoined] = useState(initialJoined);

  useEffect(() => {
    setIsJoined(initialJoined);
  }, [initialJoined]);

  const handlePress = async () => {
    if (!user) {
      Alert.alert('Login required', 'You need to login to RSVP.');
      return;
    }

    const eventId = event.computedId;
    const ref = doc(firebaseDb, `users/${user.uid}/rsvps`, eventId);

    try {
      if (isJoined) {
        setIsJoined(false);
        await deleteDoc(ref);
        Alert.alert('RSVP Cancelled', `You have unjoined "${event.title}"`);
      } else {
        setIsJoined(true);
        await setDoc(ref, { ...event, createdAt: new Date() });
        Alert.alert('RSVP Confirmed', `You have joined "${event.title}"`);
      }

      if (onChange) {
        onChange(eventId, !isJoined);
      }
    } catch (err) {
      console.error('RSVP error:', err);
      setIsJoined(prev => !prev);
      Alert.alert('Error', 'RSVP failed');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]} 
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{isJoined ? 'Joined' : 'Join'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
      flex: 3,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
