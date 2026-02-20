# Manual Testing Guide

Smoke test flows for all three user roles. Run these in order — each flow depends on data created by the previous one.

---

## Prerequisites

```bash
npm install
npx expo start
```

Use **Expo Go** (Android/iOS) or the **web preview** at `http://localhost:8082`.  
Reset state between full runs: clear app data / AsyncStorage in device settings.

---

## Flow 1 — Owner: Registration & Onboarding

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app | Redirected to `/login` |
| 2 | Tap "Create account" | Register screen appears |
| 3 | Enter name, email, password → Register | Redirected to `/onboarding` (Step 1) |
| 4 | Fill restaurant name, address, phone, cuisine → Next | Step 2 appears |
| 5 | Tap logo area → pick image | Image picker opens; photo selected |
| 6 | After pick | Colors auto-extracted; primary/accent fields populate; preview bar updates |
| 7 | Next → Step 3 | Operating hours screen |
| 8 | Confirm hours → Next | Step 4: Add first menu item |
| 9 | Enter item name, price → Next | Step 5: Table setup |
| 10 | Set table count (e.g. 5) → Finish | Redirected to `/dashboard` |
| 11 | On dashboard | Restaurant name shown in header; 4 stat cards visible |

**Pass criteria:** Dashboard loads with correct restaurant name, no blank screens, no crashes.

---

## Flow 2 — Owner: Dashboard & Order Management

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as owner | Dashboard visible |
| 2 | Observe stat cards | Revenue, Orders, Active, Avg Time all show values |
| 3 | Tap **New** tab | Shows only orders with status `new` |
| 4 | Tap action button on a `new` order → Accept | Order status changes to `accepted` |
| 5 | Continue advancing → Preparing → Ready → Served → Paid | Status chip updates at each step |
| 6 | Tap ⏱ `Xm` chip on an order | Modal opens with number input |
| 7 | Enter `20` → Save | Chip now reads `20m` |
| 8 | Tap 🔊 mute icon | Icon switches to 🔇; label confirms muted |
| 9 | Tap 🔇 again | Unmuted; 🔊 restored |

**Pass criteria:** Order pipeline advances correctly; wait time modal saves; mute toggle persists for session.

---

## Flow 3 — Owner: Tables & QR Codes

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to **Tables** tab | Grid of table cards, status pills visible |
| 2 | Check summary pills | Available / Occupied / Reserved counts are accurate |
| 3 | Tap any table card | Detail panel slides open |
| 4 | Tap **Show QR** | QR code renders with restaurant name above and table number below |
| 5 | Tap **Download / Share** | Native share sheet appears with QR image attached |
| 6 | Dismiss share sheet | Return to tables screen |
| 7 | Tap **Print All QR** (header) | Full-screen modal opens with all tables in a grid |
| 8 | Tap **Download / Share Sheet** | "Capturing…" label briefly; native share sheet opens with composite PNG |

**Pass criteria:** Single QR and batch QR sheet both share successfully as PNG.

---

## Flow 4 — Owner: Settings (Logo, Theme, Staff)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to **Settings** tab | Settings screen with restaurant info, Logo & Theme, Kitchen Staff, Account |
| 2 | Tap logo thumbnail | Image picker opens |
| 3 | Pick a colorful image | Primary and accent color inputs auto-populate; preview bar changes color |
| 4 | Manually edit a hex color | Preview bar updates in real time |
| 5 | Tap **Apply Theme** | Alert "Theme Updated"; card closes |
| 6 | Tap **Add Kitchen Staff** | Modal opens with name input |
| 7 | Enter name → Add | Alert shows name + generated PIN (e.g. `PIN: 4821`) |
| 8 | New staff member appears in list | Name + PIN visible |
| 9 | Tap trash icon on a staff member | Confirm alert; after confirm, removed from list |

**Pass criteria:** Theme persists after navigation away and back; staff list updates immediately.

---

## Flow 5 — Guest: Scan → Order → Track

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | On login screen, tap "Scan QR" | Camera opens |
| 2 | Scan a table QR (or use deep link `qrmenu://restaurant/rest_1/table/3`) | Entry screen loads with restaurant branding |
| 3 | Enter customer name (required) + optional phone → Confirm | Menu screen loads with restaurant theme |
| 4 | Observe menu | Category pills visible; menu items load with images, prices, tags |
| 5 | Search for an item | Results filter correctly |
| 6 | Tap an unavailable item | Greyed-out overlay; add button disabled |
| 7 | Tap an available item → Add to Cart | Cart badge increments |
| 8 | Add 2 more items | Badge shows correct count |
| 9 | Tap cart badge | Cart screen opens |
| 10 | Adjust quantity with +/- | Subtotal updates |
| 11 | Tap remove (trash) on an item | Item removed; subtotal recalculates |
| 12 | Add special instructions to an item | Text field accepts input |
| 13 | Enter promo code `SAVE20` → Apply | Discount row appears: `-20%`; total reduces |
| 14 | Tap × on applied promo | Discount removed; total reverts |
| 15 | Tap **Place Order** | Alert: "Order Placed!" with order ID |
| 16 | Tap **Track Order** | Tracking screen; progress bar at `new` step |
| 17 | Wait time shown | `~X min` displayed below active step |

**Pass criteria:** Full guest order flow from scan to tracking without errors. Promo code reduces total correctly.

---

## Flow 6 — Kitchen: PIN Login & KDS

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to kitchen login (link on owner login, or navigate directly) | PIN pad visible |
| 2 | Select restaurant `rest_1` | Restaurant selected |
| 3 | Enter correct PIN `1234` | Redirected to KDS display |
| 4 | Observe order placed in Flow 5 | Card visible under **New** tab with correct table number, customer name, items |
| 5 | Check elapsed timer | Shows time since order was placed |
| 6 | Tap **Start Preparing** | Status advances to `preparing`; card moves to Preparing tab |
| 7 | Tap **Mark Ready** | Status advances to `ready` |
| 8 | Tap 🔊 mute | Icon switches to 🔇 |
| 9 | Place another order (from guest flow) | No sound/vibration while muted |
| 10 | Unmute | New orders trigger sound and haptic again |
| 11 | Leave an order > 15 min | Card border turns red with "OVERDUE" label |

**Pass criteria:** KDS reflects orders from guest flow in real time; status advances correctly; mute works.

---

## Flow 7 — Owner: Verify Kitchen Updates in Dashboard

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Return to owner dashboard (logged in concurrently or re-login) | Dashboard order list reflects status updates made in kitchen |
| 2 | Order advanced to `ready` in kitchen | Dashboard shows `ready` status for that order |
| 3 | Owner taps **Mark Served** | Status becomes `served` |
| 4 | Owner taps **Mark Paid** | Order disappears from "All" tab (status = `paid`) |

**Pass criteria:** Status changes in kitchen are visible in owner dashboard; full pipeline completes end-to-end.

---

## Regression Checks

Run these after any change to stores or routing:

- [ ] Cart clears after placing an order
- [ ] Guest session ends after `endSession()` is called
- [ ] Navigating to `/` while logged in as owner redirects to `/dashboard`
- [ ] Navigating to `/` with incomplete setup redirects to `/onboarding`
- [ ] Navigating to `/` with active guest session redirects to `/menu`
- [ ] Deep link `qrmenu://restaurant/rest_2/table/5` loads the correct restaurant theme
- [ ] Promo code `WELCOME10` applies a 10% discount; `SUMMER15` applies 15%
- [ ] Invalid promo code shows inline error, does not crash
- [ ] Staff added in Settings survives a navigation round-trip (Zustand persistence)
