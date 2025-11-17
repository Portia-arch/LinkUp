// import React, { useContext } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../../context/AuthContext.jsx';

// export default function ProfileScreen() {
//   const { user, logout } = useContext(AuthContext);
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My Profile</Text>

//       <View style={styles.profileCard}>
//         <Image
//           source={{
//             uri:
//               user?.photoURL ||
//               'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
//           }}
//           style={styles.avatar}
//         />
//         <Text style={styles.name}>{user?.displayName || 'Guest User'}</Text>
//         <Text style={styles.email}>{user?.email || 'No email available'}</Text>

//         {/* NEW: Settings Button */}
//         <TouchableOpacity
//           style={[styles.smallButton]}
//           onPress={() => navigation.navigate('EditProfile')}
//         >
//           <Text style={styles.smallButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Actions */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.primaryButton]}
//           onPress={() => navigation.navigate('Events')}
//         >
//           <Text style={styles.buttonText}>View Community Events</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.secondaryButton]}
//           onPress={() => navigation.navigate('CreateEvent')}
//         >
//           <Text style={styles.buttonText}>Create New Event</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.infoButton]}
//           onPress={() => navigation.navigate('JoinedEvents')}
//         >
//           <Text style={styles.buttonText}>My Joined Events</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.logoutButton]}
//           onPress={logout}
//         >
//           <Text style={styles.logoutText}>Log Out</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FA',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#1A1A1A',
//     marginVertical: 20,
//   },
//   profileCard: {
//     backgroundColor: '#fff',
//     width: '90%',
//     borderRadius: 20,
//     alignItems: 'center',
//     paddingVertical: 30,
//     paddingHorizontal: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 15,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//   },
//   email: {
//     fontSize: 14,
//     color: '#777',
//     marginTop: 5,
//   },
//   buttonContainer: {
//     width: '90%',
//   },
//   button: {
//     borderRadius: 12,
//     paddingVertical: 14,
//     marginVertical: 8,
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#007AFF',
//   },
//   secondaryButton: {
//     backgroundColor: '#2e3730ff',
//   },
//   infoButton: {
//     backgroundColor: '#0a0a0aff', 
//   },
//   logoutButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#FF3B30',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   logoutText: {
//     color: '#FF3B30',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   smallButton: {
//   backgroundColor: '#007AFF',
//   paddingHorizontal: 20,
//   paddingVertical: 8,
//   borderRadius: 10,
//   marginTop: 10,
// },
// smallButtonText: {
//   color: '#fff',
//   fontSize: 14,
//   fontWeight: '600',
// },
// });

import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
<ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              user?.photoURL ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{user?.displayName || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email || 'No email available'}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION: App Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Actions</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Events')}
        >
          <Text style={styles.itemText}>Community Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={styles.itemText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('JoinedEvents')}
        >
          <Text style={styles.itemText}>My Joined Events</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION: New Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Options</Text>

        {/* Saved / Bookmarked */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('SavedEvents')}
        >
          <Text style={styles.itemText}>Saved / Bookmarked Events</Text>
        </TouchableOpacity>

        {/* My Posted Events */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('MyPostedEvents')}
        >
          <Text style={styles.itemText}>My Posted Events</Text>
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={styles.itemText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION: Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {/* Theme Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.itemText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        {/* About App */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('AboutApp')}
        >
          <Text style={styles.itemText}>About App</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      </ScrollView>

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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 10,
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
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#1E293B20',
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },

  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },

  editButton: {
    marginTop: 15,
    backgroundColor: '#64748B',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  section: {
    marginTop: 25,
    width: '90%',
    alignSelf: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
  },

  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginVertical: 6,
    elevation: 2,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },

  switchRow: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderColor: '#EF4444',
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 14,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});
