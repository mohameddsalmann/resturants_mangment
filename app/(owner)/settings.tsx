import { generateThemeFromColors, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { getRestaurant } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronRight, Clock, MapPin, Percent, Phone, Plus, Store, Trash2, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

function SectionHeader({ title }: { title: string }) {
    return <Text style={styles.sectionHeader}>{title}</Text>;
}

function RowItem({ icon, label, value, onPress }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onPress?: () => void;
}) {
    return (
        <Pressable style={styles.rowItem} onPress={onPress}>
            <View style={styles.rowLeft}>
                <View style={styles.rowIcon}>{icon}</View>
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            <View style={styles.rowRight}>
                {value ? <Text style={styles.rowValue} numberOfLines={1}>{value}</Text> : null}
                {onPress ? <ChevronRight size={16} color="#BBB" /> : null}
            </View>
        </Pressable>
    );
}

export default function SettingsScreen() {
    const { user, logout } = useAuthStore();
    const { loadRestaurant, updateRestaurant, staff, addStaff, removeStaff } = useRestaurantStore();

    const restaurantId = user?.restaurantId ?? 'rest_1';
    const res = getRestaurant(restaurantId);
    const primary = res?.theme.primary ?? '#FF4B3A';
    const kitchenStaff = staff.filter((s) => s.role === 'kitchen');

    // Theme editing state
    const [primaryColor, setPrimaryColor] = useState(primary);
    const [accentColor, setAccentColor] = useState(res?.theme.accent ?? '#FFA94D');
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [extracting, setExtracting] = useState(false);
    const [showThemeEdit, setShowThemeEdit] = useState(false);

    // Staff modal state
    const [showAddStaff, setShowAddStaff] = useState(false);
    const [newStaffName, setNewStaffName] = useState('');

    useEffect(() => {
        loadRestaurant(restaurantId);
    }, [restaurantId]);

    const pickLogo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images' as any,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setLogoUri(result.assets[0].uri);
        }
    };

    const applyTheme = () => {
        const theme = generateThemeFromColors(primaryColor, accentColor);
        updateRestaurant({ theme, ...(logoUri ? { logo: logoUri } : {}) });
        setShowThemeEdit(false);
        Alert.alert('Theme Updated', 'Your restaurant theme has been applied.');
    };

    const handleAddStaff = () => {
        if (!newStaffName.trim()) return;
        const s = addStaff(newStaffName.trim());
        setNewStaffName('');
        setShowAddStaff(false);
        Alert.alert('Staff Added', `${s.name} added\nPIN: ${s.pin}`);
    };

    const handleRemoveStaff = (id: string, name: string) => {
        Alert.alert('Remove Staff', `Remove ${name}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => removeStaff(id) },
        ]);
    };

    const previewTheme = generateThemeFromColors(primaryColor, accentColor);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Settings</Text>

                {/* Restaurant Info */}
                <SectionHeader title="Restaurant" />
                <View style={styles.card}>
                    <RowItem
                        icon={<Store size={18} color={primary} />}
                        label="Name"
                        value={res?.name}
                    />
                    <View style={styles.divider} />
                    <RowItem
                        icon={<MapPin size={18} color={primary} />}
                        label="Address"
                        value={res?.address}
                    />
                    <View style={styles.divider} />
                    <RowItem
                        icon={<Phone size={18} color={primary} />}
                        label="Phone"
                        value={res?.phone}
                    />
                    <View style={styles.divider} />
                    <RowItem
                        icon={<Clock size={18} color={primary} />}
                        label="Hours"
                        value={res?.operatingHours}
                    />
                    <View style={styles.divider} />
                    <RowItem
                        icon={<Percent size={18} color={primary} />}
                        label="Tax Rate"
                        value={`${((res?.taxRate ?? 0.1) * 100).toFixed(0)}%`}
                    />
                </View>

                {/* Logo & Theme */}
                <SectionHeader title="Logo & Theme" />
                <View style={styles.card}>
                    <Pressable style={styles.logoRow} onPress={pickLogo}>
                        {logoUri || res?.logo ? (
                            <Image source={{ uri: logoUri ?? res?.logo }} style={styles.logoThumb} />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Camera size={20} color="#BBB" />
                            </View>
                        )}
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>Restaurant Logo</Text>
                            <Text style={styles.rowValue}>
                                {extracting ? 'Extracting colors…' : 'Tap to change'}
                            </Text>
                        </View>
                        <ChevronRight size={16} color="#BBB" />
                    </Pressable>
                    <View style={styles.divider} />
                    <Pressable style={styles.rowItem} onPress={() => setShowThemeEdit(!showThemeEdit)}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.colorSwatch, { backgroundColor: primaryColor }]} />
                            <Text style={styles.rowLabel}>Theme Colors</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <View style={[styles.colorDot, { backgroundColor: accentColor }]} />
                            <ChevronRight size={16} color="#BBB" />
                        </View>
                    </Pressable>
                    {showThemeEdit && (
                        <View style={styles.themeEditPanel}>
                            <View style={styles.colorEditRow}>
                                <View style={styles.colorEditField}>
                                    <Text style={styles.colorEditLabel}>Primary</Text>
                                    <TextInput
                                        style={[styles.colorInput, { borderColor: primaryColor }]}
                                        value={primaryColor}
                                        onChangeText={setPrimaryColor}
                                        autoCapitalize="none"
                                    />
                                    <View style={[styles.colorSwatch, { backgroundColor: primaryColor }]} />
                                </View>
                                <View style={styles.colorEditField}>
                                    <Text style={styles.colorEditLabel}>Accent</Text>
                                    <TextInput
                                        style={[styles.colorInput, { borderColor: accentColor }]}
                                        value={accentColor}
                                        onChangeText={setAccentColor}
                                        autoCapitalize="none"
                                    />
                                    <View style={[styles.colorSwatch, { backgroundColor: accentColor }]} />
                                </View>
                            </View>
                            {/* Live preview */}
                            <View style={[styles.previewBar, { backgroundColor: previewTheme.primary }]}>
                                <Text style={[styles.previewBarText, { color: previewTheme.textOnPrimary }]}>
                                    {res?.name ?? 'Restaurant'}
                                </Text>
                                <View style={[styles.previewPill, { backgroundColor: previewTheme.accent + '40' }]}>
                                    <Text style={[styles.previewPillText, { color: previewTheme.accent }]}>Menu</Text>
                                </View>
                            </View>
                            <Pressable style={[styles.applyBtn, { backgroundColor: primaryColor }]} onPress={applyTheme}>
                                <Text style={styles.applyBtnText}>Apply Theme</Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Staff */}
                <SectionHeader title="Kitchen Staff" />
                <View style={styles.card}>
                    {kitchenStaff.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            {idx > 0 && <View style={styles.divider} />}
                            <View style={styles.rowItem}>
                                <View style={styles.rowLeft}>
                                    <View style={styles.rowIcon}>
                                        <Users size={18} color={primary} />
                                    </View>
                                    <View>
                                        <Text style={styles.rowLabel}>{s.name}</Text>
                                        <Text style={styles.staffPin}>PIN: {s.pin}</Text>
                                    </View>
                                </View>
                                <Pressable
                                    style={styles.removeStaffBtn}
                                    onPress={() => handleRemoveStaff(s.id, s.name)}
                                >
                                    <Trash2 size={14} color="#FF6B6B" />
                                </Pressable>
                            </View>
                        </React.Fragment>
                    ))}
                    {kitchenStaff.length === 0 && (
                        <Text style={styles.noStaff}>No kitchen staff added yet</Text>
                    )}
                    <View style={styles.divider} />
                    <Pressable style={styles.rowItem} onPress={() => setShowAddStaff(true)}>
                        <Plus size={16} color={primary} />
                        <Text style={[styles.addStaffText, { color: primary }]}>Add Kitchen Staff</Text>
                    </Pressable>
                </View>

                {/* Add Staff Modal */}
                <Modal visible={showAddStaff} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Add Kitchen Staff</Text>
                            <Text style={styles.modalSubtitle}>A random 4-digit PIN will be generated</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={newStaffName}
                                onChangeText={setNewStaffName}
                                placeholder="Staff member name"
                                placeholderTextColor="#BBB"
                                autoFocus
                            />
                            <View style={styles.modalActions}>
                                <Pressable style={styles.modalCancel} onPress={() => { setShowAddStaff(false); setNewStaffName(''); }}>
                                    <Text style={styles.modalCancelText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={[styles.modalConfirm, { backgroundColor: primary }]} onPress={handleAddStaff}>
                                    <Text style={styles.modalConfirmText}>Add</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Account */}
                <SectionHeader title="Account" />
                <View style={styles.card}>
                    <RowItem
                        icon={<Store size={18} color="#888" />}
                        label="Logged in as"
                        value={user?.email}
                    />
                    <View style={styles.divider} />
                    <Pressable
                        style={styles.logoutRow}
                        onPress={() => {
                            Alert.alert('Logout', 'Are you sure you want to logout?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Logout', style: 'destructive', onPress: logout },
                            ]);
                        }}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
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
        paddingHorizontal: SPACING.l, paddingTop: SPACING.m, paddingBottom: SPACING.s,
    },
    sectionHeader: {
        fontSize: 11, fontWeight: '700', color: '#888',
        textTransform: 'uppercase', letterSpacing: 1,
        paddingHorizontal: SPACING.l, paddingTop: SPACING.l, paddingBottom: SPACING.s,
    },
    card: {
        backgroundColor: '#FFF',
        marginHorizontal: SPACING.l,
        borderRadius: RADIUS.m,
        ...SHADOWS.small,
        overflow: 'hidden',
    },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: SPACING.l + 36 + SPACING.m },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: 14,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.m, flex: 1 },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowIcon: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
    },
    rowLabel: { fontSize: 15, color: '#1A1A1A' },
    rowValue: { fontSize: 13, color: '#888', maxWidth: 160 },
    colorSwatch: { width: 32, height: 32, borderRadius: 8 },
    staffPin: { fontSize: 12, color: '#888', marginTop: 1 },
    noStaff: { fontSize: 14, color: '#888', padding: SPACING.m },
    addStaffText: { fontSize: 15, fontWeight: '600', paddingVertical: 2 },
    logoutRow: { paddingHorizontal: SPACING.m, paddingVertical: 14 },
    logoutText: { fontSize: 15, color: '#FF6B6B', fontWeight: '600' },
    logoRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: SPACING.m, paddingVertical: 12, gap: SPACING.m,
    },
    logoThumb: { width: 44, height: 44, borderRadius: 22 },
    logoPlaceholder: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
    },
    colorDot: { width: 20, height: 20, borderRadius: 10, marginRight: 4 },
    themeEditPanel: {
        padding: SPACING.m, borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: SPACING.m,
    },
    colorEditRow: { flexDirection: 'row', gap: SPACING.m },
    colorEditField: { flex: 1, gap: 4 },
    colorEditLabel: { fontSize: 11, fontWeight: '700', color: '#888', textTransform: 'uppercase' },
    colorInput: {
        backgroundColor: '#F8F8F8', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 8, fontSize: 13,
        color: '#1A1A1A', borderWidth: 1.5,
    },
    previewBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: RADIUS.s, paddingHorizontal: SPACING.m, paddingVertical: 10,
    },
    previewBarText: { fontSize: 13, fontWeight: '700' },
    previewPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    previewPillText: { fontSize: 11, fontWeight: '700' },
    applyBtn: {
        borderRadius: RADIUS.s, paddingVertical: 12, alignItems: 'center',
    },
    applyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
    removeStaffBtn: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center', justifyContent: 'center',
    },
    modalBox: {
        backgroundColor: '#FFF', borderRadius: RADIUS.l,
        padding: SPACING.l, width: '85%', gap: SPACING.m,
    },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
    modalSubtitle: { fontSize: 13, color: '#888', marginTop: -6 },
    modalInput: {
        backgroundColor: '#F5F5F5', borderRadius: RADIUS.s,
        paddingHorizontal: SPACING.m, paddingVertical: 12,
        fontSize: 15, color: '#1A1A1A',
        borderWidth: 1, borderColor: '#E5E5E5',
    },
    modalActions: { flexDirection: 'row', gap: SPACING.m },
    modalCancel: {
        flex: 1, paddingVertical: 12, borderRadius: RADIUS.s,
        backgroundColor: '#F0F0F0', alignItems: 'center',
    },
    modalCancelText: { fontSize: 14, fontWeight: '600', color: '#888' },
    modalConfirm: {
        flex: 1, paddingVertical: 12, borderRadius: RADIUS.s, alignItems: 'center',
    },
    modalConfirmText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
