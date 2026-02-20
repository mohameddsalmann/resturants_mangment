import { getPromoCode } from '@/services/mockData';
import { CartItem, MenuItem, PromoCode } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CartState {
    items: CartItem[];
    restaurantId: string | null;
    taxRate: number;
    appliedPromo: PromoCode | null;
    promoError: string | null;

    setRestaurant: (restaurantId: string, taxRate: number) => void;
    addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
    removeItem: (menuItemId: string) => void;
    updateQuantity: (menuItemId: string, quantity: number) => void;
    setSpecialInstructions: (menuItemId: string, instructions: string) => void;
    applyPromoCode: (code: string) => boolean;
    removePromoCode: () => void;
    clearCart: () => void;

    itemCount: () => number;
    subtotal: () => number;
    discount: () => number;
    tax: () => number;
    total: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            restaurantId: null,
            taxRate: 0.10,
            appliedPromo: null,
            promoError: null,

            setRestaurant: (restaurantId, taxRate) => set({ restaurantId, taxRate }),

            addItem: (menuItem, quantity = 1, specialInstructions) => {
                set((state) => {
                    const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.menuItem.id === menuItem.id
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, { menuItem, quantity, specialInstructions }] };
                });
            },

            removeItem: (menuItemId) => {
                set((state) => ({
                    items: state.items.filter((i) => i.menuItem.id !== menuItemId),
                }));
            },

            updateQuantity: (menuItemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(menuItemId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.menuItem.id === menuItemId ? { ...i, quantity } : i
                    ),
                }));
            },

            setSpecialInstructions: (menuItemId, instructions) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.menuItem.id === menuItemId ? { ...i, specialInstructions: instructions } : i
                    ),
                }));
            },

            applyPromoCode: (code) => {
                const promo = getPromoCode(code);
                if (promo) {
                    set({ appliedPromo: promo, promoError: null });
                    return true;
                }
                set({ promoError: 'Invalid or expired promo code', appliedPromo: null });
                return false;
            },

            removePromoCode: () => set({ appliedPromo: null, promoError: null }),

            clearCart: () => set({ items: [], restaurantId: null, appliedPromo: null, promoError: null }),

            itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            subtotal: () =>
                get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

            discount: () => {
                const { appliedPromo, subtotal } = get();
                if (!appliedPromo) return 0;
                return subtotal() * (appliedPromo.discountPercent / 100);
            },

            tax: () => (get().subtotal() - get().discount()) * get().taxRate,

            total: () => get().subtotal() - get().discount() + get().tax(),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
