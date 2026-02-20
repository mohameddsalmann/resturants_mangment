import React, { useState, useEffect } from 'react';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Search, ShoppingCart, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from '@/context/SessionContext';
import { useCartStore } from '@/store/cartStore';
import { getMenu } from '@/services/mockData';
import { Category, MenuItem } from '@/types';
import { CategoryPills } from '@/components/shared/CategoryPill';
import { MenuItemCard } from '@/components/shared/MenuItemCard';

export default function GuestMenuScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { session } = useSession();
    const { addItem, itemCount } = useCartStore();

    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [activeCat, setActiveCat] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (session?.restaurantId) {
            const menu = getMenu(session.restaurantId);
            setCategories(menu.categories);
            setItems(menu.items);
        }
    }, [session?.restaurantId]);

    const filtered = items.filter((item) => {
        const matchCat = !activeCat || item.categoryId === activeCat;
        const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const count = itemCount();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                        Table {session?.tableNumber} • {session?.customerName}
                    </Text>
                    <Text style={[styles.title, { color: theme.text }]}>Menu</Text>
                </View>
                <Pressable
                    style={[styles.cartBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push('/(guest)/cart')}
                >
                    <ShoppingCart size={20} color={theme.textOnPrimary} />
                    {count > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{count}</Text>
                        </View>
                    )}
                </Pressable>
            </View>

            {/* Search */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#888" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search menu..."
                        placeholderTextColor="#AAA"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <Pressable onPress={() => setSearch('')}>
                            <X size={16} color="#888" />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Categories */}
            <CategoryPills
                categories={categories}
                activeId={activeCat}
                onSelect={setActiveCat}
                theme={theme}
            />

            {/* Items */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <MenuItemCard
                        item={item}
                        theme={theme}
                        onAddToCart={(mi) => addItem(mi)}
                        style={styles.itemCard}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No items found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingTop: SPACING.m,
        paddingBottom: SPACING.s,
    },
    greeting: { fontSize: 13 },
    title: { fontSize: 28, fontWeight: '800' },
    cartBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
    searchRow: { paddingHorizontal: SPACING.m },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        paddingHorizontal: SPACING.m,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
    list: { paddingHorizontal: SPACING.m, paddingBottom: 100, gap: SPACING.m },
    itemCard: {},
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { fontSize: 16, color: '#888' },
});
