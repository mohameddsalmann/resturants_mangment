import { RADIUS, SPACING } from '@/constants/theme';
import { getRestaurant } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Category, MenuItem } from '@/types';
import { ArrowLeft, ChevronRight, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

type ScreenView = 'categories' | 'items';

export default function MenuManageScreen() {
    const { user } = useAuthStore();
    const {
        categories, menuItems,
        loadRestaurant, toggleItemAvailability, deleteMenuItem,
    } = useRestaurantStore();
    const [view, setView] = useState<ScreenView>('categories');
    const [selectedCat, setSelectedCat] = useState<Category | null>(null);

    const restaurantId = user?.restaurantId ?? 'rest_1';
    const res = getRestaurant(restaurantId);
    const primary = res?.theme.primary ?? '#FF4B3A';

    useEffect(() => {
        loadRestaurant(restaurantId);
    }, [restaurantId]);

    const catItems = selectedCat
        ? menuItems.filter((i) => i.categoryId === selectedCat.id)
        : [];

    const handleDeleteItem = (item: MenuItem) => {
        Alert.alert('Delete Item', `Remove "${item.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMenuItem(item.id) },
        ]);
    };

    if (view === 'items' && selectedCat) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Pressable style={styles.backBtn} onPress={() => setView('categories')}>
                        <ArrowLeft size={20} color="#1A1A1A" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{selectedCat.name}</Text>
                    <View style={{ width: 36 }} />
                </View>

                <FlatList
                    data={catItems}
                    keyExtractor={(i) => i.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>No items in this category</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                            </View>
                            <View style={styles.itemActions}>
                                <Switch
                                    value={item.isAvailable}
                                    onValueChange={() => toggleItemAvailability(item.id)}
                                    trackColor={{ true: primary + '60', false: '#E0E0E0' }}
                                    thumbColor={item.isAvailable ? primary : '#888'}
                                />
                                <Pressable
                                    style={styles.deleteBtn}
                                    onPress={() => handleDeleteItem(item)}
                                >
                                    <Trash2 size={16} color="#FF6B6B" />
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ width: 36 }} />
                <Text style={styles.headerTitle}>Menu</Text>
                <View style={{ width: 36 }} />
            </View>

            <FlatList
                data={categories}
                keyExtractor={(c) => c.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No categories yet</Text>
                    </View>
                }
                renderItem={({ item: cat }) => {
                    const count = menuItems.filter((i) => i.categoryId === cat.id).length;
                    const availCount = menuItems.filter(
                        (i) => i.categoryId === cat.id && i.isAvailable
                    ).length;
                    return (
                        <Pressable
                            style={styles.catRow}
                            onPress={() => {
                                setSelectedCat(cat);
                                setView('items');
                            }}
                        >
                            <Text style={styles.catIcon}>{cat.icon}</Text>
                            <View style={styles.catInfo}>
                                <Text style={styles.catName}>{cat.name}</Text>
                                <Text style={styles.catSub}>
                                    {count} items • {availCount} available
                                </Text>
                            </View>
                            <ChevronRight size={18} color="#BBB" />
                        </Pressable>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
    },
    list: { padding: SPACING.m, gap: SPACING.s },
    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        gap: SPACING.m,
    },
    catIcon: { fontSize: 28 },
    catInfo: { flex: 1 },
    catName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
    catSub: { fontSize: 12, color: '#888', marginTop: 2 },
    itemRow: {
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
    itemPrice: { fontSize: 13, color: '#888', marginTop: 2 },
    itemActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.s },
    deleteBtn: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center',
    },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { fontSize: 15, color: '#888' },
});
