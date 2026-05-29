/**
 * Layout delle tab principali: Home, Statistiche, Profilo.
 */
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.rosso,
        tabBarInactiveTintColor: Colors.grigioMedio,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="statistiche" options={{ title: 'Statistiche' }} />
      <Tabs.Screen name="profilo" options={{ title: 'Profilo' }} />
    </Tabs>
  );
}
