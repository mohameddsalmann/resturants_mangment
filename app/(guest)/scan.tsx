import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Camera, QrCode, ArrowLeft } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export default function ScanScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [manualMode, setManualMode] = useState(false);
    const [restaurantId, setRestaurantId] = useState('rest_1');
    const [tableNumber, setTableNumber] = useState('1');

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);

        // Parse: qrmenu://restaurant/{id}/table/{num}
        const match = data.match(/restaurant\/([^/]+)\/table\/(\d+)/);
        if (match) {
            router.push({
                pathname: '/(guest)/entry',
                params: { restaurantId: match[1], tableNumber: match[2] },
            });
        } else {
            Alert.alert('Invalid QR Code', 'This QR code is not recognized.', [
                { text: 'Scan Again', onPress: () => setScanned(false) },
            ]);
        }
    };

    const handleManualEntry = () => {
        if (!restaurantId.trim() || !tableNumber.trim()) {
            Alert.alert('Missing Info', 'Please enter both restaurant ID and table number.');
            return;
        }
        router.push({
            pathname: '/(guest)/entry',
            params: { restaurantId: restaurantId.trim(), tableNumber: tableNumber.trim() },
        });
    };

    if (manualMode) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.manualHeader}>
                    <Pressable onPress={() => setManualMode(false)} style={styles.backBtn}>
                        <ArrowLeft size={20} color={COLORS.text} />
                    </Pressable>
                    <Text style={styles.title}>Manual Entry</Text>
                </View>

                <View style={styles.manualForm}>
                    <Text style={styles.label}>Restaurant ID</Text>
                    <TextInput
                        style={styles.input}
                        value={restaurantId}
                        onChangeText={setRestaurantId}
                        placeholder="e.g. rest_1"
                        placeholderTextColor="#AAA"
                    />

                    <Text style={styles.label}>Table Number</Text>
                    <TextInput
                        style={styles.input}
                        value={tableNumber}
                        onChangeText={setTableNumber}
                        placeholder="e.g. 5"
                        placeholderTextColor="#AAA"
                        keyboardType="number-pad"
                    />

                    <Pressable style={styles.submitBtn} onPress={handleManualEntry}>
                        <Text style={styles.submitBtnText}>View Menu</Text>
                    </Pressable>

                    <Text style={styles.hint}>
                        Try: rest_1 (La Bella Italia) or rest_2 (Sakura Garden)
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.text} />
                </Pressable>
                <Text style={styles.title}>Scan QR Code</Text>
            </View>

            <View style={styles.cameraContainer}>
                {permission?.granted ? (
                    <CameraView
                        style={styles.camera}
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    >
                        <View style={styles.overlay}>
                            <View style={styles.scanFrame} />
                        </View>
                    </CameraView>
                ) : (
                    <View style={styles.noCamera}>
                        <Camera size={48} color="#888" />
                        <Text style={styles.noCameraText}>Camera access needed</Text>
                        <Pressable style={styles.permBtn} onPress={requestPermission}>
                            <Text style={styles.permBtnText}>Grant Permission</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Point your camera at a table QR code</Text>
                <Pressable style={styles.manualBtn} onPress={() => setManualMode(true)}>
                    <QrCode size={16} color={COLORS.primary} />
                    <Text style={styles.manualBtnText}>Enter manually instead</Text>
                </Pressable>
                {scanned && (
                    <Pressable style={styles.rescanBtn} onPress={() => setScanned(false)}>
                        <Text style={styles.rescanBtnText}>Scan Again</Text>
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        gap: SPACING.m,
    },
    manualHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        gap: SPACING.m,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
    cameraContainer: { flex: 1, marginHorizontal: SPACING.m, borderRadius: RADIUS.l, overflow: 'hidden' },
    camera: { flex: 1 },
    overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
    scanFrame: {
        width: 220,
        height: 220,
        borderWidth: 3,
        borderColor: '#FFF',
        borderRadius: RADIUS.m,
    },
    noCamera: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: RADIUS.l,
        gap: SPACING.m,
    },
    noCameraText: { fontSize: 16, color: '#888' },
    permBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.m,
    },
    permBtnText: { color: '#FFF', fontWeight: '700' },
    footer: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.l,
        alignItems: 'center',
        gap: SPACING.m,
    },
    footerText: { fontSize: 14, color: '#888' },
    manualBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    manualBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
    rescanBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.m,
    },
    rescanBtnText: { color: '#FFF', fontWeight: '700' },
    manualForm: { flex: 1, paddingHorizontal: SPACING.l, paddingTop: SPACING.l },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: SPACING.m },
    input: {
        backgroundColor: '#FFF',
        borderRadius: RADIUS.m,
        paddingHorizontal: SPACING.m,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.m,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    hint: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: SPACING.m },
});
