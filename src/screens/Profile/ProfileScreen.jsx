import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';
import { firebaseDb, firebaseAuth } from '../../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.displayName || user?.name || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || user?.picture || '');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoURL(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    try {
      if (user?.uid) {
        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) throw new Error('No Firebase user logged in');

        await updateProfile(currentUser, { displayName: name, photoURL });
        await setDoc(doc(firebaseDb, 'users', currentUser.uid), {
          name,
          photoURL,
          email: currentUser.email,
        });

      } else if (user?.sub) {
        await setDoc(doc(firebaseDb, 'users', user.sub), {
          name,
          photoURL,
          email: user.email,
        });
      } else {
        throw new Error('Unknown user provider');
      }

      setUser({ displayName: name, photoURL });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.navigate('Profile');

    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri: photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#F5F7FA' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  changePhoto: { color: '#007AFF', fontSize: 14, marginBottom: 20 },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
