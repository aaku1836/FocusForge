import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import JournalScreen from './src/screens/JournalScreen';
import PrioritizerScreen from './src/screens/PrioritizerScreen';
import PomodoroScreen from './src/screens/PomodoroScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import Sidebar from './src/components/Sidebar';
import { Colors } from './src/theme/colors';

const Drawer = createDrawerNavigator<any>();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.border,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={MyTheme}>
        <StatusBar style="light" />
        <Drawer.Navigator
          drawerContent={(props: any) => <Sidebar {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: Colors.border,
            },
            headerTintColor: Colors.textPrimary,
            drawerStyle: {
              backgroundColor: Colors.surface,
              width: 280,
            },
          }}
        >
          <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Focus Forge' }} />
          <Drawer.Screen name="Organizer" component={JournalScreen} options={{ title: 'Organizer' }} />
          <Drawer.Screen name="Prioritizer" component={PrioritizerScreen} options={{ title: 'Task Prioritizer' }} />
          <Drawer.Screen name="Pomodoro" component={PomodoroScreen} options={{ title: 'Pomodoro Timer' }} />
          <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
