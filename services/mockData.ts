import { generateThemeFromColors } from '@/constants/theme';
import { Category, DashboardStats, MenuItem, Order, PromoCode, Restaurant, Staff, Table } from '@/types';

// ── Restaurants ────────────────────────────────────────
export const RESTAURANTS: Restaurant[] = [
    {
        id: 'rest_1',
        name: 'La Bella Italia',
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
        address: '123 Via Roma, Downtown',
        phone: '+1 555-0101',
        cuisineType: 'Italian',
        operatingHours: '11:00 AM - 11:00 PM',
        taxRate: 0.10,
        currency: 'USD',
        theme: generateThemeFromColors('#C41E3A', '#D4AF37'),
        ownerId: 'owner_1',
        isSetupComplete: true,
    },
    {
        id: 'rest_2',
        name: 'Sakura Garden',
        logo: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=200',
        address: '456 Cherry Blossom Ave',
        phone: '+1 555-0202',
        cuisineType: 'Japanese',
        operatingHours: '11:30 AM - 10:30 PM',
        taxRate: 0.08,
        currency: 'USD',
        theme: generateThemeFromColors('#D63384', '#1C1C1E'),
        ownerId: 'owner_2',
        isSetupComplete: true,
    },
];

// ── Promo Codes ────────────────────────────────────────
export const PROMO_CODES: PromoCode[] = [
    { code: 'SAVE20', discountPercent: 20, isActive: true },
    { code: 'WELCOME10', discountPercent: 10, isActive: true },
    { code: 'SUMMER15', discountPercent: 15, isActive: true },
];

// ── Categories ─────────────────────────────────────────
export const CATEGORIES: Category[] = [
    // La Bella Italia
    { id: 'cat_1', restaurantId: 'rest_1', name: 'Antipasti', icon: '🥗', sortOrder: 0 },
    { id: 'cat_2', restaurantId: 'rest_1', name: 'Pasta', icon: '🍝', sortOrder: 1 },
    { id: 'cat_3', restaurantId: 'rest_1', name: 'Pizza', icon: '🍕', sortOrder: 2 },
    { id: 'cat_4', restaurantId: 'rest_1', name: 'Dolci', icon: '🍰', sortOrder: 3 },
    { id: 'cat_5', restaurantId: 'rest_1', name: 'Bevande', icon: '🍷', sortOrder: 4 },
    // Sakura Garden
    { id: 'cat_6', restaurantId: 'rest_2', name: 'Starters', icon: '�', sortOrder: 0 },
    { id: 'cat_7', restaurantId: 'rest_2', name: 'Sushi', icon: '🍣', sortOrder: 1 },
    { id: 'cat_8', restaurantId: 'rest_2', name: 'Ramen', icon: '🍜', sortOrder: 2 },
    { id: 'cat_9', restaurantId: 'rest_2', name: 'Mains', icon: '🥩', sortOrder: 3 },
    { id: 'cat_10', restaurantId: 'rest_2', name: 'Desserts', icon: '�', sortOrder: 4 },
    { id: 'cat_11', restaurantId: 'rest_2', name: 'Drinks', icon: '🍵', sortOrder: 5 },
];

