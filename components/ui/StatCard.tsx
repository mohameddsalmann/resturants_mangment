import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    style?: ViewStyle;
    accent?: string;
}

export function StatCard({ label, value, icon, style, accent = COLORS.primary }: StatCardProps) {
    return (
        <View style={[styles.card, style]}>
            <View style={[styles.iconWrap, { backgroundColor: accent + '18' }]}>
                {icon}
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        alignItems: 'flex-start',
        ...SHADOWS.small,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.s,
    },
    value: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    label: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
});
