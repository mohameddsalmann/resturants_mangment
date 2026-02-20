# QR Menu SaaS (Expo Router)

Multi-tenant QR ordering platform with three roles: Guest (customer), Owner (admin), and Kitchen (KDS). Built with Expo Router, Zustand stores, and per-restaurant theming.

## Stack
- Expo Router (file-based navigation)
- Zustand + AsyncStorage persistence
- **New:** `expo-image-picker` for logo uploads
- **New:** `react-native-view-shot` + `expo-sharing` for QR codes
- **New:** `expo-haptics` + `expo-audio` for order alerts
- React Native SVG + `react-native-qrcode-svg`

## Features by Role
**Guest**
- QR scanning or manual entry (`qrmenu://restaurant/{id}/table/{n}`)
- Table/name session capture, dynamic restaurant theme
- Menu search, category filter, dietary tags, add-to-cart
- Cart with quantity, notes, **promo codes**, and tax/total calculation
- Order placement and live tracking with **estimated wait times**

**Owner**
- **Onboarding wizard** for first-time setup (info, logo, hours, menu, tables)
- Dashboard KPIs, **sound/vibration alerts** (with mute), and order actions
- Ability to set **estimated wait time** per order
- Menu management (category browse, item availability toggle)
- Tables view with status pills and **QR code download/share**
- Settings: **logo upload with auto-color extraction**, theme customization, and **staff management (add/remove)**
- Analytics (SVG bar charts: daily revenue, top items, peak hours)

**Kitchen**
- PIN login per restaurant (4-digit)
- KDS queue with timers, overdue highlighting, and one-tap status advance
- **Sound/vibration alerts** for new orders (with mute toggle)

## Routing Map
- `app/_layout.tsx` wraps `ThemeProvider` + `SessionProvider`
- `app/index.tsx` redirects based on role and **setup completion**
- `(auth)/login`, `(auth)/register`
- `(guest)/` scan, entry, menu, cart, tracking
- `(owner)/` **onboarding**, dashboard, menu-manage, tables, settings, analytics
- `(kitchen)/` login, display (Stack)

## Data & Theming
- `services/mockData.ts` — includes restaurants, menus, tables, staff, orders, and **promo codes**
- `constants/theme.ts` — `generateThemeFromColors`, `STATUS_COLORS`
- `context/ThemeContext.tsx` — per-restaurant ThemeColors
- `context/SessionContext.tsx` — guest session (restaurantId, tableNumber, customerName)

## State Stores (Zustand)
- `store/authStore.ts` — owner-only auth with `restaurantId`
- `store/cartStore.ts` — multi-restaurant cart, tax-aware, with **promo code logic**
- `store/orderStore.ts` — placeOrder, update status, and **set estimated wait time**
- `store/restaurantStore.ts` — CRUD for menu/tables, **staff management (add/remove)**, and theme updates

## Project Structure
- `app/` — Expo Router routes grouped by role
- `components/` — shared UI components and role-specific UI
- `constants/` — theme tokens & status colors
- `context/` — theme + session providers
- `services/` — mock data helpers
- `store/` — Zustand slices

## Setup
```bash
npm install
```

## Run
```bash
npx expo start
```
- Metro selects a free port automatically. Scan the QR with Expo Go or run web at the shown URL.

## Deep Links
- Scheme: `qrmenu`
- Example: `qrmenu://restaurant/rest_1/table/3`

## Notes
- Mock PINs: rest_1 → `1234`, rest_2 → `5678` (kitchen login)
- Mock owner login accepts any email/password; restaurant defaults to `rest_1`
