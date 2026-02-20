import { Stack } from 'expo-router';

export default function GuestLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="scan" />
            <Stack.Screen name="entry" />
            <Stack.Screen name="menu" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="tracking" />
        </Stack>
    );
}
