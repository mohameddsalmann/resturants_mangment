import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { getOrders } from '@/services/mockData';
import { useOrderStore } from '@/store/orderStore';
import { Order, OrderStatus } from '@/types';
import { createAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { AlertCircle, Clock, LogOut, Volume2, VolumeX } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type FilterTab = 'all' | 'new' | 'preparing' | 'ready';

const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
];

const STATUS_COLOR: Record<string, string> = {
    new: '#FF6B6B',
    preparing: '#FFB84D',
    ready: '#51CF66',
};

function elapsedMinutes(dateStr: string): number {
    return Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
}

function nextStatus(s: OrderStatus): OrderStatus | null {
    if (s === 'new') return 'preparing';
    if (s === 'preparing') return 'ready';
    if (s === 'ready') return 'served';
    return null;
}

function actionLabel(s: OrderStatus): string | null {
    if (s === 'new') return 'Start Preparing';
    if (s === 'preparing') return 'Mark Ready';
    if (s === 'ready') return 'Mark Served';
    return null;
}

export default function KitchenDisplayScreen() {
    const router = useRouter();
    const { orders: storeOrders, updateOrderStatus } = useOrderStore();
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [tick, setTick] = useState(0);
    const [muted, setMuted] = useState(false);
    const lastOrderCount = useRef(0);

    // Tick every 30s to refresh elapsed timers
    useEffect(() => {
        const t = setInterval(() => setTick((n) => n + 1), 30000);
        return () => clearInterval(t);
    }, []);

    // Alert on new orders
    useEffect(() => {
        const newCount = storeOrders.filter((o) => o.status === 'new').length;
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

    // Merge store + mock orders for both restaurants
    const mockOrders = [...getOrders('rest_1'), ...getOrders('rest_2')];
    const allOrders: Order[] = [
        ...storeOrders,
        ...mockOrders.filter((m) => !storeOrders.some((s) => s.id === m.id)),
    ].filter((o) => o.status !== 'served' && o.status !== 'paid');

    const filtered = allOrders.filter((o) =>
        activeTab === 'all' ? true : o.status === activeTab
    );

    const counts: Record<FilterTab, number> = {
        all: allOrders.length,
        new: allOrders.filter((o) => o.status === 'new').length,
        preparing: allOrders.filter((o) => o.status === 'preparing').length,
        ready: allOrders.filter((o) => o.status === 'ready').length,
    };

    const renderOrder = ({ item }: { item: Order }) => {
        const elapsed = elapsedMinutes(item.createdAt);
        const isOverdue = elapsed > 15;
        const next = nextStatus(item.status);
        const label = actionLabel(item.status);
        const statusColor = STATUS_COLOR[item.status] ?? '#888';

        return (
            <View style={[styles.card, isOverdue && styles.cardOverdue]}>
                {/* Card header */}
                <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                        <Text style={styles.tableNum}>Table {item.tableNumber}</Text>
                        <Text style={styles.customerName}>{item.customerName}</Text>
                    </View>
                    <View style={styles.cardHeaderRight}>
                        <View style={[styles.statusPill, { backgroundColor: statusColor + '20' }]}>
                            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                            <Text style={[styles.statusText, { color: statusColor }]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Timer */}
                <View style={[styles.timerRow, isOverdue && styles.timerRowOverdue]}>
                    {isOverdue
                        ? <AlertCircle size={14} color="#FF6B6B" />
                        : <Clock size={14} color="#888" />
                    }
                    <Text style={[styles.timerText, isOverdue && styles.timerTextOverdue]}>
                        {elapsed < 1 ? 'Just now' : `${elapsed}m ago`}
                        {isOverdue ? ' — OVERDUE' : ''}
                    </Text>
                </View>

                {/* Items */}
                <View style={styles.itemsList}>
                    {item.items.map((oi, idx) => (
                        <View key={idx} style={styles.orderItemRow}>
                            <Text style={styles.orderItemQty}>{oi.quantity}×</Text>
                            <View style={styles.orderItemInfo}>
                                <Text style={styles.orderItemName}>{oi.name}</Text>
                                {oi.specialInstructions ? (
                                    <Text style={styles.orderItemNote}>
                                        ⚠ {oi.specialInstructions}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Action button */}
                {label && next && (
                    <Pressable
                        style={[styles.actionBtn, { backgroundColor: statusColor }]}
                        onPress={() => updateOrderStatus(item.id, next)}
                    >
                        <Text style={styles.actionBtnText}>{label}</Text>
                    </Pressable>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kitchen Display</Text>
                <View style={styles.headerActions}>
                    <Pressable style={styles.muteBtn} onPress={() => setMuted((m) => !m)}>
                        {muted
                            ? <VolumeX size={16} color="#888" />
                            : <Volume2 size={16} color={COLORS.primary} />
                        }
                    </Pressable>
                    <Pressable style={styles.logoutBtn} onPress={() => router.replace('/(kitchen)/login' as any)}>
                        <LogOut size={18} color="#FF6B6B" />
                    </Pressable>
                </View>
            </View>

            {/* Filter tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsRow}
            >
                {TABS.map((tab) => (
                    <Pressable
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && {
                                backgroundColor: STATUS_COLOR[tab.key] ?? COLORS.primary,
                            },
                        ]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                        {counts[tab.key] > 0 && (
                            <View style={[
                                styles.tabBadge,
                                activeTab === tab.key && styles.tabBadgeActive,
                            ]}>
                                <Text style={[
                                    styles.tabBadgeText,
                                    activeTab === tab.key && styles.tabBadgeTextActive,
                                ]}>
                                    {counts[tab.key]}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                ))}
            </ScrollView>

            {/* Orders */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={renderOrder}
                extraData={tick}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>Queue is clear</Text>
                        <Text style={styles.emptySubtitle}>No active orders</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A2E' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
        paddingBottom: SPACING.s,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    muteBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    logoutBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,107,107,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
    tabsRow: {
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.m,
        gap: SPACING.s,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: SPACING.m,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    tabText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
    tabTextActive: { color: '#FFF' },
    tabBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        minWidth: 18, height: 18,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 4,
    },
    tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.35)' },
    tabBadgeText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
    tabBadgeTextActive: { color: '#FFF' },
    list: { paddingHorizontal: SPACING.l, paddingBottom: 100, gap: SPACING.m },
    card: {
        backgroundColor: '#16213E',
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: SPACING.s,
    },
    cardOverdue: { borderColor: '#FF6B6B', borderWidth: 1.5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardHeaderLeft: { gap: 2 },
    tableNum: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
    customerName: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
    cardHeaderRight: {},
    statusPill: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
    timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timerRowOverdue: {},
    timerText: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
    timerTextOverdue: { color: '#FF6B6B', fontWeight: '600' },
    itemsList: { gap: 6, paddingVertical: 4 },
    orderItemRow: { flexDirection: 'row', gap: 8 },
    orderItemQty: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.5)', width: 28 },
    orderItemInfo: { flex: 1 },
    orderItemName: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
    orderItemNote: { fontSize: 12, color: '#FFB84D', marginTop: 2 },
    actionBtn: {
        paddingVertical: 12, borderRadius: RADIUS.m,
        alignItems: 'center', marginTop: 4,
    },
    actionBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
    empty: { alignItems: 'center', paddingTop: 80, gap: SPACING.s },
    emptyTitle: { fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
    emptySubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.3)' },
});
