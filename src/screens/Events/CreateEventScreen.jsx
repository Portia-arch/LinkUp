import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Keyboard, TouchableWithoutFeedback,
  Platform
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseDb } from '../../../config/firebase';

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false); 


  const [city, setCity] = useState(null);
  const [openCity, setOpenCity] = useState(false);
  const [cities, setCities] = useState([
    { label: 'Johannesburg', value: 'Johannesburg' },
    { label: 'Cape Town', value: 'Cape Town' },
    { label: 'Durban', value: 'Durban' },
    { label: 'Pretoria', value: 'Pretoria' },
    { label: 'Gqeberha', value: 'Gqeberha' },
  ]);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };


const handleSubmit = async () => {

  if (!title || !description || !city) {
    console.log('Validation failed:', { title, description, city });
    Alert.alert('Validation Error', 'Please fill in all fields');
    return;
  }
  console.log('Validation passed:', { title, description, city, date });

  try {
    setLoading(true);

    if (!firebaseDb) {
      Alert.alert('Error', 'Firestore not initialized properly.');
      return;
    }

    const docRef = await addDoc(collection(firebaseDb, 'events'), {
      title,
      city,
      date: date.toISOString(),
      description,
      createdAt: serverTimestamp(),
    });

    Alert.alert('Success', 'Event created successfully!', [
      {
        text: 'OK',
        onPress: () => {
          console.log('Clearing form and navigating to Events');
          setTitle('');
          setDescription('');
          setCity(null);
          navigation.navigate('Events', { refresh: true });
        },
      },
    ]);
  } catch (error) {
    console.error('Firestore addDoc failed:', error);
    if (error.message) console.log('Error message:', error.message);
    Alert.alert(
      'Error',
      'Failed to create event. Check console logs for details.'
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
      >
        <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Event</Text>
      </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>City</Text>
          <DropDownPicker
            open={openCity}
            value={city}
            items={cities}
            setOpen={setOpenCity}
            setValue={setCity}
            setItems={setCities}
            placeholder="Select city"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.dateSelector}
          >
            <Text style={styles.dateText}>
              {date.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholder="Describe your event..."
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Create Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1F4F8',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 10,
  },
  formCard: {
    marginTop: -40,
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    marginTop: 6,
    borderColor: '#E5E7EB',
  },
  dropdownContainer: {
    borderRadius: 12,
    borderColor: '#E5E7EB',
  },
  dateSelector: {
    backgroundColor: '#F5F7FA',
    padding: 14,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 16,
    color: '#1E293B',
  },
  submitButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
