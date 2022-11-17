import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Navigation } from './src/navigation/Navigation';

axios.defaults.baseURL="http://192.168.1.4:4000"

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='light'/>
      <Navigation/>
    </NavigationContainer>
  );
}


