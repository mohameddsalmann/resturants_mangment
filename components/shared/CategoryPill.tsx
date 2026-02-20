import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { Category, ThemeColors } from '@/types';

interface Props {
    categories: Category[];
    activeId: string | null;
    onSelect: (id: string | null) => void;
    theme: ThemeColors;
}

export function CategoryPills({ categories, activeId, onSelect, theme }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
        >
            <Pressable
                style={[styles.pill, !activeId && { backgroundColor: theme.primary }]}
                onPress={() => onSelect(null)}
            >
                <Text style={[styles.pillText, !activeId && { color: theme.textOnPrimary }]}>All</Text>
            </Pressable>
            {categories.map((cat) => {
                const active = activeId === cat.id;
                return (
                    <Pressable
                        key={cat.id}
                        style={[styles.pill, active && { backgroundColor: theme.primary }]}
                        onPress={() => onSelect(cat.id)}
                    >
                        <Text style={styles.pillIcon}>{cat.icon}</Text>
                        <Text style={[styles.pillText, active && { color: theme.textOnPrimary }]}>{cat.name}</Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        gap: SPACING.s,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        backgroundColor: '#F0F0F0',
    },
    pillIcon: { fontSize: 14 },
    pillText: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
});
