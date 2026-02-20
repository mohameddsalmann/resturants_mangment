import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { MOCK_STAFF } from '@/services/mockData';
import { useRouter } from 'expo-router';
import { Delete } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function KitchenLoginScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [restaurantId, setRestaurantId] = useState('rest_1');
    const [error, setError] = useState('');

    const handleKey = (key: string) => {
        setError('');
        if (key === 'del') {
            setPin((p) => p.slice(0, -1));
        } else if (pin.length < 4) {
            const next = pin + key;
            setPin(next);
            if (next.length === 4) {
                validate(next);
            }
        }
    };

    const validate = (enteredPin: string) => {
        const staff = MOCK_STAFF.find(
            (s) => s.role === 'kitchen' && s.pin === enteredPin && s.restaurantId === restaurantId
        );
        if (staff) {
            router.replace('/(kitchen)/display' as any);
        } else {
            setError('Incorrect PIN. Try again.');
            setPin('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Kitchen Login</Text>
                <Text style={styles.subtitle}>Enter your 4-digit PIN</Text>

                {/* Restaurant selector */}
                <View style={styles.restRow}>
                    {['rest_1', 'rest_2'].map((id) => (
                        <Pressable
                            key={id}
                            style={[styles.restPill, restaurantId === id && styles.restPillActive]}
                            onPress={() => { setRestaurantId(id); setPin(''); setError(''); }}
                        >
                            <Text style={[styles.restPillText, restaurantId === id && styles.restPillTextActive]}>
                                {id === 'rest_1' ? 'La Bella Italia' : 'Sakura Garden'}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* PIN dots */}
                <View style={styles.dotsRow}>
                    {[0, 1, 2, 3].map((i) => (
                        <View
                            key={i}
                            style={[styles.dot, i < pin.length && styles.dotFilled]}
                        />
                    ))}
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Number pad */}
                <View style={styles.pad}>
                    {KEYS.map((key, idx) => {
                        if (key === '') return <View key={idx} style={styles.keyEmpty} />;
                        return (
                            <Pressable
                                key={idx}
                                style={[styles.key, key === 'del' && styles.keyDel]}
                                onPress={() => handleKey(key)}
                            >
                                {key === 'del' ? (
                                    <Delete size={22} color="#1A1A1A" />
                                ) : (
                                    <Text style={styles.keyText}>{key}</Text>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                <Text style={styles.hintText}>
                    {restaurantId === 'rest_1' ? 'Hint: PIN is 1234' : 'Hint: PIN is 5678'}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.l,
        gap: SPACING.l,
    },
    title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
    subtitle: { fontSize: 15, color: '#888', marginTop: -SPACING.s },
    restRow: { flexDirection: 'row', gap: SPACING.s },
    restPill: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#F0F0F0',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    restPillActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
    restPillText: { fontSize: 12, fontWeight: '600', color: '#888' },
    restPillTextActive: { color: COLORS.primary },
    dotsRow: { flexDirection: 'row', gap: SPACING.m },
    dot: {
        width: 18, height: 18, borderRadius: 9,
        borderWidth: 2, borderColor: '#CCC', backgroundColor: 'transparent',
    },
    dotFilled: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    errorText: { fontSize: 13, color: '#FF6B6B', fontWeight: '600' },
    pad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: 280,
        gap: SPACING.s,
    },
    key: {
        width: 80, height: 80, borderRadius: RADIUS.m,
        backgroundColor: '#FFF',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 4,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
        elevation: 2,
    },
    keyDel: { backgroundColor: '#FFF0F0' },
    keyEmpty: { width: 80, height: 80 },
    keyText: { fontSize: 26, fontWeight: '500', color: '#1A1A1A' },
    hintText: { fontSize: 12, color: '#BBB' },
});
