# LinkUp
A simple React Native mobile app for user-created community events, allowing users to register, RSVP, and view events. The app includes authentication (email/password + Google + Facebook), event creation, a user dashboard, and profile management.


## Features

## User Authentication:

Email/password login and registration
Google Sign-In
Facebook Sign-In

## User Profile:

Display name, avatar/photo, email
Logout functionality

## Events:

View list of upcoming events (mock API)
Create new events with name, description, and date
RSVP to events
Dashboard with registered events

## Navigation:

Stack navigation between screens (React Navigation)

## UI/UX:

Modular and responsive design
Clear and intuitive interface


## Tech Stack

React Native – Mobile development framework
Firebase Authentication – Email/password and social login
Expo – React Native toolchain for easier development
React Navigation – Screen navigation
JavaScript / JSX – Component-based UI
Expo Auth Session – Social login OAuth integration


## Setup & Installation

1. Clone the repository:

git clone https://github.com/Portia-arch/LinkUp.git
cd LinkUp


2. Install dependencies:

npm install
# or
yarn install


3. Install Expo dependencies:

 ``` bash
expo install expo-auth-session expo-google-auth-session expo-facebook firebase react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/native-stack 
```


4. Start the app:

``` bash
expo start
```

## Use an emulator or Expo Go app on your device.

Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication → Sign-in Methods:

Email/Password
Google
Facebook

3. Copy your Firebase config to firebase.js:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

## Social Login Setup

 Google Sign-In

1. Enable Google Sign-In in Firebase
2. Add Web client ID to GoogleSignInButton.jsx
3. For iOS: add reservedClientId in app.json

 Facebook Sign-In

1. Create a Facebook App at https://developers.facebook.com
2. Enable Facebook login in Firebase
3. Add App ID to FacebookSignInButton.jsx
4. Make sure OAuth redirect URI matches Firebase’s instructions


## Project Architecture

App.jsx – Entry point, wraps AppNavigator with AuthProvider
AuthContext.jsx – Provides user authentication state
Screens – Divided by feature:
Auth/ – Login, Register, Profile
Events/ – Event List, Event Create, Event Detail
Dashboard/ – User dashboard
Components – Reusable UI elements (EventCard, Social Buttons)
API – Mock API calls (can replace with real API)


## Usage

Login via email/password, Google, or Facebook
View upcoming events
Create a new event
RSVP to events and view registered events in dashboard
Update profile and logout


## Future Improvements

Integrate real backend API (e.g., Eventbrite)

Add push notifications for upcoming events

Add location/map support for events

Enable sharing events with friends

Implement persistent storage for offline access


## File Structure

````` bash
LINKUP/
├── App.jsx
├── firebase.js
├── src/
│   ├── api/events.jsx
│   ├── components/
│   │   ├── EventCard.jsx
│   │   ├── GoogleSignInButton.jsx
│   │   └── FacebookSignInButton.jsx
│   ├── context/AuthContext.jsx
│   ├── navigation/AppNavigator.jsx
│   ├── screens/
│   │   ├── Auth/LoginScreen.jsx
│   │   ├── Auth/RegisterScreen.jsx
│   │   ├── Auth/ProfileScreen.jsx
│   │   ├── Events/EventListScreen.jsx
│   │   ├── Events/EventCreateScreen.jsx
│   │   └── Events/EventDetailScreen.jsx
│   │   └── Dashboard/DashboardScreen.jsx 
```