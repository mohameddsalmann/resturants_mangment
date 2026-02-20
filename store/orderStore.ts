import { CartItem, Order, OrderStatus } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PlaceOrderParams {
    restaurantId: string;
    tableId: string;
    tableNumber: number;
    customerName: string;
    customerPhone?: string;
    items: CartItem[];
    taxRate: number;
}

interface OrderState {
    orders: Order[];
    placeOrder: (params: PlaceOrderParams) => Order;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    getOrdersByRestaurant: (restaurantId: string) => Order[];
    getOrdersByTable: (restaurantId: string, tableNumber: number) => Order[];
    getCurrentOrder: (restaurantId: string, tableNumber: number) => Order | undefined;
    clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],

            placeOrder: (params) => {
                const subtotal = params.items.reduce(
                    (sum, i) => sum + i.menuItem.price * i.quantity,
                    0
                );
                const tax = subtotal * params.taxRate;
                const total = subtotal + tax;
                const now = new Date().toISOString();

                const order: Order = {
                    id: `order_${Date.now()}`,
                    restaurantId: params.restaurantId,
                    tableId: params.tableId,
                    tableNumber: params.tableNumber,
                    customerName: params.customerName,
                    customerPhone: params.customerPhone,
                    items: params.items.map((i) => ({
                        menuItemId: i.menuItem.id,
                        name: i.menuItem.name,
                        price: i.menuItem.price,
                        quantity: i.quantity,
                        specialInstructions: i.specialInstructions,
                    })),
                    status: 'new',
                    subtotal,
                    tax,
                    total,
                    createdAt: now,
                    updatedAt: now,
                    estimatedWaitMinutes: 20,
                };

                set((state) => ({ orders: [order, ...state.orders] }));
                return order;
            },

            updateOrderStatus: (orderId, status) => {
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
                    ),
                }));
            },

            getOrdersByRestaurant: (restaurantId) =>
                get().orders.filter((o) => o.restaurantId === restaurantId),

            getOrdersByTable: (restaurantId, tableNumber) =>
                get().orders.filter((o) => o.restaurantId === restaurantId && o.tableNumber === tableNumber),

            getCurrentOrder: (restaurantId, tableNumber) =>
                get().orders.find(
                    (o) =>
                        o.restaurantId === restaurantId &&
                        o.tableNumber === tableNumber &&
                        o.status !== 'paid' &&
                        o.status !== 'served'
                ),

            clearOrders: () => set({ orders: [] }),
        }),
        {
            name: 'order-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
