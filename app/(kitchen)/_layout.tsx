import { Stack } from 'expo-router';

export default function KitchenLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="display" />
        </Stack>
    );
}
