import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface GlassInputProps extends TextInputProps {
    icon?: React.ReactNode;
}

export function GlassInput({ style, icon, ...props }: GlassInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = useSharedValue('transparent');

    const animatedStyle = useAnimatedStyle(() => ({
        borderColor: withTiming(isFocused ? COLORS.primary : 'transparent'),
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle, style]}>
            <BlurView intensity={20} tint="light" style={styles.blurContainer}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={COLORS.textSecondary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.m,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1,
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        height: 56,
    },
    iconContainer: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        height: '100%',
    },
});
