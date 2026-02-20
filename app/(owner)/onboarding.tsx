import { COLORS, generateThemeFromColors, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Camera, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TOTAL_STEPS = 5;

interface StepHeaderProps { step: number; title: string; subtitle: string }

function StepHeader({ step, title, subtitle }: StepHeaderProps) {
    return (
        <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{step}/{TOTAL_STEPS}</Text>
            </View>
            <Text style={styles.stepTitle}>{title}</Text>
            <Text style={styles.stepSubtitle}>{subtitle}</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
            </View>
        </View>
    );
}

export default function OnboardingScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { updateRestaurant, addMenuItem, addCategory, addTable } = useRestaurantStore();

    const [step, setStep] = useState(1);

    // Step 1: Basic info
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    // Step 2: Logo + Theme
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [primary, setPrimary] = useState('#FF4B3A');
    const [accent, setAccent] = useState('#FFA94D');
    const [extracting, setExtracting] = useState(false);

    // Step 3: Hours
    const [openDays, setOpenDays] = useState<boolean[]>([true, true, true, true, true, true, false]);
    const [openTime, setOpenTime] = useState('11:00 AM');
    const [closeTime, setCloseTime] = useState('10:00 PM');

    // Step 4: First category & items
    const [catName, setCatName] = useState('');
    const [item1Name, setItem1Name] = useState('');
    const [item1Price, setItem1Price] = useState('');
    const [item2Name, setItem2Name] = useState('');
    const [item2Price, setItem2Price] = useState('');

    // Step 5: Tables
    const [tableCount, setTableCount] = useState('6');

    const restaurantId = user?.restaurantId ?? `rest_${Date.now()}`;

    const pickLogo = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images' as any,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!res.canceled && res.assets[0]) {
            setLogoUri(res.assets[0].uri);
        }
    };

    const toggleDay = (idx: number) => {
        setOpenDays((prev) => prev.map((d, i) => (i === idx ? !d : d)));
    };

    const hoursString = () => {
        const on = DAYS.filter((_, i) => openDays[i]).join(', ');
        return `${on}: ${openTime} - ${closeTime}`;
    };

    const previewTheme = generateThemeFromColors(primary, accent);

    const finish = () => {
        const n = parseInt(tableCount, 10) || 6;
        const theme = generateThemeFromColors(primary, accent);

        updateRestaurant({
            id: restaurantId,
            name: name || 'My Restaurant',
            logo: logoUri ?? '',
            address,
            phone,
            cuisineType: cuisine,
            operatingHours: hoursString(),
            theme,
            isSetupComplete: true,
        });

        if (catName) {
            const catId = `cat_${Date.now()}`;
            addCategory({ id: catId, restaurantId, name: catName, icon: '🍽️', sortOrder: 0 });
            if (item1Name && item1Price) {
                addMenuItem({ id: `item_${Date.now()}`, restaurantId, categoryId: catId, name: item1Name, description: '', price: parseFloat(item1Price) || 0, image: '', dietaryTags: [], isAvailable: true, sortOrder: 0 });
            }
            if (item2Name && item2Price) {
                addMenuItem({ id: `item_${Date.now() + 1}`, restaurantId, categoryId: catId, name: item2Name, description: '', price: parseFloat(item2Price) || 0, image: '', dietaryTags: [], isAvailable: true, sortOrder: 1 });
            }
        }

        for (let i = 1; i <= n; i++) {
            addTable({ id: `t_${restaurantId}_${i}`, restaurantId, number: i, capacity: 4, status: 'available', qrCodeData: `qrmenu://restaurant/${restaurantId}/table/${i}`, activeOrderId: null });
        }

        router.replace('/(owner)/dashboard');
    };

    const next = () => {
        if (step === 1 && !name.trim()) { Alert.alert('Required', 'Please enter a restaurant name'); return; }
        if (step < TOTAL_STEPS) setStep(step + 1);
        else finish();
    };

    const prev = () => { if (step > 1) setStep(step - 1); };

    const previewQR = `qrmenu://restaurant/${restaurantId}/table/1`;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ── Step 1: Basic Info ── */}
                {step === 1 && (
                    <>
                        <StepHeader step={1} title="Restaurant Details" subtitle="Tell us about your restaurant" />
                        <View style={styles.fields}>
                            <Text style={styles.label}>Restaurant Name *</Text>
                            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. La Bella Italia" placeholderTextColor="#BBB" />

                            <Text style={styles.label}>Cuisine Type</Text>
                            <TextInput style={styles.input} value={cuisine} onChangeText={setCuisine} placeholder="e.g. Italian, Japanese" placeholderTextColor="#BBB" />

                            <Text style={styles.label}>Address</Text>
                            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="123 Main St, City" placeholderTextColor="#BBB" />

                            <Text style={styles.label}>Phone</Text>
                            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1 555-0100" placeholderTextColor="#BBB" keyboardType="phone-pad" />
                        </View>
                    </>
                )}

                {/* ── Step 2: Logo + Theme ── */}
                {step === 2 && (
                    <>
                        <StepHeader step={2} title="Logo & Theme" subtitle="Upload your logo — colors are extracted automatically" />
                        <Pressable style={styles.logoPicker} onPress={pickLogo}>
                            {logoUri ? (
                                <Image source={{ uri: logoUri }} style={styles.logoPreview} />
                            ) : (
                                <View style={styles.logoPlaceholder}>
                                    <Camera size={32} color="#BBB" />
                                    <Text style={styles.logoPlaceholderText}>Tap to upload logo</Text>
                                </View>
                            )}
                        </Pressable>
                        {extracting && <Text style={styles.extractingText}>Extracting colors…</Text>}

                        <View style={styles.colorRow}>
                            <View style={styles.colorField}>
                                <Text style={styles.label}>Primary</Text>
                                <TextInput style={[styles.input, styles.colorInput, { backgroundColor: primary + '20', borderColor: primary }]} value={primary} onChangeText={setPrimary} placeholder="#FF4B3A" placeholderTextColor="#BBB" autoCapitalize="none" />
                                <View style={[styles.colorSwatch, { backgroundColor: primary }]} />
                            </View>
                            <View style={styles.colorField}>
                                <Text style={styles.label}>Accent</Text>
                                <TextInput style={[styles.input, styles.colorInput, { backgroundColor: accent + '20', borderColor: accent }]} value={accent} onChangeText={setAccent} placeholder="#FFA94D" placeholderTextColor="#BBB" autoCapitalize="none" />
                                <View style={[styles.colorSwatch, { backgroundColor: accent }]} />
                            </View>
                        </View>

                        <Text style={styles.label}>Theme Preview</Text>
                        <View style={[styles.themePreview, { backgroundColor: previewTheme.background }]}>
                            <View style={[styles.previewHeader, { backgroundColor: previewTheme.primary }]}>
                                <Text style={[styles.previewHeaderText, { color: previewTheme.textOnPrimary }]}>{name || 'Restaurant Name'}</Text>
                            </View>
                            <View style={styles.previewBody}>
                                <View style={[styles.previewBtn, { backgroundColor: previewTheme.primary }]}>
                                    <Text style={{ color: previewTheme.textOnPrimary, fontWeight: '700', fontSize: 12 }}>Add to Cart</Text>
                                </View>
                                <View style={[styles.previewPill, { backgroundColor: previewTheme.accent + '30' }]}>
                                    <Text style={[styles.previewPillText, { color: previewTheme.accent }]}>Pasta</Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* ── Step 3: Operating Hours ── */}
                {step === 3 && (
                    <>
                        <StepHeader step={3} title="Operating Hours" subtitle="Set the days and times you're open" />
                        <Text style={styles.label}>Open Days</Text>
                        <View style={styles.daysRow}>
                            {DAYS.map((d, i) => (
                                <Pressable
                                    key={d}
                                    style={[styles.dayPill, openDays[i] && { backgroundColor: COLORS.primary }]}
                                    onPress={() => toggleDay(i)}
                                >
                                    <Text style={[styles.dayText, openDays[i] && { color: '#FFF' }]}>{d}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.label}>Opening Time</Text>
                        <TextInput style={styles.input} value={openTime} onChangeText={setOpenTime} placeholder="11:00 AM" placeholderTextColor="#BBB" />

                        <Text style={styles.label}>Closing Time</Text>
                        <TextInput style={styles.input} value={closeTime} onChangeText={setCloseTime} placeholder="10:00 PM" placeholderTextColor="#BBB" />

                        <View style={styles.previewCard}>
                            <Text style={styles.hoursPreview}>{hoursString()}</Text>
                        </View>
                    </>
                )}

                {/* ── Step 4: First Category + Items ── */}
                {step === 4 && (
                    <>
                        <StepHeader step={4} title="First Menu Category" subtitle="Add a category and a couple of starter items" />
                        <Text style={styles.label}>Category Name</Text>
                        <TextInput style={styles.input} value={catName} onChangeText={setCatName} placeholder="e.g. Starters, Pizza" placeholderTextColor="#BBB" />

                        <Text style={styles.sectionLabel}>Item 1</Text>
                        <View style={styles.itemRow}>
                            <TextInput style={[styles.input, { flex: 1 }]} value={item1Name} onChangeText={setItem1Name} placeholder="Name" placeholderTextColor="#BBB" />
                            <TextInput style={[styles.input, styles.priceInput]} value={item1Price} onChangeText={setItem1Price} placeholder="$0.00" placeholderTextColor="#BBB" keyboardType="decimal-pad" />
                        </View>

                        <Text style={styles.sectionLabel}>Item 2</Text>
                        <View style={styles.itemRow}>
                            <TextInput style={[styles.input, { flex: 1 }]} value={item2Name} onChangeText={setItem2Name} placeholder="Name" placeholderTextColor="#BBB" />
                            <TextInput style={[styles.input, styles.priceInput]} value={item2Price} onChangeText={setItem2Price} placeholder="$0.00" placeholderTextColor="#BBB" keyboardType="decimal-pad" />
                        </View>
                        <Text style={styles.hint}>You can add more items from the Menu tab later</Text>
                    </>
                )}

                {/* ── Step 5: Tables ── */}
                {step === 5 && (
                    <>
                        <StepHeader step={5} title="Table Setup" subtitle="How many tables does your restaurant have?" />
                        <Text style={styles.label}>Number of Tables</Text>
                        <TextInput
                            style={[styles.input, styles.tableCountInput]}
                            value={tableCount}
                            onChangeText={setTableCount}
                            keyboardType="number-pad"
                            placeholder="6"
                            placeholderTextColor="#BBB"
                        />

                        <Text style={styles.label}>QR Code Preview (Table 1)</Text>
                        <View style={styles.qrPreviewCard}>
                            <Text style={styles.qrRestName}>{name || 'My Restaurant'}</Text>
                            <QRCode value={previewQR} size={140} color="#1A1A1A" backgroundColor="#FFFFFF" />
                            <Text style={styles.qrTableLabel}>Table 1</Text>
                            <Text style={styles.qrHint}>{previewQR}</Text>
                        </View>
                        <Text style={styles.hint}>
                            A unique QR code will be generated for each table. Download them from the Tables tab.
                        </Text>
                    </>
                )}
            </ScrollView>

            {/* Navigation */}
            <View style={styles.nav}>
                {step > 1 ? (
                    <Pressable style={styles.navBack} onPress={prev}>
                        <ArrowLeft size={20} color="#888" />
                        <Text style={styles.navBackText}>Back</Text>
                    </Pressable>
                ) : <View style={{ flex: 1 }} />}

                <Pressable style={[styles.navNext, { backgroundColor: COLORS.primary }]} onPress={next}>
                    {step === TOTAL_STEPS ? (
                        <>
                            <Check size={18} color="#FFF" />
                            <Text style={styles.navNextText}>Complete Setup</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.navNextText}>Next</Text>
                            <ArrowRight size={18} color="#FFF" />
                        </>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    scroll: { padding: SPACING.l, paddingBottom: 120 },
    stepHeader: { marginBottom: SPACING.l },
    stepBadge: {
        backgroundColor: COLORS.primary + '20',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: SPACING.s,
    },
    stepBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
    stepTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
    stepSubtitle: { fontSize: 14, color: '#888', marginTop: 4 },
    progressBar: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginTop: SPACING.m },
    progressFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
    fields: { gap: SPACING.s },
    label: { fontSize: 13, fontWeight: '600', color: '#888', marginTop: SPACING.m, marginBottom: 4 },
    sectionLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginTop: SPACING.m, marginBottom: 4 },
    input: {
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        paddingHorizontal: SPACING.m,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    logoPicker: { alignItems: 'center', marginBottom: SPACING.m },
    logoPreview: { width: 120, height: 120, borderRadius: 60 },
    logoPlaceholder: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', gap: 8,
    },
    logoPlaceholderText: { fontSize: 12, color: '#BBB', textAlign: 'center' },
    extractingText: { textAlign: 'center', fontSize: 13, color: COLORS.primary, marginBottom: SPACING.s },
    colorRow: { flexDirection: 'row', gap: SPACING.m },
    colorField: { flex: 1 },
    colorInput: { paddingRight: 44 },
    colorSwatch: { position: 'absolute', right: 12, bottom: 14, width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#E0E0E0' },
    themePreview: { borderRadius: RADIUS.l, overflow: 'hidden', ...SHADOWS.small, marginTop: SPACING.s },
    previewHeader: { padding: SPACING.m },
    previewHeaderText: { fontSize: 16, fontWeight: '700' },
    previewBody: { flexDirection: 'row', padding: SPACING.m, gap: SPACING.s, alignItems: 'center' },
    previewBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: RADIUS.s },
    previewPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
    previewPillText: { fontSize: 12, fontWeight: '600' },
    daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.s, marginBottom: SPACING.m },
    dayPill: {
        paddingHorizontal: 12, paddingVertical: 8,
        borderRadius: 999, backgroundColor: '#E8E8E8',
    },
    dayText: { fontSize: 12, fontWeight: '700', color: '#888' },
    previewCard: { backgroundColor: '#FFF', borderRadius: RADIUS.m, padding: SPACING.m, marginTop: SPACING.l, ...SHADOWS.small },
    hoursPreview: { fontSize: 14, color: '#1A1A1A', lineHeight: 20 },
    itemRow: { flexDirection: 'row', gap: SPACING.s },
    priceInput: { width: 90 },
    tableCountInput: { fontSize: 28, fontWeight: '800', textAlign: 'center', height: 72 },
    qrPreviewCard: {
        backgroundColor: '#FFF', borderRadius: RADIUS.l,
        padding: SPACING.l, alignItems: 'center', gap: SPACING.s,
        marginTop: SPACING.s, ...SHADOWS.small,
    },
    qrRestName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
    qrTableLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
    qrHint: { fontSize: 10, color: '#AAA', textAlign: 'center' },
    hint: { fontSize: 12, color: '#AAA', marginTop: SPACING.m },
    nav: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF', padding: SPACING.l,
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
        gap: SPACING.m,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 8,
        boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.06)',
    },
    navBack: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
    navBackText: { fontSize: 15, color: '#888', fontWeight: '600' },
    navNext: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: RADIUS.m },
    navNextText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});
