import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface GlassButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'glass';
    style?: ViewStyle;
    isLoading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassButton({
    onPress,
    title,
    variant = 'primary',
    style,
    isLoading = false,
    disabled = false,
    icon
}: GlassButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const renderContent = () => (
        <>
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : COLORS.primary} />
            ) : (
                <>
                    {icon}
                    <Text style={[
                        styles.text,
                        variant === 'secondary' && styles.textSecondary,
                        variant === 'glass' && styles.textGlass
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </>
    );

    if (variant === 'glass') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || isLoading}
                style={[animatedStyle, styles.container, style]}
            >
                <BlurView intensity={30} tint="light" style={[styles.glassContainer, styles.buttonBase]}>
                    {renderContent()}
                </BlurView>
            </AnimatedPressable>
        );
    }

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || isLoading}
            style={[
                animatedStyle,
                styles.buttonBase,
                variant === 'primary' ? styles.primary : styles.secondary,
                disabled && styles.disabled,
                style
            ]}
        >
            {renderContent()}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: RADIUS.m,
    },
    buttonBase: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderRadius: RADIUS.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.s,
        minHeight: 56,
    },
    primary: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        elevation: 4,
    },
    secondary: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    glassContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    textSecondary: {
        color: COLORS.text,
    },
    textGlass: {
        color: COLORS.text,
    },
});
