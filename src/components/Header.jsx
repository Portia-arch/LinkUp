import React from 'react';
import { SafeAreaView, View, Image, StyleSheet, Platform } from 'react-native';

export default function Header() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/linkup-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#fff',
  },
  container: {
    height: 56,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'ios' ? 6 : 0,
  },
  logo: {
    width: 540,
    height: 36,
  },
});