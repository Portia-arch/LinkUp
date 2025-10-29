import { AppRegistry } from 'react-native';
import App from './app'; // or './App' depending on filename
import { name as appName } from './app.json'; // ensure app.json has a "name" value

AppRegistry.registerComponent(appName || 'main', () => App);