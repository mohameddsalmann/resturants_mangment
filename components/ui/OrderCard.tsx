import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Order } from '@/types';
import { StatusBadge } from './StatusBadge';

interface OrderCardProps {
    order: Order;
    style?: ViewStyle;
    actionButton?: React.ReactNode;
}

function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function elapsedMinutes(isoString: string): number {
    return Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
}

export function OrderCard({ order, style, actionButton }: OrderCardProps) {
    const elapsed = elapsedMinutes(order.createdAt);

    return (
        <View style={[styles.card, style]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.tableText}>Table {order.tableNumber}</Text>
                    <Text style={styles.timeText}>
                        {formatTime(order.createdAt)} · {elapsed}m ago
                    </Text>
                </View>
                <StatusBadge status={order.status} />
            </View>

            <View style={styles.divider} />

            <View style={styles.itemsList}>
                {order.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemQty}>{item.quantity}×</Text>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.totalText}>Total: <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text></Text>
                {actionButton}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        ...SHADOWS.small,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.s,
    },
    tableText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: SPACING.s,
    },
    itemsList: {
        gap: 4,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    itemQty: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '600',
        width: 24,
    },
    itemName: {
        flex: 1,
        fontSize: 13,
        color: COLORS.text,
    },
    itemPrice: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.s,
        paddingTop: SPACING.s,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    totalText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    totalAmount: {
        fontWeight: '700',
        color: COLORS.text,
    },
});
