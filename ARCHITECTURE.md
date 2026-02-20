# QR Restaurant SaaS – Deep Architecture Analysis

## 1. Project Overview
Multi-tenant QR ordering SaaS built on Expo Router. Three personas share the same codebase but have completely isolated flows:
- **Guest** – scans QR, browses menu, orders, tracks live
- **Owner** – admin dashboard, menu & table management, analytics
- **Kitchen** – KDS (Kitchen Display System) with PIN login

## 2. High-Level Flow
**New Owner Flow:**
`Register → Login → Onboarding Wizard → Dashboard`

**Guest Flow:**
`QR / Manual Entry → Guest Session → Menu → Cart (Promo) → Order → Kitchen Queue → Owner Dashboard`

- Deep-link: `qrmenu://restaurant/{id}/table/{n}`
- Order status pipeline: `new → accepted → preparing → ready → served → paid`

## 3. Directory Structure (src-root)
```
app/
├── _layout.tsx               – Root: ThemeProvider + SessionProvider
├── index.tsx                 – Entry redirect logic (incl. onboarding)
├── (auth)/                   – Owner login + register
├── (guest)/                  – 5 screens: scan, entry, menu, cart, tracking
├── (owner)/                  – 6 screens: onboarding + 5 tabs (dashboard, etc.)
└── (kitchen)/                – 2 screens: PIN login, KDS queue

components/shared/            – Reusable UI (status badges, cards, pills)
constants/                    – Theme tokens, status maps, color generation
context/                      – ThemeContext + SessionContext
services/                     – Mock data (incl. promo codes)
store/                        – Zustand slices (auth, cart, orders, restaurant)
types/                        – TypeScript enums & interfaces
```

## 4. Navigation Architecture
**`index.tsx`** decides first screen:
- Authenticated owner & `isSetupComplete: false` → `/(owner)/onboarding`
- Authenticated owner & `isSetupComplete: true` → `/(owner)/dashboard`
- Active guest session → `/(guest)/menu`
- Else → `/(auth)/login`

**Route Groups:**
- `(auth)` – Stack (login, register)
- `(guest)` – Stack (scan → entry → menu → cart → tracking)
- `(owner)` – Tabs layout with a hidden `onboarding` screen
- `(kitchen)` – Stack (login-PIN → display)

## 5. Data Layer
**services/mockData.ts** now exports `PROMO_CODES` and a `getPromoCode` helper.

**Native Capabilities:**
- `expo-image-picker`: Used in onboarding and settings for logo upload.
- `react-native-view-shot` & `expo-sharing`: Capture QR code component as a shareable PNG.
- `expo-haptics` & `expo-audio`: Provide sound/vibration feedback for new orders.

## 6. State Management (Zustand)
| Store | Key State & New Features | Persistence |
|---|---|---|
| `authStore` | `user: OwnerUser \| null` | SecureStore |
| `cartStore` | `items`, `restaurantId`, **`appliedPromo`**, **`promoError`** | AsyncStorage |
| `orderStore` | `orders`, **`updateOrderStatus(id, status, waitTime)`** | AsyncStorage |
| `restaurantStore` | `restaurant`, `menuItems`, `tables`, **`staff`**, **`addStaff()`**, **`removeStaff()`** | AsyncStorage |

**State Flow Example (Owner Onboarding):**
1. New owner registers, `isSetupComplete` is `false`.
2. `index.tsx` redirects to `/(owner)/onboarding`.
3. Wizard collects info, logo, colors, menu, tables.
4. Final step calls `updateRestaurant()` in `restaurantStore` to set `isSetupComplete: true` and save data.
5. User is redirected to the dashboard.

## 7. Theming System
- **Dynamic Theme Generation:** In settings and onboarding, `expo-image-picker` gets a logo, `react-native-image-colors` extracts colors, and `generateThemeFromColors` creates a live theme preview. The `updateRestaurant` action in `restaurantStore` persists the new theme.

## 8. Component Architecture
- **Modals:** Used for adding staff (in Settings) and setting estimated wait times (in Dashboard).
- **`ViewShot`:** Wraps the QR code component in `(owner)/tables.tsx` to enable capturing.

## 9. Code Quality & Patterns
- **Typed Routes:** The redirect to `/onboarding` in `index.tsx` required casting `as any` because Expo's typed routes had not yet been regenerated. This is a temporary workaround.
- **Error Handling:** API calls (e.g., `getColors`, `Sharing.shareAsync`) are wrapped in `try/catch` blocks with user-facing `Alert`s.

## 10. Known Gaps & Next Steps
- Real backend integration (Supabase, Firebase, or custom)
- **Staff PIN reset/edit flow** (generation is now implemented)
- Push notifications for order status
- Offline queue + sync when network returns
- Accessibility (screen-reader labels, contrast checks)
- E2E tests with Detox

## 11. Quick Sanity Checklist
✅ Onboarding flow works and correctly redirects  
✅ QR codes can be downloaded/shared  
✅ Logo upload correctly extracts and applies theme  
✅ Promo codes apply discounts correctly in cart  
✅ Sound/haptics trigger for new orders (and can be muted)  
✅ Estimated wait times can be set and are displayed to guests  
✅ Staff can be added and removed from settings  

---
**Conclusion:** The app has reached a feature-complete state for its initial scope. The architecture supports all core user stories, from guest ordering to owner administration. The next milestone remains connecting a real backend. 
