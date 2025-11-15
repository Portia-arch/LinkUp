import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

export default function AppHeader({ showProfile = true }) {
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { user, setUser } = useContext(AuthContext);
  const route = useRoute();

  const toggleMenu = () => setMenuVisible((prev) => !prev);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);

  const requireLogin = (callback) => {
    if (!user) {
      Alert.alert('Login required', 'Please log in first.');
      navigation.navigate('Login');
      return;
    }
    callback();
  };

  const handleLogout = () => {
    if (!user) {
      Alert.alert('Login required', 'Please log in first.');
      navigation.navigate('Login');
      return;
    }
    setUser(null);
    setMenuVisible(false);
    navigation.navigate('Login');
  };

  const slideStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
    opacity: slideAnim,
  };

  if (route.name === 'Login') return null;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={[styles.header, { height: width * 0.15 }]}>
        
        <TouchableOpacity
          style={styles.logoWrapper}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/images/linkup-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {showProfile && (
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.profileButton}>
              <Image
                source={{
                  uri:
                    user?.photoURL ||
                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                style={styles.userAvatar}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      {showProfile && (
        <Animated.View
          style={[
            styles.dropdownMenu,
            slideStyle,
            { display: menuVisible ? 'flex' : 'none' },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              requireLogin(() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              })
            }
          >
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              requireLogin(() => {
                setMenuVisible(false);
                navigation.navigate('Events');
              })
            }
          >
            <Text style={styles.menuText}>Events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              requireLogin(() => {
                setMenuVisible(false);
                navigation.navigate('JoinedEvents');
              })
            }
          >
            <Text style={styles.menuText}>Joined Events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logout]}
            onPress={handleLogout}
          >
            <Text style={[styles.menuText, { color: '#d9534f' }]}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#fff' },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    zIndex: 10,
  },
  logoWrapper: { justifyContent: 'center' },
  logo: { width: 110, height: 45 },

  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  profileButton: { padding: 4 },
  dropdownMenu: {
    position: 'absolute',
    right: 15,
    top: 70,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    width: 160,
    elevation: 8,
    zIndex: 20,
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 15 },
  menuText: { fontSize: 16, color: '#333' },
  logout: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 5,
  },
});
