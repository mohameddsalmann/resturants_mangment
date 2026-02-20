// ── Enums ──────────────────────────────────────────────
export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'served' | 'paid';
export type TableStatus = 'available' | 'occupied' | 'reserved';
export type StaffRole = 'owner' | 'kitchen';

// ── Theme ──────────────────────────────────────────────
export interface ThemeColors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textOnPrimary: string;
    success: string;
    warning: string;
    error: string;
    glassBorder: string;
    glassBackground: string;
}

// ── Restaurant ─────────────────────────────────────────
export interface Restaurant {
    id: string;
    name: string;
    logo: string;
    address: string;
    phone: string;
    cuisineType: string;
    operatingHours: string;
    taxRate: number;
    currency: string;
    theme: ThemeColors;
    ownerId: string;
    isSetupComplete: boolean;
}

// ── Promo ───────────────────────────────────────────────
export interface PromoCode {
    code: string;
    discountPercent: number;
    isActive: boolean;
}

// ── Menu ───────────────────────────────────────────────
export interface Category {
    id: string;
    restaurantId: string;
    name: string;
    icon: string;
    sortOrder: number;
}

export interface MenuItem {
    id: string;
    restaurantId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    dietaryTags: string[];
    isAvailable: boolean;
    sortOrder: number;
}

// ── Table ──────────────────────────────────────────────
export interface Table {
    id: string;
    restaurantId: string;
    number: number;
    capacity: number;
    status: TableStatus;
    qrCodeData: string;
    activeOrderId: string | null;
}

// ── Order ──────────────────────────────────────────────
export interface OrderItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
}

export interface Order {
    id: string;
    restaurantId: string;
    tableId: string;
    tableNumber: number;
    customerName: string;
    customerPhone?: string;
    items: OrderItem[];
    status: OrderStatus;
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    estimatedWaitMinutes?: number;
}

// ── Cart ───────────────────────────────────────────────
export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    specialInstructions?: string;
}

// ── Staff ──────────────────────────────────────────────
export interface Staff {
    id: string;
    restaurantId: string;
    name: string;
    role: StaffRole;
    pin?: string;
    email?: string;
}

// ── Dashboard ──────────────────────────────────────────
export interface DashboardStats {
    todayRevenue: number;
    totalOrders: number;
    activeOrders: number;
    avgCompletionTime: number;
}
