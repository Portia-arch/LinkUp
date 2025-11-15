import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseDb } from '../../../config/firebase';

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
      Alert.alert('Please fill in all fields');
      return;
    } 
      Alert.alert('Event created successfully!');
      setTitle('');
      setDescription('');
      setCity('');
      navigation.navigate('Events', { refresh: true });

    try {
      await addDoc(collection(firebaseDb, 'events'), {
        title,
        city,
        date: date.toISOString(),
        description,
        createdAt: serverTimestamp(),
      });

    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.header}>Create New Event</Text>

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
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20 },
  header: { fontSize: 26, fontWeight: '700', color: '#1A1A1A', marginBottom: 20 },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 4 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, color: '#333' },
  input: { backgroundColor: '#F2F2F7', borderRadius: 12, padding: 12, marginTop: 6, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },

  dropdown: { backgroundColor: '#F2F2F7', borderRadius: 12, marginTop: 6 },
  dropdownContainer: { borderRadius: 12 },

  dateSelector: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  dateText: { fontSize: 16, color: '#333' },

  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
