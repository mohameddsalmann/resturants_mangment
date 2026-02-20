import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { STATUS_COLORS } from '@/constants/theme';
import { OrderStatus, TableStatus } from '@/types';

type BadgeStatus = OrderStatus | TableStatus;

const LABELS: Record<BadgeStatus, string> = {
    new: 'New',
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready: 'Ready',
    served: 'Served',
    paid: 'Paid',
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
};

interface Props {
    status: BadgeStatus;
    style?: ViewStyle;
}

export function StatusBadge({ status, style }: Props) {
    const color = STATUS_COLORS[status] ?? '#888';
    const label = LABELS[status] ?? status;

    return (
        <View style={[styles.badge, { backgroundColor: color + '20' }, style]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: 'flex-start',
        gap: 5,
    },
    dot: { width: 6, height: 6, borderRadius: 3 },
    label: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
