import { RADIUS, SPACING } from '@/constants/theme';
import { useSession } from '@/context/SessionContext';
import { useTheme } from '@/context/ThemeContext';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { CartItem } from '@/types';
import { useRouter } from 'expo-router';
import { ArrowLeft, Minus, Plus, Tag, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function GuestCartScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { session } = useSession();
    const {
        items, subtotal, discount, tax, total, itemCount,
        updateQuantity, removeItem, setSpecialInstructions, clearCart,
        applyPromoCode, removePromoCode,
        appliedPromo, promoError,
        restaurantId, taxRate,
    } = useCartStore();
    const { placeOrder } = useOrderStore();
    const [promoInput, setPromoInput] = useState('');

    const handleApplyPromo = () => {
        if (!promoInput.trim()) return;
        const ok = applyPromoCode(promoInput);
        if (ok) setPromoInput('');
    };

    const handlePlaceOrder = () => {
        if (!session || !restaurantId) return;
        const order = placeOrder({
            restaurantId,
            tableId: `${restaurantId}_t${session.tableNumber}`,
            tableNumber: session.tableNumber,
            customerName: session.customerName,
            items,
            taxRate,
        });
        clearCart();
        Alert.alert('Order Placed!', `Order #${order.id.slice(-4)} has been sent to the kitchen.`, [
            { text: 'Track Order', onPress: () => router.push('/(guest)/tracking') },
        ]);
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.menuItem.name}</Text>
                <Text style={[styles.itemPrice, { color: theme.primary }]}>
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                </Text>
            </View>
            <View style={styles.qtyRow}>
                <Pressable
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                >
                    <Minus size={14} color="#666" />
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <Pressable
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                >
                    <Plus size={14} color="#666" />
                </Pressable>
                <Pressable
                    style={styles.removeBtn}
                    onPress={() => removeItem(item.menuItem.id)}
                >
                    <Trash2 size={14} color="#FF6B6B" />
                </Pressable>
            </View>
            <TextInput
                style={styles.notesInput}
                placeholder="Special instructions..."
                placeholderTextColor="#BBB"
                value={item.specialInstructions ?? ''}
                onChangeText={(text) => setSpecialInstructions(item.menuItem.id, text)}
            />
        </View>
    );

    const count = itemCount();

    if (count === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={20} color={theme.text} />
                    </Pressable>
                    <Text style={[styles.title, { color: theme.text }]}>Cart</Text>
                </View>
                <View style={styles.empty}>
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add items from the menu</Text>
                    <Pressable
                        style={[styles.browseBtn, { backgroundColor: theme.primary }]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.browseBtnText, { color: theme.textOnPrimary }]}>Browse Menu</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={theme.text} />
                </Pressable>
                <Text style={[styles.title, { color: theme.text }]}>Cart ({count})</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.menuItem.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {/* Summary */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Table</Text>
                    <Text style={styles.summaryValue}>#{session?.tableNumber}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Name</Text>
                    <Text style={styles.summaryValue}>{session?.customerName}</Text>
                </View>
                {/* Promo code input */}
                <View style={styles.promoRow}>
                    <Tag size={16} color={appliedPromo ? '#51CF66' : '#888'} />
                    {appliedPromo ? (
                        <View style={styles.appliedPromo}>
                            <Text style={styles.appliedPromoText}>{appliedPromo.code} — {appliedPromo.discountPercent}% off</Text>
                            <Pressable onPress={removePromoCode}>
                                <X size={14} color='#FF6B6B' />
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            <TextInput
                                style={styles.promoInput}
                                value={promoInput}
                                onChangeText={setPromoInput}
                                placeholder="Promo code"
                                placeholderTextColor="#BBB"
                                autoCapitalize="characters"
                            />
                            <Pressable
                                style={[styles.promoApplyBtn, { backgroundColor: theme.primary }]}
                                onPress={handleApplyPromo}
                            >
                                <Text style={[styles.promoApplyText, { color: theme.textOnPrimary }]}>Apply</Text>
                            </Pressable>
                        </>
                    )}
                </View>
                {promoError ? <Text style={styles.promoError}>{promoError}</Text> : null}

                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>${subtotal().toFixed(2)}</Text>
                </View>
                {discount() > 0 && (
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: '#51CF66' }]}>Discount ({appliedPromo?.discountPercent}%)</Text>
                        <Text style={[styles.summaryValue, { color: '#51CF66' }]}>-${discount().toFixed(2)}</Text>
                    </View>
                )}
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>${tax().toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={[styles.totalValue, { color: theme.primary }]}>${total().toFixed(2)}</Text>
                </View>

                <Pressable
                    style={[styles.placeBtn, { backgroundColor: theme.primary }]}
                    onPress={handlePlaceOrder}
                >
                    <Text style={[styles.placeBtnText, { color: theme.textOnPrimary }]}>Place Order</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        gap: SPACING.m,
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
    },
    title: { fontSize: 22, fontWeight: '700' },
    list: { paddingHorizontal: SPACING.m, gap: SPACING.m, paddingBottom: SPACING.m },
    cartItem: {
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        gap: 8,
    },
    itemInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', flex: 1, marginRight: 8 },
    itemPrice: { fontSize: 15, fontWeight: '700' },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    qtyBtn: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
    },
    qtyText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', minWidth: 20, textAlign: 'center' },
    removeBtn: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center',
        marginLeft: 'auto',
    },
    notesInput: {
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
        color: '#1A1A1A',
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: RADIUS.l,
        borderTopRightRadius: RADIUS.l,
        padding: SPACING.l,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.08)',
        elevation: 8,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { fontSize: 14, color: '#888' },
    summaryValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    totalValue: { fontSize: 18, fontWeight: '800' },
    placeBtn: {
        borderRadius: RADIUS.m,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    placeBtnText: { fontSize: 16, fontWeight: '700' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.m },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
    emptySubtitle: { fontSize: 14, color: '#888' },
    browseBtn: {
        paddingHorizontal: SPACING.l,
        paddingVertical: 12,
        borderRadius: RADIUS.m,
    },
    browseBtnText: { fontSize: 14, fontWeight: '700' },
    promoRow: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingVertical: 6,
    },
    appliedPromo: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0FFF4', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 6,
    },
    appliedPromoText: { fontSize: 13, fontWeight: '700', color: '#51CF66' },
    promoInput: {
        flex: 1, backgroundColor: '#F8F8F8', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 8,
        fontSize: 13, color: '#1A1A1A',
        borderWidth: 1, borderColor: '#E5E5E5',
        letterSpacing: 1,
    },
    promoApplyBtn: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    },
    promoApplyText: { fontSize: 13, fontWeight: '700' },
    promoError: { fontSize: 12, color: '#FF6B6B', marginLeft: 24 },
});
