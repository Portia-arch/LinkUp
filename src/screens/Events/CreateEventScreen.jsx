// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';

// export default function CreateEventScreen({ navigation }) {
//   const [title, setTitle] = useState('');
//   const [date, setDate] = useState('');
//   const [description, setDescription] = useState('');

  // const handleSubmit = () => {
  //   if (!title || !date || !description) {
  //     Alert.alert('Please fill in all fields');
  //     return;
  //   }
  //   Alert.alert('Event created successfully!');
  //   navigation.navigate('Events');
  // };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <View style={styles.container}>
//         <Text style={styles.header}>Create New Event</Text>

//         <View style={styles.formCard}>
//           <Text style={styles.label}>Event Title</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter event title"
//             value={title}
//             onChangeText={setTitle}
//           />

//           <Text style={styles.label}>Date</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="YYYY-MM-DD"
//             value={date}
//             onChangeText={setDate}
//           />

//           <Text style={styles.label}>City</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="City"
//             value={date}
//             onChangeText={setTitle}
//           />

//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             multiline
//             numberOfLines={4}
//             placeholder="Describe your event..."
//             value={description}
//             onChangeText={setDescription}
//           />

//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//             <Text style={styles.submitText}>Create Event</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseDb } from '../../../config/firebase';

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async () => {
    if (!title || !date || !description || !city) {
      Alert.alert('Please fill in all fields');
      return;
    } Alert.alert('Event created successfully!');
      setTitle('');
      setDate('');
      setDescription('');
      setCity('');

    try {
      await addDoc(collection(firebaseDb, 'events'), {
        title,
        date,
        description,
        city,
        createdAt: serverTimestamp(),
      });

      // Optionally navigate back to events screen
      navigation.navigate('Events', { refresh: true });
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
          <TextInput style={styles.input} placeholder="Enter event title" value={title} onChangeText={setTitle} />

          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} placeholder="Enter city" value={city} onChangeText={setCity} />

          <Text style={styles.label}>Date</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />

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
  submitButton: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
