import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { getOrders, getRestaurant, getMenu } from '@/services/mockData';

const CHART_W = 320;
const CHART_H = 140;
const BAR_GAP = 8;

function BarChart({
    data,
    labels,
    color,
    maxVal,
}: {
    data: number[];
    labels: string[];
    color: string;
    maxVal: number;
}) {
    const n = data.length;
    const barW = (CHART_W - (n + 1) * BAR_GAP) / n;

    return (
        <Svg width={CHART_W} height={CHART_H + 24}>
            {/* Baseline */}
            <Line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke="#E5E5E5" strokeWidth={1} />
            {data.map((val, i) => {
                const barH = maxVal > 0 ? (val / maxVal) * (CHART_H - 16) : 0;
                const x = BAR_GAP + i * (barW + BAR_GAP);
                const y = CHART_H - barH;
                return (
                    <React.Fragment key={i}>
                        <Rect
                            x={x}
                            y={y}
                            width={barW}
                            height={barH}
                            rx={4}
                            fill={color}
                            opacity={0.85}
                        />
                        <SvgText
                            x={x + barW / 2}
                            y={CHART_H + 16}
                            fontSize={9}
                            fill="#888"
                            textAnchor="middle"
                        >
                            {labels[i]}
                        </SvgText>
                        {barH > 12 && (
                            <SvgText
                                x={x + barW / 2}
                                y={y - 3}
                                fontSize={8}
                                fill={color}
                                textAnchor="middle"
                            >
                                {val > 0 ? (val < 100 ? val.toFixed(0) : `$${Math.round(val)}`) : ''}
                            </SvgText>
                        )}
                    </React.Fragment>
                );
            })}
        </Svg>
    );
}

export default function AnalyticsScreen() {
    const { user } = useAuthStore();
    const restaurantId = user?.restaurantId ?? 'rest_1';
    const res = getRestaurant(restaurantId);
    const primary = res?.theme.primary ?? '#FF4B3A';
    const orders = getOrders(restaurantId);
    const { items } = getMenu(restaurantId);

    // ── Daily revenue last 7 days (mock) ──
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyRevenue = [420, 385, 510, 630, 780, 920, 450];
    const maxRev = Math.max(...dailyRevenue);

    // ── Top 5 items by order count ──
    const itemCounts: Record<string, number> = {};
    orders.forEach((o) =>
        o.items.forEach((i) => {
            itemCounts[i.menuItemId] = (itemCounts[i.menuItemId] ?? 0) + i.quantity;
        })
    );
    const topItems = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({
            name: items.find((i) => i.id === id)?.name ?? id,
            count,
        }));
    const maxCount = Math.max(...topItems.map((i) => i.count), 1);

    // ── Orders by hour (mock) ──
    const hourLabels = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];
    const hourData = [2, 5, 14, 18, 12, 8, 6, 9, 16, 19, 11, 4];
    const maxHour = Math.max(...hourData);

    // ── Summary stats ──
    const totalRev = orders.reduce((s, o) => s + o.total, 0);
    const avgOrder = orders.length > 0 ? totalRev / orders.length : 0;
    const paidCount = orders.filter((o) => o.status === 'paid').length;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Analytics</Text>

                {/* Summary cards */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={[styles.summaryValue, { color: primary }]}>
                            ${totalRev.toFixed(0)}
                        </Text>
                        <Text style={styles.summaryLabel}>Total Revenue</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={[styles.summaryValue, { color: '#339AF0' }]}>
                            {orders.length}
                        </Text>
                        <Text style={styles.summaryLabel}>Total Orders</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={[styles.summaryValue, { color: '#51CF66' }]}>
                            ${avgOrder.toFixed(0)}
                        </Text>
                        <Text style={styles.summaryLabel}>Avg Order</Text>
                    </View>
                </View>

                {/* Daily Revenue */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Daily Revenue (Last 7 Days)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <BarChart
                            data={dailyRevenue}
                            labels={dayLabels}
                            color={primary}
                            maxVal={maxRev}
                        />
                    </ScrollView>
                </View>

                {/* Top Items */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Top Selling Items</Text>
                    {topItems.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <BarChart
                                data={topItems.map((i) => i.count)}
                                labels={topItems.map((i) => i.name.split(' ')[0])}
                                color="#339AF0"
                                maxVal={maxCount}
                            />
                        </ScrollView>
                    ) : (
                        <Text style={styles.noData}>No order data yet</Text>
                    )}
                    {topItems.map((item, idx) => (
                        <View key={idx} style={styles.itemRankRow}>
                            <View style={styles.rankBadge}>
                                <Text style={styles.rankText}>{idx + 1}</Text>
                            </View>
                            <Text style={styles.itemRankName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemRankCount}>{item.count} sold</Text>
                        </View>
                    ))}
                </View>

                {/* Peak Hours */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Orders by Hour</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <BarChart
                            data={hourData}
                            labels={hourLabels.map((h) => `${h}:00`)}
                            color="#FFB84D"
                            maxVal={maxHour}
                        />
                    </ScrollView>
                    <Text style={styles.peakNote}>
                        Peak: 19:00 — 21:00
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    scroll: { paddingBottom: 100 },
    pageTitle: {
        fontSize: 28, fontWeight: '800', color: '#1A1A1A',
        paddingHorizontal: SPACING.l, paddingTop: SPACING.m, paddingBottom: SPACING.m,
    },
    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.l,
        gap: SPACING.s,
        marginBottom: SPACING.m,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    summaryValue: { fontSize: 20, fontWeight: '800' },
    summaryLabel: { fontSize: 10, color: '#888', marginTop: 2 },
    chartCard: {
        backgroundColor: '#FFF',
        marginHorizontal: SPACING.l,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        ...SHADOWS.small,
    },
    chartTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: SPACING.m },
    noData: { fontSize: 13, color: '#888', paddingVertical: SPACING.m },
    itemRankRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: SPACING.s,
    },
    rankBadge: {
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: '#F0F0F0',
        alignItems: 'center', justifyContent: 'center',
    },
    rankText: { fontSize: 11, fontWeight: '700', color: '#888' },
    itemRankName: { flex: 1, fontSize: 13, color: '#1A1A1A' },
    itemRankCount: { fontSize: 12, color: '#888' },
    peakNote: { fontSize: 12, color: '#888', marginTop: SPACING.s },
});
