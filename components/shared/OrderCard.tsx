import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Clock } from 'lucide-react-native';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Order } from '@/types';
import { StatusBadge } from './StatusBadge';

interface Props {
    order: Order;
    style?: ViewStyle;
    actionButton?: React.ReactNode;
    showCustomerName?: boolean;
}

function timeAgo(dateStr: string): string {
    const mins = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

export function OrderCard({ order, style, actionButton, showCustomerName = true }: Props) {
    return (
        <View style={[styles.card, style]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.tableLabel}>Table {order.tableNumber}</Text>
                    {showCustomerName && order.customerName ? (
                        <Text style={styles.customerName}>{order.customerName}</Text>
                    ) : null}
                </View>
                <StatusBadge status={order.status} />
            </View>

            <View style={styles.items}>
                {order.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemQty}>{item.quantity}×</Text>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
                {order.items.some((i) => i.specialInstructions) && (
                    <View style={styles.instructionsRow}>
                        <Text style={styles.instructionsLabel}>Notes: </Text>
                        <Text style={styles.instructionsText}>
                            {order.items.filter((i) => i.specialInstructions).map((i) => i.specialInstructions).join('; ')}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <Clock size={12} color="#888" />
                    <Text style={styles.timeText}>{timeAgo(order.createdAt)}</Text>
                </View>
                <View style={styles.footerRight}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                </View>
            </View>

            {actionButton && <View style={styles.actionRow}>{actionButton}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        ...SHADOWS.small,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.s,
    },
    headerLeft: { gap: 2 },
    tableLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    customerName: { fontSize: 12, color: '#888' },
    items: { gap: 4, marginBottom: SPACING.s },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    itemQty: { fontSize: 13, fontWeight: '600', color: '#888', width: 24 },
    itemName: { fontSize: 13, color: '#1A1A1A', flex: 1 },
    itemPrice: { fontSize: 13, color: '#888' },
    instructionsRow: { flexDirection: 'row', marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    instructionsLabel: { fontSize: 11, fontWeight: '600', color: '#FF9F43' },
    instructionsText: { fontSize: 11, color: '#888', flex: 1 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.s,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeText: { fontSize: 12, color: '#888' },
    footerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    totalLabel: { fontSize: 12, color: '#888' },
    totalValue: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    actionRow: { marginTop: SPACING.s, alignItems: 'flex-end' },
});
