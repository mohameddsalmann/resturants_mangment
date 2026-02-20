import { StatusBadge } from '@/components/shared/StatusBadge';
import { TableCard } from '@/components/shared/TableCard';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { getOrders, getRestaurant } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Order, Table } from '@/types';
import * as Sharing from 'expo-sharing';
import { Download, Printer, Share, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

export default function OwnerTablesScreen() {
    const { user } = useAuthStore();
    const { tables, loadRestaurant } = useRestaurantStore();
    const { orders: storeOrders } = useOrderStore();
    const [selected, setSelected] = useState<Table | null>(null);
    const [showQR, setShowQR] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [sharingBatch, setSharingBatch] = useState(false);
    const qrRef = useRef<ViewShot>(null);
    const batchRef = useRef<ViewShot>(null);

    const handleDownloadAll = async () => {
        if (!batchRef.current) return;
        setSharingBatch(true);
        try {
            const uri = await batchRef.current.capture?.();
            if (!uri) throw new Error();
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: `${res?.name ?? 'Restaurant'} — All Table QR Codes`,
                });
            } else {
                Alert.alert('Captured', 'QR sheet captured. Sharing not available on this device.');
            }
        } catch {
            Alert.alert('Error', 'Could not capture QR sheet.');
        } finally {
            setSharingBatch(false);
        }
    };

    const handleDownloadQR = async () => {
        if (!qrRef.current) return;
        try {
            const uri = await qrRef.current.capture?.();
            if (!uri) return;
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: `Table ${selected?.number} QR Code` });
            } else {
                Alert.alert('Saved', 'QR code captured. Sharing is not available on this device.');
            }
        } catch {
            Alert.alert('Error', 'Could not capture QR code.');
        }
    };

    const restaurantId = user?.restaurantId ?? 'rest_1';
    const res = getRestaurant(restaurantId);
    const primary = res?.theme.primary ?? '#FF4B3A';

    useEffect(() => {
        loadRestaurant(restaurantId);
    }, [restaurantId]);

    const allOrders: Order[] = [
        ...storeOrders.filter((o) => o.restaurantId === restaurantId),
        ...getOrders(restaurantId),
    ];

    const getActiveOrder = (table: Table) =>
        table.activeOrderId
            ? allOrders.find((o) => o.id === table.activeOrderId)
            : undefined;

    const available = tables.filter((t) => t.status === 'available').length;
    const occupied = tables.filter((t) => t.status === 'occupied').length;
    const reserved = tables.filter((t) => t.status === 'reserved').length;

    const activeOrder = selected ? getActiveOrder(selected) : null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tables</Text>
                <Pressable
                    style={[styles.downloadAllBtn, { backgroundColor: primary + '18' }]}
                    onPress={() => setShowBatchModal(true)}
                >
                    <Printer size={14} color={primary} />
                    <Text style={[styles.downloadAllText, { color: primary }]}>Print All QR</Text>
                </Pressable>
            </View>

            {/* Batch QR Modal */}
            <Modal visible={showBatchModal} animationType="slide" onRequestClose={() => setShowBatchModal(false)}>
                <SafeAreaView style={styles.batchContainer}>
                    <View style={styles.batchHeader}>
                        <Text style={styles.batchTitle}>All Table QR Codes</Text>
                        <Pressable onPress={() => setShowBatchModal(false)}>
                            <X size={22} color="#1A1A1A" />
                        </Pressable>
                    </View>
                    <ScrollView contentContainerStyle={styles.batchScroll} showsVerticalScrollIndicator={false}>
                        <ViewShot ref={batchRef} options={{ format: 'png', quality: 1 }} style={styles.batchSheet}>
                            <Text style={styles.batchSheetTitle}>{res?.name ?? 'Restaurant'}</Text>
                            <Text style={styles.batchSheetSubtitle}>Scan to place your order</Text>
                            <View style={styles.batchGrid}>
                                {tables.map((table) => (
                                    <View key={table.id} style={styles.batchCard}>
                                        <QRCode
                                            value={table.qrCodeData}
                                            size={90}
                                            color="#1A1A1A"
                                            backgroundColor="#FFFFFF"
                                        />
                                        <Text style={styles.batchCardTable}>Table {table.number}</Text>
                                        <Text style={styles.batchCardSeats}>{table.capacity} seats</Text>
                                    </View>
                                ))}
                            </View>
                        </ViewShot>
                    </ScrollView>
                    <Pressable
                        style={[styles.shareAllBtn, { backgroundColor: primary }, sharingBatch && { opacity: 0.6 }]}
                        onPress={handleDownloadAll}
                        disabled={sharingBatch}
                    >
                        <Download size={16} color="#FFF" />
                        <Text style={styles.shareAllText}>{sharingBatch ? 'Capturing…' : 'Download / Share Sheet'}</Text>
                    </Pressable>
                </SafeAreaView>
            </Modal>

            {/* Summary pills */}
            <View style={styles.summaryRow}>
                <View style={[styles.pill, { backgroundColor: '#F0FFF4' }]}>
                    <Text style={[styles.pillText, { color: '#276749' }]}>{available} Available</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: '#FFF5F5' }]}>
                    <Text style={[styles.pillText, { color: '#9B2C2C' }]}>{occupied} Occupied</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: '#FFFBF0' }]}>
                    <Text style={[styles.pillText, { color: '#7B341E' }]}>{reserved} Reserved</Text>
                </View>
            </View>

            {/* Selected table detail panel */}
            {selected && (
                <View style={styles.detailPanel}>
                    <View style={styles.detailHeader}>
                        <Text style={styles.detailTitle}>Table {selected.number}</Text>
                        <View style={styles.detailHeaderRight}>
                            {!showQR && (
                                <Pressable
                                    style={[styles.qrBtn, { backgroundColor: primary + '15' }]}
                                    onPress={() => setShowQR(true)}
                                >
                                    <Text style={[styles.qrBtnText, { color: primary }]}>Show QR</Text>
                                </Pressable>
                            )}
                            <Pressable onPress={() => { setSelected(null); setShowQR(false); }}>
                                <X size={20} color="#888" />
                            </Pressable>
                        </View>
                    </View>

                    {showQR ? (
                        <View style={styles.qrContainer}>
                            <ViewShot ref={qrRef} options={{ format: 'png', quality: 1 }} style={styles.qrCapture}>
                                <Text style={styles.qrRestName}>{res?.name ?? 'Restaurant'}</Text>
                                <QRCode
                                    value={selected.qrCodeData}
                                    size={160}
                                    color="#1A1A1A"
                                    backgroundColor="#FFFFFF"
                                />
                                <Text style={styles.qrTableNumLabel}>Table {selected.number}</Text>
                            </ViewShot>
                            <Text style={styles.qrLabel} numberOfLines={1}>{selected.qrCodeData}</Text>
                            <View style={styles.qrActions}>
                                <Pressable style={[styles.qrActionBtn, { backgroundColor: primary }]} onPress={handleDownloadQR}>
                                    <Share size={14} color="#FFF" />
                                    <Text style={styles.qrActionText}>Download / Share</Text>
                                </Pressable>
                                <Pressable onPress={() => setShowQR(false)}>
                                    <Text style={styles.qrClose}>Hide</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Status</Text>
                                <StatusBadge status={selected.status} />
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Capacity</Text>
                                <Text style={styles.detailValue}>{selected.capacity} guests</Text>
                            </View>
                            {activeOrder ? (
                                <View style={styles.orderPreview}>
                                    <Text style={styles.orderPreviewTitle}>
                                        Active Order — {activeOrder.customerName}
                                    </Text>
                                    {activeOrder.items.map((item, i) => (
                                        <Text key={i} style={styles.orderPreviewItem}>
                                            {item.quantity}× {item.name}
                                        </Text>
                                    ))}
                                    <Text style={[styles.orderPreviewTotal, { color: primary }]}>
                                        Total: ${activeOrder.total.toFixed(2)}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.noOrder}>
                                    {selected.status === 'available' ? 'Table is free' : 'Reserved — no active order'}
                                </Text>
                            )}
                        </>
                    )}
                </View>
            )}

            {/* Table grid */}
            <FlatList
                data={tables}
                keyExtractor={(t) => t.id}
                numColumns={3}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.gridRow}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TableCard
                        table={item}
                        isSelected={selected?.id === item.id}
                        onPress={(t) => {
                            setShowQR(false);
                            setSelected(selected?.id === t.id ? null : t);
                        }}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
        paddingBottom: SPACING.s,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.l,
        gap: SPACING.s,
        marginBottom: SPACING.m,
    },
    pill: { paddingHorizontal: SPACING.m, paddingVertical: 6, borderRadius: 999 },
    pillText: { fontSize: 12, fontWeight: '600' },
    detailPanel: {
        backgroundColor: '#FFF',
        marginHorizontal: SPACING.l,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.medium,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    detailTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
    detailHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.s },
    qrBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
    qrBtnText: { fontSize: 12, fontWeight: '700' },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailLabel: { fontSize: 14, color: '#888' },
    detailValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
    orderPreview: {
        marginTop: SPACING.m,
        backgroundColor: '#F8F8F8',
        borderRadius: RADIUS.s,
        padding: SPACING.m,
        gap: 4,
    },
    orderPreviewTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
    orderPreviewItem: { fontSize: 12, color: '#888' },
    orderPreviewTotal: { fontSize: 14, fontWeight: '700', marginTop: 4 },
    noOrder: { fontSize: 13, color: '#888', marginTop: SPACING.m, textAlign: 'center' },
    qrContainer: { alignItems: 'center', gap: SPACING.s, paddingVertical: SPACING.m },
    qrCapture: { alignItems: 'center', backgroundColor: '#FFF', padding: SPACING.m, borderRadius: RADIUS.m, gap: 6 },
    qrRestName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
    qrTableNumLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
    qrLabel: { fontSize: 10, color: '#888', textAlign: 'center', maxWidth: 240 },
    qrActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.m },
    qrActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
    qrActionText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
    qrClose: { fontSize: 13, color: '#339AF0', fontWeight: '600' },
    grid: { paddingHorizontal: SPACING.l, paddingBottom: 100 },
    gridRow: { gap: SPACING.s, marginBottom: SPACING.s },
    downloadAllBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
    },
    downloadAllText: { fontSize: 12, fontWeight: '700' },
    batchContainer: { flex: 1, backgroundColor: '#F5F5F5' },
    batchHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: SPACING.l, paddingVertical: SPACING.m,
        backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    batchTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
    batchScroll: { padding: SPACING.l, paddingBottom: 120 },
    batchSheet: {
        backgroundColor: '#FFF', borderRadius: RADIUS.l, padding: SPACING.l,
        alignItems: 'center',
    },
    batchSheetTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
    batchSheetSubtitle: { fontSize: 13, color: '#888', marginBottom: SPACING.l },
    batchGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.m, justifyContent: 'center',
    },
    batchCard: {
        alignItems: 'center', backgroundColor: '#F8F8F8',
        borderRadius: RADIUS.m, padding: SPACING.m, gap: 4,
        width: 130,
    },
    batchCardTable: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
    batchCardSeats: { fontSize: 11, color: '#888' },
    shareAllBtn: {
        position: 'absolute', bottom: 24, left: SPACING.l, right: SPACING.l,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, paddingVertical: 16, borderRadius: RADIUS.m,
    },
    shareAllText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
