import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';

interface Props {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    accent?: string;
    style?: ViewStyle;
}

export function StatCard({ label, value, icon, accent = '#FF4B3A', style }: Props) {
    return (
        <View style={[styles.card, style]}>
            <View style={[styles.iconWrap, { backgroundColor: accent + '15' }]}>
                {icon}
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        ...SHADOWS.small,
        gap: 6,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
    label: { fontSize: 12, color: '#888' },
});
