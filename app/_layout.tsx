import { SessionProvider } from '@/context/SessionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(guest)" />
          <Stack.Screen name="(owner)" />
          <Stack.Screen name="(kitchen)" />
        </Stack>
        <StatusBar style="auto" />
      </SessionProvider>
    </ThemeProvider>
  );
}
