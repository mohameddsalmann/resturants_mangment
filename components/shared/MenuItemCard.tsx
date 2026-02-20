import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { MenuItem, ThemeColors } from '@/types';

interface Props {
    item: MenuItem;
    theme: ThemeColors;
    onAddToCart: (item: MenuItem) => void;
    style?: ViewStyle;
}

export function MenuItemCard({ item, theme, onAddToCart, style }: Props) {
    const unavailable = !item.isAvailable;

    return (
        <View style={[styles.card, unavailable && styles.cardUnavailable, style]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            {unavailable && (
                <View style={styles.unavailableOverlay}>
                    <Text style={styles.unavailableText}>Unavailable</Text>
                </View>
            )}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.price, { color: theme.primary }]}>${item.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                {item.dietaryTags.length > 0 && (
                    <View style={styles.tagsRow}>
                        {item.dietaryTags.map((tag) => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {!unavailable && (
                    <Pressable
                        style={[styles.addBtn, { backgroundColor: theme.primary }]}
                        onPress={() => onAddToCart(item)}
                    >
                        <Plus size={16} color={theme.textOnPrimary} />
                        <Text style={[styles.addBtnText, { color: theme.textOnPrimary }]}>Add</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.m,
        overflow: 'hidden',
        ...SHADOWS.small,
    },
    cardUnavailable: { opacity: 0.5 },
    image: { width: '100%', height: 140 },
    unavailableOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unavailableText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    content: { padding: SPACING.m, gap: 6 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', flex: 1, marginRight: 8 },
    price: { fontSize: 16, fontWeight: '800' },
    description: { fontSize: 13, color: '#888', lineHeight: 18 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    tag: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
    },
    tagText: { fontSize: 10, color: '#666', textTransform: 'capitalize' },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 8,
        borderRadius: RADIUS.s,
        marginTop: 4,
    },
    addBtnText: { fontSize: 13, fontWeight: '700' },
});
