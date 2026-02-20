import { RADIUS, SPACING } from '@/constants/theme';
import { useSession } from '@/context/SessionContext';
import { useTheme } from '@/context/ThemeContext';
import { useOrderStore } from '@/store/orderStore';
import { Order, OrderStatus } from '@/types';
import { useRouter } from 'expo-router';
import { Check, ChefHat, Clock, CreditCard, UtensilsCrossed } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'new', label: 'Order Placed', icon: <Check size={18} color="#FFF" /> },
    { status: 'accepted', label: 'Accepted', icon: <Check size={18} color="#FFF" /> },
    { status: 'preparing', label: 'Preparing', icon: <ChefHat size={18} color="#FFF" /> },
    { status: 'ready', label: 'Ready', icon: <UtensilsCrossed size={18} color="#FFF" /> },
    { status: 'served', label: 'Served', icon: <CreditCard size={18} color="#FFF" /> },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
    new: 0, accepted: 1, preparing: 2, ready: 3, served: 4, paid: 5,
};

export default function TrackingScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { session } = useSession();
    const { orders, getCurrentOrder } = useOrderStore();
    const [order, setOrder] = useState<Order | undefined>(undefined);

    useEffect(() => {
        if (session) {
            const current = getCurrentOrder(session.restaurantId, session.tableNumber);
            setOrder(current);
        }
    }, [session, orders]);

    // Auto-poll simulation every 15s
    useEffect(() => {
        const interval = setInterval(() => {
            if (session) {
                const current = getCurrentOrder(session.restaurantId, session.tableNumber);
                setOrder(current);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [session]);

    if (!order) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.empty}>
                    <Text style={styles.emptyTitle}>No active order</Text>
                    <Text style={styles.emptySubtitle}>Place an order from the menu</Text>
                    <Pressable
                        style={[styles.menuBtn, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/(guest)/menu')}
                    >
                        <Text style={[styles.menuBtnText, { color: theme.textOnPrimary }]}>Back to Menu</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const currentIdx = STATUS_INDEX[order.status] ?? 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.text }]}>Order Tracking</Text>
                <Text style={[styles.orderId, { color: theme.textSecondary }]}>
                    Order #{order.id.slice(-4)} • Table {order.tableNumber}
                </Text>

                {/* Progress Steps */}
                <View style={styles.stepsContainer}>
                    {STEPS.map((step, idx) => {
                        const done = currentIdx >= idx;
                        const active = currentIdx === idx;
                        return (
                            <View key={step.status} style={styles.stepRow}>
                                <View style={styles.stepIndicator}>
                                    <View
                                        style={[
                                            styles.stepCircle,
                                            { backgroundColor: done ? theme.primary : '#E0E0E0' },
                                            active && styles.stepCircleActive,
                                        ]}
                                    >
                                        {step.icon}
                                    </View>
                                    {idx < STEPS.length - 1 && (
                                        <View
                                            style={[
                                                styles.stepLine,
                                                { backgroundColor: currentIdx > idx ? theme.primary : '#E0E0E0' },
                                            ]}
                                        />
                                    )}
                                </View>
                                <View style={styles.stepContent}>
                                    <Text style={[styles.stepLabel, done && { color: theme.text, fontWeight: '700' }]}>
                                        {step.label}
                                    </Text>
                                    {active && order.estimatedWaitMinutes && (
                                        <View style={styles.waitRow}>
                                            <Clock size={12} color={theme.primary} />
                                            <Text style={[styles.waitText, { color: theme.primary }]}>
                                                ~{order.estimatedWaitMinutes} min
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Order Details */}
                <View style={styles.detailCard}>
                    <Text style={styles.detailTitle}>Order Details</Text>
                    {order.items.map((item, idx) => (
                        <View key={idx} style={styles.detailRow}>
                            <Text style={styles.detailQty}>{item.quantity}×</Text>
                            <Text style={styles.detailName}>{item.name}</Text>
                            <Text style={styles.detailPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailTotalLabel}>Total</Text>
                        <Text style={[styles.detailTotalValue, { color: theme.primary }]}>
                            ${order.total.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Order More */}
                <Pressable
                    style={[styles.orderMoreBtn, { borderColor: theme.primary }]}
                    onPress={() => router.push('/(guest)/menu')}
                >
                    <Text style={[styles.orderMoreText, { color: theme.primary }]}>Order More</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: SPACING.l, paddingBottom: 100 },
    title: { fontSize: 28, fontWeight: '800' },
    orderId: { fontSize: 14, marginTop: 4, marginBottom: SPACING.l },
    stepsContainer: { marginBottom: SPACING.l },
    stepRow: { flexDirection: 'row', minHeight: 60 },
    stepIndicator: { alignItems: 'center', width: 40 },
    stepCircle: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    stepCircleActive: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        elevation: 4,
    },
    stepLine: { width: 3, flex: 1, marginVertical: 2 },
    stepContent: { flex: 1, paddingLeft: SPACING.m, paddingTop: 6 },
    stepLabel: { fontSize: 15, color: '#AAA' },
    waitRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    waitText: { fontSize: 12, fontWeight: '600' },
    detailCard: {
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        gap: 8,
    },
    detailTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
    detailRow: { flexDirection: 'row', alignItems: 'center' },
    detailQty: { fontSize: 13, fontWeight: '600', color: '#888', width: 28 },
    detailName: { fontSize: 13, color: '#1A1A1A', flex: 1 },
    detailPrice: { fontSize: 13, color: '#888' },
    detailDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
    detailTotalLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', flex: 1 },
    detailTotalValue: { fontSize: 17, fontWeight: '800' },
    orderMoreBtn: {
        borderWidth: 2,
        borderRadius: RADIUS.m,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: SPACING.l,
    },
    orderMoreText: { fontSize: 15, fontWeight: '700' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.m },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
    emptySubtitle: { fontSize: 14, color: '#888' },
    menuBtn: {
        paddingHorizontal: SPACING.l,
        paddingVertical: 12,
        borderRadius: RADIUS.m,
    },
    menuBtnText: { fontSize: 14, fontWeight: '700' },
});
