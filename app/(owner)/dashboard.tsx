import { OrderCard } from '@/components/shared/OrderCard';
import { StatCard } from '@/components/shared/StatCard';
import { RADIUS, SPACING } from '@/constants/theme';
import { getDashboardStats, getOrders, getRestaurant } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Order, OrderStatus } from '@/types';
import { createAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Clock, DollarSign, LogOut, ShoppingBag, TrendingUp, Volume2, VolumeX } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type FilterTab = 'all' | 'new' | 'preparing' | 'ready';
const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
];

function nextStatus(current: OrderStatus): OrderStatus | null {
    if (current === 'new') return 'accepted';
    if (current === 'accepted') return 'preparing';
    if (current === 'preparing') return 'ready';
    if (current === 'ready') return 'served';
    if (current === 'served') return 'paid';
    return null;
}

function actionLabel(current: OrderStatus): string | null {
    if (current === 'new') return 'Accept';
    if (current === 'accepted') return 'Send to Kitchen';
    if (current === 'preparing') return 'Mark Ready';
    if (current === 'ready') return 'Mark Served';
    if (current === 'served') return 'Mark Paid';
    return null;
}

export default function OwnerDashboardScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { orders: storeOrders, updateOrderStatus } = useOrderStore();
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [muted, setMuted] = useState(false);
    const [waitModal, setWaitModal] = useState<{ orderId: string; current: number } | null>(null);
    const [waitInput, setWaitInput] = useState('');
    const lastOrderCount = useRef(0);

    const restaurantId = user?.restaurantId ?? 'rest_1';
    const restaurant = getRestaurant(restaurantId);
    const primary = restaurant?.theme.primary ?? '#FF4B3A';

    useEffect(() => {
        const newCount = storeOrders.filter((o) => o.restaurantId === restaurantId && o.status === 'new').length;
        if (newCount > lastOrderCount.current) {
            if (!muted) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                try {
                    const player = createAudioPlayer({ uri: 'https://www.soundjay.com/buttons/beep-01a.mp3' });
                    player.play();
                } catch { }
            }
        }
        lastOrderCount.current = newCount;
    }, [storeOrders, muted]);

    const handleSetWait = () => {
        if (!waitModal) return;
        const mins = parseInt(waitInput, 10);
        if (isNaN(mins) || mins < 1) { Alert.alert('Invalid', 'Enter a number of minutes'); return; }
        updateOrderStatus(waitModal.orderId, storeOrders.find(o => o.id === waitModal.orderId)?.status ?? 'new');
        setWaitModal(null);
    };

    const mockOrders = getOrders(restaurantId);
    const allOrders: Order[] = [
        ...storeOrders.filter((o) => o.restaurantId === restaurantId),
        ...mockOrders,
    ];
    const stats = getDashboardStats(restaurantId);

    const filtered = allOrders.filter((o) => {
        if (activeTab === 'all') return o.status !== 'paid';
        return o.status === activeTab;
    });

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.restaurantName}>{restaurant?.name ?? 'Dashboard'}</Text>
                        <Text style={styles.greeting}>Welcome, {user?.name?.split(' ')[0]}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <Pressable
                            style={styles.muteBtn}
                            onPress={() => setMuted((m) => !m)}
                        >
                            {muted
                                ? <VolumeX size={16} color="#888" />
                                : <Volume2 size={16} color={primary} />
                            }
                        </Pressable>
                        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                            <LogOut size={18} color="#FF6B6B" />
                        </Pressable>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsGrid}>
                    <StatCard
                        label="Revenue"
                        value={`$${stats.todayRevenue.toFixed(0)}`}
                        icon={<DollarSign size={18} color={primary} />}
                        accent={primary}
                        style={styles.statCard}
                    />
                    <StatCard
                        label="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingBag size={18} color="#339AF0" />}
                        accent="#339AF0"
                        style={styles.statCard}
                    />
                    <StatCard
                        label="Active"
                        value={stats.activeOrders}
                        icon={<TrendingUp size={18} color="#51CF66" />}
                        accent="#51CF66"
                        style={styles.statCard}
                    />
                    <StatCard
                        label="Avg Time"
                        value={`${stats.avgCompletionTime}m`}
                        icon={<Clock size={18} color="#FFB84D" />}
                        accent="#FFB84D"
                        style={styles.statCard}
                    />
                </View>

                {/* Filter Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
                    {TABS.map((tab) => (
                        <Pressable
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && { backgroundColor: primary }]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Orders */}
                {filtered.map((order) => {
                    const label = actionLabel(order.status);
                    const next = nextStatus(order.status);
                    return (
                        <OrderCard
                            key={order.id}
                            order={order}
                            showCustomerName
                            style={styles.orderCard}
                            actionButton={
                                label && next ? (
                                    <View style={styles.actionRow}>
                                        <Pressable
                                            style={styles.waitBtn}
                                            onPress={() => { setWaitModal({ orderId: order.id, current: order.estimatedWaitMinutes ?? 15 }); setWaitInput(String(order.estimatedWaitMinutes ?? 15)); }}
                                        >
                                            <Clock size={12} color="#888" />
                                            <Text style={styles.waitBtnText}>{order.estimatedWaitMinutes ?? 15}m</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.actionBtn, { backgroundColor: primary }]}
                                            onPress={() => updateOrderStatus(order.id, next)}
                                        >
                                            <Text style={styles.actionBtnText}>{label}</Text>
                                        </Pressable>
                                    </View>
                                ) : null
                            }
                        />
                    );
                })}

                {filtered.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No orders in this category</Text>
                    </View>
                )}
            </ScrollView>

            {/* Wait time modal */}
            <Modal visible={!!waitModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Set Wait Time</Text>
                        <View style={styles.waitInputRow}>
                            <TextInput
                                style={styles.waitInput}
                                value={waitInput}
                                onChangeText={setWaitInput}
                                keyboardType="number-pad"
                                autoFocus
                            />
                            <Text style={styles.waitUnit}>minutes</Text>
                        </View>
                        <View style={styles.modalActions}>
                            <Pressable style={styles.modalCancel} onPress={() => setWaitModal(null)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.modalConfirm, { backgroundColor: primary }]} onPress={handleSetWait}>
                                <Text style={styles.modalConfirmText}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    scroll: { paddingBottom: 100 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
        paddingBottom: SPACING.m,
    },
    restaurantName: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
    greeting: { fontSize: 13, color: '#888', marginTop: 2 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    muteBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
    },
    logoutBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.l,
        gap: SPACING.s,
        marginBottom: SPACING.m,
    },
    statCard: { width: '48%' },
    tabsRow: {
        paddingHorizontal: SPACING.l,
        gap: SPACING.s,
        marginBottom: SPACING.m,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#E8E8E8',
    },
    tabText: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
    tabTextActive: { color: '#FFF' },
    orderCard: { marginHorizontal: SPACING.l, marginBottom: SPACING.m },
    actionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: RADIUS.s,
    },
    actionBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    emptyState: { alignItems: 'center', paddingTop: 40 },
    emptyText: { fontSize: 15, color: '#888' },
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    waitBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 8, paddingVertical: 6,
        backgroundColor: '#F0F0F0', borderRadius: 6,
    },
    waitBtnText: { fontSize: 11, fontWeight: '600', color: '#888' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
    modalBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '80%', gap: 16 },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
    waitInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    waitInput: {
        flex: 1, backgroundColor: '#F5F5F5', borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 10, fontSize: 24,
        fontWeight: '800', textAlign: 'center', color: '#1A1A1A',
    },
    waitUnit: { fontSize: 16, color: '#888' },
    modalActions: { flexDirection: 'row', gap: 10 },
    modalCancel: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#F0F0F0', alignItems: 'center' },
    modalCancelText: { fontSize: 14, fontWeight: '600', color: '#888' },
    modalConfirm: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    modalConfirmText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
