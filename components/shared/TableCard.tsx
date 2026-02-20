import { RADIUS, SPACING, STATUS_COLORS } from '@/constants/theme';
import { Table } from '@/types';
import { Users } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
    table: Table;
    isSelected?: boolean;
    onPress: (table: Table) => void;
    style?: ViewStyle;
}

const BG: Record<Table['status'], string> = {
    available: '#F0FFF4',
    occupied: '#FFF5F5',
    reserved: '#FFFBF0',
};

const BORDER: Record<Table['status'], string> = {
    available: '#C6F6D5',
    occupied: '#FED7D7',
    reserved: '#FEEBC8',
};

export function TableCard({ table, isSelected, onPress, style }: Props) {
    return (
        <Pressable
            style={[
                styles.card,
                { backgroundColor: BG[table.status], borderColor: BORDER[table.status] },
                isSelected && styles.selected,
                style,
            ]}
            onPress={() => onPress(table)}
        >
            <Text style={styles.number}>T{table.number}</Text>
            <View style={styles.capRow}>
                <Users size={12} color="#888" />
                <Text style={styles.capText}>{table.capacity}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[table.status] }]} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        minHeight: 90,
    },
    selected: {
        borderWidth: 2.5,
        borderColor: '#339AF0',
        shadowColor: '#339AF0',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        boxShadow: '0px 4px 8px rgba(51, 154, 240, 0.2)',
        elevation: 4,
    },
    number: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
    capRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    capText: { fontSize: 11, color: '#888' },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 2 },
});
