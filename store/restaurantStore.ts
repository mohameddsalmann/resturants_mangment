import { getMenu, getRestaurant, getStaff, getTables } from '@/services/mockData';
import { Category, MenuItem, Restaurant, Staff, Table } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface RestaurantState {
    restaurant: Restaurant | null;
    categories: Category[];
    menuItems: MenuItem[];
    tables: Table[];
    staff: Staff[];

    loadRestaurant: (restaurantId: string) => void;
    updateRestaurant: (data: Partial<Restaurant>) => void;
    addCategory: (category: Category) => void;
    updateCategory: (id: string, data: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    addMenuItem: (item: MenuItem) => void;
    updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
    deleteMenuItem: (id: string) => void;
    toggleItemAvailability: (id: string) => void;
    addTable: (table: Table) => void;
    updateTableStatus: (id: string, status: Table['status'], activeOrderId?: string | null) => void;
    addStaff: (name: string) => Staff;
    removeStaff: (id: string) => void;
}

export const useRestaurantStore = create<RestaurantState>()(
    persist(
        (set, get) => ({
            restaurant: null,
            categories: [],
            menuItems: [],
            tables: [],
            staff: [],

            loadRestaurant: (restaurantId) => {
                const restaurant = getRestaurant(restaurantId);
                if (!restaurant) return;
                const { categories, items } = getMenu(restaurantId);
                const tables = getTables(restaurantId);
                const staff = getStaff(restaurantId);
                set({ restaurant, categories, menuItems: items, tables, staff });
            },

            updateRestaurant: (data) => {
                set((state) => ({
                    restaurant: state.restaurant ? { ...state.restaurant, ...data } : null,
                }));
            },

            addCategory: (category) => {
                set((state) => ({ categories: [...state.categories, category] }));
            },

            updateCategory: (id, data) => {
                set((state) => ({
                    categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
                }));
            },

            deleteCategory: (id) => {
                set((state) => ({
                    categories: state.categories.filter((c) => c.id !== id),
                    menuItems: state.menuItems.filter((i) => i.categoryId !== id),
                }));
            },

            addMenuItem: (item) => {
                set((state) => ({ menuItems: [...state.menuItems, item] }));
            },

            updateMenuItem: (id, data) => {
                set((state) => ({
                    menuItems: state.menuItems.map((i) => (i.id === id ? { ...i, ...data } : i)),
                }));
            },

            deleteMenuItem: (id) => {
                set((state) => ({
                    menuItems: state.menuItems.filter((i) => i.id !== id),
                }));
            },

            toggleItemAvailability: (id) => {
                set((state) => ({
                    menuItems: state.menuItems.map((i) =>
                        i.id === id ? { ...i, isAvailable: !i.isAvailable } : i
                    ),
                }));
            },

            addTable: (table) => {
                set((state) => ({ tables: [...state.tables, table] }));
            },

            updateTableStatus: (id, status, activeOrderId) => {
                set((state) => ({
                    tables: state.tables.map((t) =>
                        t.id === id
                            ? { ...t, status, activeOrderId: activeOrderId !== undefined ? activeOrderId : t.activeOrderId }
                            : t
                    ),
                }));
            },

            addStaff: (name) => {
                const restaurantId = get().restaurant?.id ?? 'rest_1';
                const pin = String(Math.floor(1000 + Math.random() * 9000));
                const newStaff: Staff = {
                    id: `staff_${Date.now()}`,
                    restaurantId,
                    name,
                    role: 'kitchen',
                    pin,
                };
                set((state) => ({ staff: [...state.staff, newStaff] }));
                return newStaff;
            },

            removeStaff: (id) => {
                set((state) => ({ staff: state.staff.filter((s) => s.id !== id) }));
            },
        }),
        {
            name: 'restaurant-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
