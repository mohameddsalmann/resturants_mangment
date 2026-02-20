# Screen Requirements

Per-screen specification: purpose, components, data sources, and navigation flows.

---

## 1. Auth Screens

### `(auth)/login.tsx`
**Purpose:** Owner login gateway. Also surfaces entry points for guests and kitchen staff.  
**Components:** `GlassInput` (email, password), `GlassButton` (Login), guest scan link, kitchen PIN link.  
**Data:** `useAuthStore.login(email, password)` — sets `user` and `isAuthenticated`.  
**Navigation:**
- Success → `/(owner)/dashboard` (or `/(owner)/onboarding` if `isSetupComplete: false`)
- Guest link → `/(guest)/scan`
- Kitchen link → `/(kitchen)/login`

---

### `(auth)/register.tsx`
**Purpose:** Owner account creation.  
**Components:** `GlassInput` (name, email, password), `GlassButton` (Register).  
**Data:** `useAuthStore.register(name, email, password)` — creates owner user with default `restaurantId`.  
**Navigation:** Success → `/(owner)/onboarding`

---

## 2. Guest Screens

### `(guest)/scan.tsx`
**Purpose:** Entry point for customers. Scans QR code or accepts a manual fallback deep link.  
**Components:** `expo-camera` barcode scanner, manual entry fallback button.  
**Data:** Parses `qrmenu://restaurant/{id}/table/{n}` deep link. Calls `SessionContext.startSession`.  
**Navigation:** Success → `/(guest)/entry`

---

### `(guest)/entry.tsx`
**Purpose:** Collects customer identity before showing the menu.  
**Components:** Restaurant logo + name (from theme), `TextInput` (name, optional phone), primary button.  
**Data:** `SessionContext` provides `restaurantId` and `tableNumber`. `ThemeContext` provides brand colors.  
**Navigation:** Confirm → `/(guest)/menu`

---

### `(guest)/menu.tsx`
**Purpose:** Full restaurant menu browser.  
**Components:** `CategoryPills`, `MenuItemCard` (image, name, price, dietary tags, availability overlay), search bar, floating cart badge.  
**Data:** `getMenu(restaurantId)` from `mockData`. `useCartStore` for cart item count badge.  
**Navigation:** Cart badge → `/(guest)/cart`

---

### `(guest)/cart.tsx`
**Purpose:** Order review, promo code application, and order placement.  
**Components:** `FlatList` of cart items with qty `+/-`, remove button, special-instructions input. Promo code row (input + Apply button / green applied pill). Order summary: subtotal, discount, tax, total. Place Order button.  
**Data:** `useCartStore` (items, subtotal, tax, total, appliedPromo, applyPromoCode, removePromoCode). `useOrderStore.placeOrder`.  
**Navigation:** Place Order → Alert → `/(guest)/tracking`

---

### `(guest)/tracking.tsx`
**Purpose:** Live order status tracking with progress steps and estimated wait time.  
**Components:** Progress step list (New → Accepted → Preparing → Ready → Served), estimated wait badge below active step, order items summary, total.  
**Data:** `useOrderStore` — polls `orders` for matching `tableId`. `Order.estimatedWaitMinutes`.  
**Navigation:** "Order More" → `/(guest)/menu`

---

## 3. Owner Screens

### `(owner)/onboarding.tsx` *(hidden tab — first-run only)*
**Purpose:** Multi-step wizard for new restaurant setup.  
**Steps:**
1. Restaurant info (name, address, phone, cuisine, hours)
2. Logo upload → auto color extraction → live theme preview
3. Operating hours confirmation
4. First menu item creation
5. Table count setup + QR preview per table

**Data:** `useRestaurantStore.updateRestaurant`, `expo-image-picker`, `react-native-image-colors`, `generateThemeFromColors`.  
**Navigation:** Finish → `/(owner)/dashboard` (sets `isSetupComplete: true`)

---

### `(owner)/dashboard.tsx`
**Purpose:** Operational hub for the owner — live orders, KPIs, and status management.  
**Components:** 4 `StatCard`s (revenue, orders, active, avg time), filter tabs (All / New / Preparing / Ready), `OrderCard` list with action buttons, `⏱ Xm` wait-time chip per order, mute toggle (🔊/🔇), logout button.  
**Data:** `useOrderStore.orders`, `getDashboardStats`, `useOrderStore.updateOrderStatus`. `expo-haptics` + `expo-audio` trigger on new order arrival.  
**Navigation:** Order action buttons mutate status in `orderStore` (reflected in kitchen display in real time).

---

### `(owner)/menu-manage.tsx`
**Purpose:** Full menu CRUD for the owner.  
**Components:** Category list, `MenuItemCard` with availability toggle, add/edit item forms.  
**Data:** `useRestaurantStore` (categories, menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability).  
**Navigation:** Tab-bar accessible from owner layout.

---

### `(owner)/tables.tsx`
**Purpose:** Table status overview with per-table and batch QR management.  
**Components:** Status summary pills (available / occupied / reserved), `TableCard` grid, detail panel (status badge, active order summary, QR panel with `ViewShot` capture). **"Print All QR"** button → full-screen modal with all tables in a `ViewShot` grid → **"Download / Share Sheet"** button exports composite PNG.  
**Data:** `useRestaurantStore.tables`, `useOrderStore.orders`, `expo-sharing`.  
**Navigation:** Tab-bar.

---

### `(owner)/settings.tsx`
**Purpose:** Restaurant configuration, branding, and team management.  
**Sections:**
- **Restaurant Info** — name, address, phone, hours, tax rate (read-only display)
- **Logo & Theme** — logo picker (`expo-image-picker`) → color extraction (`react-native-image-colors`) → manual hex inputs → live preview bar → Apply Theme
- **Kitchen Staff** — list with name + PIN; remove button (confirm alert); Add modal with name input → auto-generated 4-digit PIN
- **Account** — logged-in email, Logout button

**Data:** `useRestaurantStore` (updateRestaurant, staff, addStaff, removeStaff). `useAuthStore.logout`.  
**Navigation:** Tab-bar.

---

### `(owner)/analytics.tsx`
**Purpose:** Business intelligence with SVG charts.  
**Components:** Daily revenue bar chart, top-selling items list, peak hours distribution chart.  
**Data:** `getDashboardStats(restaurantId)` from `mockData`.  
**Navigation:** Tab-bar.

---

## 4. Kitchen Screens

### `(kitchen)/login.tsx`
**Purpose:** PIN-based authentication for kitchen staff.  
**Components:** Restaurant selector, 4-digit PIN pad.  
**Data:** `getStaff(restaurantId)` — matches PIN to staff record.  
**Navigation:** Correct PIN → `/(kitchen)/display`

---

### `(kitchen)/display.tsx`
**Purpose:** Full-screen KDS (Kitchen Display System) for order queue management.  
**Components:** Filter tabs (All / New / Preparing / Ready) with count badges, order cards (table number, customer name, item list with special instructions, elapsed timer with overdue highlight >15 min), one-tap status advance button. Mute toggle in header.  
**Data:** `useOrderStore.orders` (merged with mock orders). `expo-haptics` + `expo-audio` on new order arrival. 30-second tick interval for timer refresh.  
**Navigation:** Logout → `/(kitchen)/login`
