import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { ThemedText } from '@/components/ui/ThemedText';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Register() {
    const router = useRouter();
    const { register, isLoading } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        await register(name, email, password);
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.background}
        >
            <View style={styles.overlay} />
            <View style={styles.container}>
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>Join us for an exquisite experience</ThemedText>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.form}>
                    <GlassInput
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        icon={<User size={20} color={COLORS.textSecondary} />}
                        style={styles.input}
                    />
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
                        title="Sign Up"
                        onPress={handleRegister}
                        isLoading={isLoading}
                        variant="primary"
                        style={{ marginTop: SPACING.m }}
                    />

                    <GlassButton
                        title="Already have an account? Login"
                        onPress={() => router.back()}
                        variant="glass"
                        style={{ marginTop: SPACING.xl }}
                    />
                </Animated.View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    header: {
        marginBottom: SPACING.xxl,
    },
    title: {
        color: 'white',
        fontSize: 40,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: SPACING.m,
    },
});