// ── Menu Items ─────────────────────────────────────────
export const MENU_ITEMS: MenuItem[] = [
    // ─── La Bella Italia: Antipasti ───
    { id: 'i1', restaurantId: 'rest_1', categoryId: 'cat_1', name: 'Bruschetta al Pomodoro', description: 'Toasted ciabatta with fresh tomatoes, basil, garlic and extra virgin olive oil', price: 10.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400', dietaryTags: ['vegetarian', 'vegan'], isAvailable: true, sortOrder: 0 },
    { id: 'i2', restaurantId: 'rest_1', categoryId: 'cat_1', name: 'Carpaccio di Manzo', description: 'Thinly sliced raw beef, arugula, capers, shaved Parmigiano', price: 15.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', dietaryTags: ['gluten-free'], isAvailable: true, sortOrder: 1 },
    { id: 'i3', restaurantId: 'rest_1', categoryId: 'cat_1', name: 'Burrata e Prosciutto', description: 'Creamy burrata, San Daniele prosciutto, roasted peppers', price: 16.99, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', dietaryTags: ['gluten-free'], isAvailable: true, sortOrder: 2 },
    // ─── La Bella Italia: Pasta ───
    { id: 'i4', restaurantId: 'rest_1', categoryId: 'cat_2', name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with guanciale, egg yolk, pecorino, black pepper', price: 18.99, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', dietaryTags: [], isAvailable: true, sortOrder: 0 },
    { id: 'i5', restaurantId: 'rest_1', categoryId: 'cat_2', name: 'Tagliatelle al Tartufo', description: 'Fresh tagliatelle, black truffle cream sauce, Parmigiano', price: 26.99, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400', dietaryTags: ['vegetarian'], isAvailable: true, sortOrder: 1 },
    { id: 'i6', restaurantId: 'rest_1', categoryId: 'cat_2', name: 'Penne all\'Arrabbiata', description: 'Penne in spicy tomato sauce with garlic and chili flakes', price: 14.99, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', dietaryTags: ['vegetarian', 'vegan'], isAvailable: true, sortOrder: 2 },
    { id: 'i7', restaurantId: 'rest_1', categoryId: 'cat_2', name: 'Lasagna della Nonna', description: 'Grandmother\'s recipe with bolognese, béchamel, three cheeses', price: 19.99, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400', dietaryTags: [], isAvailable: true, sortOrder: 3 },
    // ─── La Bella Italia: Pizza ───
    { id: 'i8', restaurantId: 'rest_1', categoryId: 'cat_3', name: 'Margherita DOP', description: 'San Marzano tomatoes, fior di latte, fresh basil, EVOO', price: 16.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', dietaryTags: ['vegetarian'], isAvailable: true, sortOrder: 0 },
    { id: 'i9', restaurantId: 'rest_1', categoryId: 'cat_3', name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, fontina, Parmigiano on white base', price: 19.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', dietaryTags: ['vegetarian'], isAvailable: true, sortOrder: 1 },
    { id: 'i10', restaurantId: 'rest_1', categoryId: 'cat_3', name: 'Diavola', description: 'Spicy salami, mozzarella, chili oil, tomato sauce', price: 18.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', dietaryTags: [], isAvailable: false, sortOrder: 2 },
    // ─── La Bella Italia: Dolci ───
    { id: 'i11', restaurantId: 'rest_1', categoryId: 'cat_4', name: 'Tiramisù', description: 'Espresso-soaked savoiardi, mascarpone cream, cocoa dusting', price: 10.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', dietaryTags: ['vegetarian'], isAvailable: true, sortOrder: 0 },
    { id: 'i12', restaurantId: 'rest_1', categoryId: 'cat_4', name: 'Panna Cotta', description: 'Vanilla bean panna cotta with mixed berry compote', price: 9.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', dietaryTags: ['vegetarian', 'gluten-free'], isAvailable: true, sortOrder: 1 },
    // ─── La Bella Italia: Bevande ───
    { id: 'i13', restaurantId: 'rest_1', categoryId: 'cat_5', name: 'Chianti Classico (glass)', description: 'Tuscan red wine, medium body, cherry and spice notes', price: 12.99, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', dietaryTags: ['vegan'], isAvailable: true, sortOrder: 0 },
    { id: 'i14', restaurantId: 'rest_1', categoryId: 'cat_5', name: 'Espresso Doppio', description: 'Double shot Italian espresso', price: 3.99, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', dietaryTags: ['vegan', 'gluten-free'], isAvailable: true, sortOrder: 1 },
    { id: 'i15', restaurantId: 'rest_1', categoryId: 'cat_5', name: 'Limonata Fresca', description: 'Fresh-squeezed Amalfi lemon juice, sparkling water, mint', price: 5.99, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', dietaryTags: ['vegan', 'gluten-free'], isAvailable: true, sortOrder: 2 },
    { id: 'i16', restaurantId: 'rest_1', categoryId: 'cat_5', name: 'San Pellegrino', description: 'Sparkling mineral water 750ml', price: 4.99, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', dietaryTags: ['vegan', 'gluten-free'], isAvailable: true, sortOrder: 3 },

    // ─── Sakura Garden: Starters ───
    { id: 'i17', restaurantId: 'rest_2', categoryId: 'cat_6', name: 'Edamame', description: 'Steamed young soybeans with sea salt', price: 6.99, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80571?w=400', dietaryTags: ['vegan', 'gluten-free'], isAvailable: true, sortOrder: 0 },
    { id: 'i18', restaurantId: 'rest_2', categoryId: 'cat_6', name: 'Gyoza (6 pcs)', description: 'Pan-fried pork and vegetable dumplings with ponzu dip', price: 9.99, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400', dietaryTags: [], isAvailable: true, sortOrder: 1 },
    { id: 'i19', restaurantId: 'rest_2', categoryId: 'cat_6', name: 'Agedashi Tofu', description: 'Crispy fried tofu in warm dashi broth, bonito flakes', price: 8.99, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', dietaryTags: ['vegetarian'], isAvailable: true, sortOrder: 2 },
    // ─── Sakura Garden: Sushi ───
    { id: 'i20', restaurantId: 'rest_2', categoryId: 'cat_7', name: 'Salmon Nigiri (4 pcs)', description: 'Fresh Atlantic salmon over seasoned sushi rice', price: 14.99, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', dietaryTags: ['gluten-free'], isAvailable: true, sortOrder: 0 },
    { id: 'i21', restaurantId: 'rest_2', categoryId: 'cat_7', name: 'Dragon Roll (8 pcs)', description: 'Shrimp tempura, avocado, eel, unagi sauce, sesame', price: 18.99, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', dietaryTags: [], isAvailable: true, sortOrder: 1 },
    { id: 'i22', restaurantId: 'rest_2', categoryId: 'cat_7', name: 'Rainbow Roll (8 pcs)', description: 'California roll topped with assorted sashimi', price: 21.99, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', dietaryTags: [], isAvailable: true, sortOrder: 2 },
    { id: 'i23', restaurantId: 'rest_2', categoryId: 'cat_7', name: 'Vegetable Roll (6 pcs)', description: 'Avocado, cucumber, carrot, asparagus, sesame', price: 11.99, image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400', dietaryTags: ['vegetarian', 'vegan'], isAvailable: true, sortOrder: 3 },
    // ─── Sakura Garden: Ramen ───
    { id: 'i24', restaurantId: 'rest_2', categoryId: 'cat_8', name: 'Tonkotsu Ramen', description: 'Rich pork bone broth, chashu, soft egg, nori, scallions', price: 16.99, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', dietaryTags: [], isAvailable: true, sortOrder: 0 },
    { id: 'i25', restaurantId: 'rest_2', categoryId: 'cat_8', name: 'Miso Ramen', description: 'Fermented soybean broth, corn, butter, bean sprouts, pork belly', price: 15.99, image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', dietaryTags: [], isAvailable: true, sortOrder: 1 },
    { id: 'i26', restaurantId: 'rest_2', categoryId: 'cat_8', name: 'Spicy Tantanmen', description: 'Sesame chili broth, ground pork, bok choy, chili oil', price: 17.99, image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400', dietaryTags: [], isAvailable: false, sortOrder: 2 },
    // ─── Sakura Garden: Mains ───
    { id: 'i27', restaurantId: 'rest_2', categoryId: 'cat_9', name: 'Chicken Teriyaki', description: 'Grilled chicken thigh, house teriyaki glaze, steamed rice, vegetables', price: 19.99, image: 'https://images.unsplash.com/photo-1609183480237-ccf8e9e1d1f8?w=400', dietaryTags: ['gluten-free'], isAvailable: true, sortOrder: 0 },
    { id: 'i28', restaurantId: 'rest_2', categoryId: 'cat_9', name: 'Wagyu Beef Don', description: 'A5 wagyu slices over rice, onsen egg, truffle soy', price: 38.99, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', dietaryTags: [], isAvailable: true, sortOrder: 1 },
    { id: 'i29', restaurantId: 'rest_2', categoryId: 'cat_9', name: 'Grilled Salmon Bento', description: 'Miso-glazed salmon, rice, pickles, miso soup, salad', price: 24.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', dietaryTags: ['gluten-free'], isAvailable: true, sortOrder: 2 },
    // ─── Sakura Garden: Desserts ───
    { id: 'i30', restaurantId: 'rest_2', categoryId: 'cat_10', name: 'Matcha Tiramisu', description: 'Japanese twist on Italian classic with matcha cream layers', price: 10.99, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', dietaryTags: ['vegetarian'], isAvailable: true, sortOrder: 0 },
    { id: 'i31', restaurantId: 'rest_2', categoryId: 'cat_10', name: 'Mochi Ice Cream (3 pcs)', description: 'Assorted flavors: strawberry, green tea, mango', price: 8.99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', dietaryTags: ['vegetarian', 'gluten-free'], isAvailable: true, sortOrder: 1 },
    // ─── Sakura Garden: Drinks ───
    { id: 'i32', restaurantId: 'rest_2', categoryId: 'cat_11', name: 'Japanese Green Tea', description: 'Premium sencha, served hot', price: 3.99, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400', dietaryTags: ['vegan', 'gluten-free'], isAvailable: true, sortOrder: 0 },
    { id: 'i33', restaurantId: 'rest_2', categoryId: 'cat_11', name: 'Yuzu Lemonade', description: 'Sparkling yuzu citrus with honey and soda', price: 6.99, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', dietaryTags: ['vegan', 'gluten-free'], isAvailable: true, sortOrder: 1 },
    { id: 'i34', restaurantId: 'rest_2', categoryId: 'cat_11', name: 'Asahi Draft', description: 'Japanese lager, crisp and refreshing, 500ml', price: 7.99, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', dietaryTags: ['vegan'], isAvailable: true, sortOrder: 2 },
];

// ── Tables ─────────────────────────────────────────────
function makeTables(restaurantId: string, prefix: string): Table[] {
    const statuses: Array<{ s: Table['status']; orderId: string | null }> = [
        { s: 'occupied', orderId: `${prefix}_o1` }, { s: 'available', orderId: null },
        { s: 'occupied', orderId: `${prefix}_o2` }, { s: 'reserved', orderId: null },
        { s: 'occupied', orderId: `${prefix}_o3` }, { s: 'available', orderId: null },
        { s: 'available', orderId: null }, { s: 'reserved', orderId: null },
        { s: 'occupied', orderId: `${prefix}_o4` }, { s: 'available', orderId: null },
        { s: 'available', orderId: null }, { s: 'available', orderId: null },
    ];
    return statuses.map((cfg, i) => ({
        id: `${prefix}_t${i + 1}`,
        restaurantId,
        number: i + 1,
        capacity: [2, 4, 4, 6, 4, 2, 4, 8, 4, 2, 6, 4][i],
        status: cfg.s,
        qrCodeData: `qrmenu://restaurant/${restaurantId}/table/${i + 1}`,
        activeOrderId: cfg.orderId,
    }));
}

export const MOCK_TABLES: Table[] = [
    ...makeTables('rest_1', 'r1'),
    ...makeTables('rest_2', 'r2'),
];

// ── Orders ─────────────────────────────────────────────
const now = Date.now();
export const MOCK_ORDERS: Order[] = [
    // La Bella Italia orders
    { id: 'r1_o1', restaurantId: 'rest_1', tableId: 'r1_t1', tableNumber: 1, customerName: 'Marco', items: [{ menuItemId: 'i4', name: 'Spaghetti Carbonara', price: 18.99, quantity: 2 }, { menuItemId: 'i13', name: 'Chianti Classico', price: 12.99, quantity: 2 }], status: 'preparing', subtotal: 63.96, tax: 6.40, total: 70.36, createdAt: new Date(now - 12 * 60000).toISOString(), updatedAt: new Date(now - 5 * 60000).toISOString(), estimatedWaitMinutes: 8 },
    { id: 'r1_o2', restaurantId: 'rest_1', tableId: 'r1_t3', tableNumber: 3, customerName: 'Sofia', items: [{ menuItemId: 'i8', name: 'Margherita DOP', price: 16.99, quantity: 1 }, { menuItemId: 'i1', name: 'Bruschetta al Pomodoro', price: 10.99, quantity: 1 }], status: 'new', subtotal: 27.98, tax: 2.80, total: 30.78, createdAt: new Date(now - 2 * 60000).toISOString(), updatedAt: new Date(now - 2 * 60000).toISOString(), estimatedWaitMinutes: 20 },
    { id: 'r1_o3', restaurantId: 'rest_1', tableId: 'r1_t5', tableNumber: 5, customerName: 'Luca', items: [{ menuItemId: 'i5', name: 'Tagliatelle al Tartufo', price: 26.99, quantity: 1 }, { menuItemId: 'i11', name: 'Tiramisù', price: 10.99, quantity: 2 }, { menuItemId: 'i14', name: 'Espresso Doppio', price: 3.99, quantity: 2 }], status: 'ready', subtotal: 56.95, tax: 5.70, total: 62.65, createdAt: new Date(now - 35 * 60000).toISOString(), updatedAt: new Date(now - 3 * 60000).toISOString() },
    { id: 'r1_o4', restaurantId: 'rest_1', tableId: 'r1_t9', tableNumber: 9, customerName: 'Giulia', items: [{ menuItemId: 'i7', name: 'Lasagna della Nonna', price: 19.99, quantity: 2 }, { menuItemId: 'i16', name: 'San Pellegrino', price: 4.99, quantity: 2 }], status: 'served', subtotal: 49.96, tax: 5.00, total: 54.96, createdAt: new Date(now - 55 * 60000).toISOString(), updatedAt: new Date(now - 10 * 60000).toISOString() },
    { id: 'r1_o5', restaurantId: 'rest_1', tableId: 'r1_t2', tableNumber: 2, customerName: 'Elena', items: [{ menuItemId: 'i9', name: 'Quattro Formaggi', price: 19.99, quantity: 1 }], status: 'paid', subtotal: 19.99, tax: 2.00, total: 21.99, createdAt: new Date(now - 90 * 60000).toISOString(), updatedAt: new Date(now - 70 * 60000).toISOString() },
    // Sakura Garden orders
    { id: 'r2_o1', restaurantId: 'rest_2', tableId: 'r2_t1', tableNumber: 1, customerName: 'Yuki', items: [{ menuItemId: 'i24', name: 'Tonkotsu Ramen', price: 16.99, quantity: 2 }, { menuItemId: 'i17', name: 'Edamame', price: 6.99, quantity: 1 }], status: 'preparing', subtotal: 40.97, tax: 3.28, total: 44.25, createdAt: new Date(now - 10 * 60000).toISOString(), updatedAt: new Date(now - 4 * 60000).toISOString(), estimatedWaitMinutes: 6 },
    { id: 'r2_o2', restaurantId: 'rest_2', tableId: 'r2_t3', tableNumber: 3, customerName: 'Kenji', items: [{ menuItemId: 'i21', name: 'Dragon Roll', price: 18.99, quantity: 1 }, { menuItemId: 'i20', name: 'Salmon Nigiri', price: 14.99, quantity: 1 }, { menuItemId: 'i32', name: 'Japanese Green Tea', price: 3.99, quantity: 2 }], status: 'new', subtotal: 41.96, tax: 3.36, total: 45.32, createdAt: new Date(now - 1 * 60000).toISOString(), updatedAt: new Date(now - 1 * 60000).toISOString(), estimatedWaitMinutes: 25 },
    { id: 'r2_o3', restaurantId: 'rest_2', tableId: 'r2_t5', tableNumber: 5, customerName: 'Hana', items: [{ menuItemId: 'i28', name: 'Wagyu Beef Don', price: 38.99, quantity: 1 }, { menuItemId: 'i30', name: 'Matcha Tiramisu', price: 10.99, quantity: 1 }], status: 'ready', subtotal: 49.98, tax: 4.00, total: 53.98, createdAt: new Date(now - 30 * 60000).toISOString(), updatedAt: new Date(now - 2 * 60000).toISOString() },
    { id: 'r2_o4', restaurantId: 'rest_2', tableId: 'r2_t9', tableNumber: 9, customerName: 'Takeshi', items: [{ menuItemId: 'i27', name: 'Chicken Teriyaki', price: 19.99, quantity: 1 }, { menuItemId: 'i34', name: 'Asahi Draft', price: 7.99, quantity: 2 }], status: 'served', subtotal: 35.97, tax: 2.88, total: 38.85, createdAt: new Date(now - 50 * 60000).toISOString(), updatedAt: new Date(now - 15 * 60000).toISOString() },
    { id: 'r2_o5', restaurantId: 'rest_2', tableId: 'r2_t6', tableNumber: 6, customerName: 'Aiko', items: [{ menuItemId: 'i18', name: 'Gyoza', price: 9.99, quantity: 2 }, { menuItemId: 'i33', name: 'Yuzu Lemonade', price: 6.99, quantity: 1 }], status: 'paid', subtotal: 26.97, tax: 2.16, total: 29.13, createdAt: new Date(now - 80 * 60000).toISOString(), updatedAt: new Date(now - 60 * 60000).toISOString() },
];

// ── Staff ──────────────────────────────────────────────
export const MOCK_STAFF: Staff[] = [
    { id: 'staff_1', restaurantId: 'rest_1', name: 'Giovanni Rossi', role: 'owner', email: 'giovanni@labellaitalia.com' },
    { id: 'staff_2', restaurantId: 'rest_1', name: 'Maria Bianchi', role: 'kitchen', pin: '1234' },
    { id: 'staff_3', restaurantId: 'rest_2', name: 'Tanaka Yuto', role: 'owner', email: 'yuto@sakuragarden.com' },
    { id: 'staff_4', restaurantId: 'rest_2', name: 'Sato Mei', role: 'kitchen', pin: '5678' },
];

// ── Lookup Functions ───────────────────────────────────
export function getRestaurant(id: string): Restaurant | undefined {
    return RESTAURANTS.find((r) => r.id === id);
}

export function getMenu(restaurantId: string): { categories: Category[]; items: MenuItem[] } {
    return {
        categories: CATEGORIES.filter((c) => c.restaurantId === restaurantId).sort((a, b) => a.sortOrder - b.sortOrder),
        items: MENU_ITEMS.filter((i) => i.restaurantId === restaurantId),
    };
}

export function getOrders(restaurantId: string): Order[] {
    return MOCK_ORDERS.filter((o) => o.restaurantId === restaurantId);
}

export function getTables(restaurantId: string): Table[] {
    return MOCK_TABLES.filter((t) => t.restaurantId === restaurantId);
}

export function getStaff(restaurantId: string): Staff[] {
    return MOCK_STAFF.filter((s) => s.restaurantId === restaurantId);
}

export function getPromoCode(code: string): PromoCode | undefined {
    return PROMO_CODES.find(
        (p) => p.code.toUpperCase() === code.toUpperCase().trim() && p.isActive
    );
}

export function getDashboardStats(restaurantId: string): DashboardStats {
    const orders = getOrders(restaurantId);
    const active = orders.filter((o) => o.status === 'new' || o.status === 'accepted' || o.status === 'preparing');
    return {
        todayRevenue: orders.reduce((s, o) => s + o.total, 0),
        totalOrders: orders.length,
        activeOrders: active.length,
        avgCompletionTime: 14,
    };
}
