import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { ThemedText } from '@/components/ui/ThemedText';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { ChefHat, Lock, Mail, QrCode } from 'lucide-react-native';
import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Login() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await login(email, password);
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.background}
        >
            <View style={styles.overlay} />
            <View style={styles.container}>
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Restaurant Owner</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>Sign in to your dashboard</ThemedText>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.form}>
                    <GlassInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        icon={<Mail size={20} color={COLORS.textSecondary} />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <GlassInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon={<Lock size={20} color={COLORS.textSecondary} />}
                        style={styles.input}
                    />

                    <GlassButton
                        title="Login as Owner"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        variant="primary"
                    />

                    <GlassButton
                        title="Create Restaurant Account"
                        onPress={() => router.push('/(auth)/register')}
                        variant="secondary"
                        style={{ marginTop: SPACING.m }}
                    />
                </Animated.View>

                {/* Other entry points */}
                <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.altLinks}>
                    <Pressable
                        style={styles.altLink}
                        onPress={() => router.push('/(guest)/scan' as any)}
                    >
                        <QrCode size={18} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.altLinkText}>Scan QR as Customer</Text>
                    </Pressable>
                    <View style={styles.linkDivider} />
                    <Pressable
                        style={styles.altLink}
                        onPress={() => router.push('/(kitchen)/login' as any)}
                    >
                        <ChefHat size={18} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.altLinkText}>Kitchen Staff Login</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    container: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    header: { marginBottom: SPACING.xxl },
    title: { color: 'white', fontSize: 38, marginBottom: SPACING.xs },
    subtitle: { color: 'rgba(255,255,255,0.8)' },
    form: { width: '100%' },
    input: { marginBottom: SPACING.m },
    altLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        gap: SPACING.m,
    },
    altLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    altLinkText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
    linkDivider: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.3)' },
});
