import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface AnimatedCardProps extends ViewProps {
    variant?: 'elevated' | 'glass' | 'flat';
    delay?: number;
}

export function AnimatedCard({
    children,
    style,
    variant = 'elevated',
    delay = 0,
    ...props
}: AnimatedCardProps) {
    const Container = Animated.View;

    if (variant === 'glass') {
        return (
            <Container
                entering={FadeInUp.delay(delay).springify()}
                style={[styles.glassContainer, style]}
                {...props}
            >
                <BlurView intensity={40} tint="light" style={styles.blurContent}>
                    {children}
                </BlurView>
            </Container>
        );
    }

    return (
        <Container
            entering={FadeInUp.delay(delay).springify()}
            style={[
                styles.card,
                variant === 'elevated' && styles.elevated,
                variant === 'flat' && styles.flat,
                style
            ]}
            {...props}
        >
            {children}
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: RADIUS.l,
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
    },
    elevated: {
        ...SHADOWS.medium,
    },
    flat: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    glassContainer: {
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    blurContent: {
        padding: SPACING.m,
    },
});
