import React, { useState, useEffect } from 'react';
import {
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from '@/context/SessionContext';
import { useCartStore } from '@/store/cartStore';
import { getRestaurant } from '@/services/mockData';
import { Restaurant } from '@/types';

export default function EntryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ restaurantId: string; tableNumber: string }>();
    const { setThemeForRestaurant } = useTheme();
    const { startSession } = useSession();
    const { setRestaurant } = useCartStore();

    const [restaurant, setRestaurantData] = useState<Restaurant | null>(null);
    const [customerName, setCustomerName] = useState('');

    const restaurantId = params.restaurantId ?? 'rest_1';
    const tableNumber = parseInt(params.tableNumber ?? '1', 10);

    useEffect(() => {
        const r = getRestaurant(restaurantId);
        if (r) {
            setRestaurantData(r);
            setThemeForRestaurant(restaurantId);
        }
    }, [restaurantId]);

    const theme = restaurant?.theme;

    const handleViewMenu = () => {
        if (!customerName.trim()) return;
        startSession(restaurantId, tableNumber, customerName.trim());
        setRestaurant(restaurantId, restaurant?.taxRate ?? 0.10);
        router.push('/(guest)/menu');
    };

    if (!restaurant || !theme) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Restaurant not found</Text>
                <Pressable onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backLinkText}>Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <Image source={{ uri: restaurant.logo }} style={styles.logo} />
                <Text style={[styles.name, { color: theme.text }]}>{restaurant.name}</Text>
                <Text style={[styles.cuisine, { color: theme.textSecondary }]}>
                    {restaurant.cuisineType} • Table {tableNumber}
                </Text>
                <Text style={[styles.address, { color: theme.textSecondary }]}>
                    {restaurant.address}
                </Text>

                <View style={styles.form}>
                    <Text style={[styles.label, { color: theme.text }]}>Your Name</Text>
                    <TextInput
                        style={[styles.input, { borderColor: theme.primary + '40' }]}
                        value={customerName}
                        onChangeText={setCustomerName}
                        placeholder="Enter your name"
                        placeholderTextColor={theme.textSecondary}
                        autoFocus
                    />

                    <Pressable
                        style={[
                            styles.menuBtn,
                            { backgroundColor: theme.primary },
                            !customerName.trim() && styles.menuBtnDisabled,
                        ]}
                        onPress={handleViewMenu}
                        disabled={!customerName.trim()}
                    >
                        <Text style={[styles.menuBtnText, { color: theme.textOnPrimary }]}>
                            View Menu
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.l,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: SPACING.m,
    },
    name: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
    cuisine: { fontSize: 15, marginTop: 4 },
    address: { fontSize: 13, marginTop: 2 },
    form: { width: '100%', marginTop: SPACING.xl },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
    input: {
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        paddingHorizontal: SPACING.m,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1.5,
    },
    menuBtn: {
        borderRadius: RADIUS.m,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: SPACING.l,
    },
    menuBtnDisabled: { opacity: 0.4 },
    menuBtnText: { fontSize: 16, fontWeight: '700' },
    errorText: { fontSize: 18, color: '#888', textAlign: 'center' },
    backLink: { marginTop: SPACING.m },
    backLinkText: { fontSize: 14, color: '#339AF0', fontWeight: '600' },
});
