import React, { createContext, useContext, useState, useCallback } from 'react';
import { ThemeColors } from '@/types';
import { DEFAULT_THEME } from '@/constants/theme';
import { getRestaurant } from '@/services/mockData';

interface ThemeContextType {
    theme: ThemeColors;
    setThemeForRestaurant: (restaurantId: string) => void;
    resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: DEFAULT_THEME,
    setThemeForRestaurant: () => {},
    resetTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);

    const setThemeForRestaurant = useCallback((restaurantId: string) => {
        const restaurant = getRestaurant(restaurantId);
        if (restaurant) {
            setTheme(restaurant.theme);
        }
    }, []);

    const resetTheme = useCallback(() => {
        setTheme(DEFAULT_THEME);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setThemeForRestaurant, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    return useContext(ThemeContext);
}
