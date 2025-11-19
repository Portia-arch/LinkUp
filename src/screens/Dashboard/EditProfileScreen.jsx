// import React, { useState, useContext } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { AuthContext } from '../../context/AuthContext';
// import { firebaseDb } from '../../../config/firebase';
// import { doc, setDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';


// export default function EditProfileScreen({ navigation }) {
//   const { user, updateUser } = useContext(AuthContext);

//   const [name, setName] = useState(user?.displayName || '');
//   const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       setPhotoURL(result.assets[0].uri);
//     }
//   };

// //   const saveProfile = async () => {
// //   try {
// //     const auth = getAuth();
// //     const currentUser = auth.currentUser;

// //     if (!currentUser) {
// //       Alert.alert('Error', 'No authenticated user found.');
// //       console.error('No authenticated user');
// //       return;
// //     }

// //     await updateUser({ displayName: name, photoURL });

// //     const userRef = doc(firebaseDb, 'users', currentUser.uid);
// //     await setDoc(userRef, {
// //       name,
// //       photoURL,
// //       email: currentUser.email,
// //     });

// //     Alert.alert('Success', 'Profile updated successfully!');
// //     navigation.navigate('Profile');
// //   } catch (e) {
// //     console.error('Profile update error:', e);
// //     Alert.alert('Error', `Failed to update profile: ${e.message}`);
// //   }
// // };

// const saveProfile = async () => {
//   try {
//     const auth = getAuth();
//     const currentUser = auth.currentUser;

//     if (!currentUser) {
//       Alert.alert('Error', 'No authenticated user found.');
//       return;
//     }

//     // Update user in context first
//     await updateUser({ displayName: name, photoURL });

//     // Update Firestore
//     const userRef = doc(firebaseDb, 'users', currentUser.uid);
//     await setDoc(userRef, {
//       name,
//       photoURL,
//       email: currentUser.email,
//     });

//     Alert.alert('Success', 'Profile updated successfully!', [
//       {
//         text: 'OK',
//         onPress: () => {
//           // Navigate after user confirms the alert
//           navigation.replace('Profile'); // replace ensures going back to Profile
//         },
//       },
//     ]);
//   } catch (e) {
//     console.error('Profile update error:', e);
//     Alert.alert('Error', `Failed to update profile: ${e.message}`);
//   }
// };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Edit Profile</Text>
//         </View>

//         <View style={styles.profileCard}>
//           <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
//             <Image
//               source={{ uri: photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
//               style={styles.avatar}
//             />
//             <Text style={styles.changePhoto}>Change Photo</Text>
//           </TouchableOpacity>

//           <TextInput
//             style={styles.input}
//             placeholder="Full Name"
//             value={name}
//             onChangeText={setName}
//           />

//           <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
//             <Text style={styles.saveText}>Save Changes</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F1F4F8',
//   },

//   header: {
//     backgroundColor: '#1E293B',
//     paddingTop: 60,
//     paddingBottom: 40,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#fff',
//     textAlign: 'center',
//     paddingBottom: 20,
//   },

//   profileCard: {
//     marginTop: -50,
//     backgroundColor: '#fff',
//     width: '90%',
//     alignSelf: 'center',
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 6,
//     alignItems: 'center',
//   },

//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 60,
//     marginBottom: 10,
//     borderWidth: 3,
//     borderColor: '#1E293B20',
//   },
//   changePhoto: {
//     color: '#0EA5E9',
//     fontSize: 14,
//     marginBottom: 20,
//   },

//   input: {
//     width: '100%',
//     backgroundColor: '#F5F7FA',
//     padding: 14,
//     borderRadius: 12,
//     fontSize: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },

//   saveButton: {
//     backgroundColor: '#34C759',
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 14,
//     marginTop: 10,
//   },
//   saveText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });


import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';
import { firebaseDb } from '../../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

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
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'No authenticated user found.');
        return;
      }

      await updateUser({ displayName: name, photoURL });

      const userRef = doc(firebaseDb, 'users', currentUser.uid);
      await setDoc(userRef, {
        name,
        photoURL,
        email: currentUser.email,
      });

      Alert.alert('Success', 'Profile updated successfully!');
      // No redirect; user can go back manually
    } catch (e) {
      console.error('Profile update error:', e);
      Alert.alert('Error', `Failed to update profile: ${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
            <Image
              source={{
                uri:
                  photoURL ||
                  'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
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
      </ScrollView>

      {/* Back Button at the bottom */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F4F8',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 20,
  },
  profileCard: {
    marginTop: -50,
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
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#1E293B20',
  },
  changePhoto: {
    color: '#0EA5E9',
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#F5F7FA',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonContainer: {
    width: '100%',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
