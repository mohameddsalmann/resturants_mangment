<div align="center">

  <h1>🍽️ QResto: The Future of Dining</h1>
  
  <p>
    <strong>A production-grade, multi-tenant QR ordering platform built with modern React Native & Expo.</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#screens">Screens</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>

  [![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🚀 Overview

**QResto** is a comprehensive SaaS solution designed to modernize the restaurant experience. It eliminates the friction of traditional ordering by allowing guests to scan, order, and pay directly from their phones, while providing restaurant owners with powerful tools to manage their business and kitchens with a real-time display system.

Unlike simple ordering apps, QResto is architected as a **multi-tenant system**, supporting multiple restaurants with distinct themes, menus, and staff within a single application codebase.

## ✨ Key Features

### 👤 For Guests (The Dining Experience)
*   **Instant Access**: Scan a QR code or use a deep link (`qrmenu://restaurant/{id}/table/{n}`) to instantly access the menu.
*   **Dynamic Theming**: The app automatically adapts its color scheme to match the restaurant's branding.
*   **Smart Ordering**:
    *   Browse categories and search for items.
    *   Customize orders with notes and dietary preferences.
    *   Apply **promo codes** for discounts.
*   **Real-Time Tracking**: Track order status live from "Preparing" to "Served" with estimated wait times.

### 🏢 For Restaurant Owners (The Admin Powerhouse)
*   **Onboarding Wizard**: A guided setup flow to configure the restaurant profile, hours, and initial menu.
*   **Brand Identity**: Upload a logo and let the app **automatically extract key colors** to generate a unique theme.
*   **QR Generation**: Generate and share custom QR codes for specific tables directly from the app.
*   **Dashboard & Analytics**: Visualize daily revenue, top-selling items, and peak hours with interactive SVG charts.
*   **Staff Management**: invite and manage kitchen staff access.

### 👨‍🍳 For the Kitchen (The KDS)
*   **Kitchen Display System (KDS)**: A dedicated interface for kitchen staff to view incoming orders.
*   **Ticket Management**:
    *   **Sound & Haptic Alerts**: Never miss an order with audible notifications and vibrations.
    *   **Timers**: Track how long an order has been waiting.
    *   **Status Updates**: Move orders through the pipeline (New → Preparing → Ready) with a single tap.

## 📱 Screens

| Reception / Menu | Cart / Ordering | Order Tracking |
|:---:|:---:|:---:|
| <img src="docs/menu.png" width="200" alt="Restaurant Menu" /> | <img src="docs/cart.png" width="200" alt="Cart" /> | <img src="docs/tracking.png" width="200" alt="Tracking" /> |

| Owner Dashboard | Analytics | Kitchen Display |
|:---:|:---:|:---:|
| <img src="docs/dashboard.png" width="200" alt="Owner Dashboard" /> | <img src="docs/analytics.png" width="200" alt="Analytics" /> | <img src="docs/kds.png" width="200" alt="Kitchen Display System" /> |

> *Note: These are placeholders. Please add screenshots to a `docs` folder to showcase the UI.*

## 🛠️ Tech Stack

This project leverages the bleeding edge of the React Native ecosystem to deliver a high-performance, native-feeling experience.

| Category | Technology | Why it was chosen |
|----------|------------|-------------------|
| **Core** | **React Native + Expo** | Cross-platform (iOS/Android/Web) from a single codebase. |
| **Navigation** | **Expo Router (v3/v4)** | File-based routing for a scalable and intuitive navigation structure. |
| **State** | **Zustand** | Lightweight, boilerplate-free state management for complex flows. |
| **Styling** | **NativeWind (Tailwind)** | Rapid UI development with utility classes and consistent design tokens. |
| **Persistence** | **AsyncStorage** | Robust local data persistence for offline-first capabilities. |
| **Animations** | **Moti + Reanimated** | fluid, 60fps animations for a premium feel. |
| **Hardware** | **Expo Camera & Haptics** | Deep device integration for scanning and tactile feedback. |
| **Charts** | **React Native SVG** | High-performance, custom data visualization. |

## 🏗️ Architecture

The project follows a **domain-driven, modular architecture** designed for scalability and maintainability.

```
src/
├── app/                  # Expo Router file-based routing
│   ├── (auth)/           # Authentication stack
│   ├── (guest)/          # Guest ordering flow
│   ├── (owner)/          # Admin dashboard & management
│   └── (kitchen)/        # Kitchen display system
├── components/           # Atomic UI components
├── context/              # Global providers (Theme, Session)
├── services/             # API & Business Logic abstraction
└── store/                # Zustand slices for state management
```

### Key Architectural Decisions
1.  **Role-Based Access Control (RBAC)**: The app structure is split into distinct route groups (`(guest)`, `(owner)`, `(kitchen)`) to ensure complete separation of concerns and security.
2.  **Optimistic UI Updates**: State changes (like placing an order) update the UI immediately for a snappy feel, while syncing in the background.
3.  **Atomic Design System**: A comprehensive library of reusable components (Buttons, Cards, Badges) ensures UI consistency across all roles.

## 🏁 Getting Started

Pre-requisites: Node.js and npm/yarn installed.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/qresto.git
    cd qresto
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the app**
    ```bash
    npx expo start
    ```

4.  **Explore the Flows**
    *   **Guest**: Scan the QR code with your phone or use the simulated deep link.
    *   **Owner**: Log in (default: `owner@example.com` / `password`) to access the dashboard.
    *   **Kitchen**: Use the PIN `1234` (for Restaurant 1) to access the KDS.

For detailed testing scenarios and manual QA scripts, please refer to [TESTING.md](./TESTING.md).

## 🔮 Future Roadmap

*   [ ] **Backend Integration**: Migrate from local mock data to a scalable backend (Supabase/Firebase).
*   [ ] **Payment Gateway**: Integration with Stripe for in-app payments.
*   [ ] **AI Recommendations**: Machine learning model to suggest items based on order history.
*   [ ] **Offline Mode**: rigorous offline support with background sync.

---

<p align="center">
  Built with ❤️ by mohamed salman
</p>
