import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OwnerUser {
    id: string;
    name: string;
    email: string;
    restaurantId: string;
}

interface AuthState {
    user: OwnerUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<OwnerUser>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email, _password) => {
                set({ isLoading: true });
                setTimeout(() => {
                    const isSecond = email.toLowerCase().includes('sakura') || email.toLowerCase().includes('yuto');
                    set({
                        user: {
                            id: isSecond ? 'owner_2' : 'owner_1',
                            name: isSecond ? 'Tanaka Yuto' : 'Giovanni Rossi',
                            email,
                            restaurantId: isSecond ? 'rest_2' : 'rest_1',
                        },
                        token: 'mock-jwt-token',
                        isAuthenticated: true,
                        isLoading: false,
                    });
                }, 800);
            },

            register: async (name, email, _password) => {
                set({ isLoading: true });
                setTimeout(() => {
                    set({
                        user: {
                            id: `owner_${Date.now()}`,
                            name,
                            email,
                            restaurantId: 'rest_1',
                        },
                        token: 'mock-jwt-token',
                        isAuthenticated: true,
                        isLoading: false,
                    });
                }, 800);
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            updateUser: (data) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null,
                }));
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
