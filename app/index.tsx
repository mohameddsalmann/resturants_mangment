import { useSession } from '@/context/SessionContext';
import { getRestaurant } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuthStore();
    const { isActive } = useSession();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FF4B3A" />
            </View>
        );
    }

    // Owner is logged in
    if (isAuthenticated) {
        const { user } = useAuthStore.getState();
        const restaurant = user ? getRestaurant(user.restaurantId) : null;
        if (restaurant && !restaurant.isSetupComplete) {
            return <Redirect href={'/(owner)/onboarding' as any} />;
        }
        return <Redirect href="/(owner)/dashboard" />;
    }

    // Guest has active session → guest menu
    if (isActive) {
        return <Redirect href="/(guest)/menu" />;
    }

    // Default → auth login (owner login + links to guest scan & kitchen)
    return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
