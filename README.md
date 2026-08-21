# 💼 BillEase — Modern Billing & Invoice Management Platform

[![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.0-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.25.0-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)](https://ant.design/)
[![Firebase](https://img.shields.io/badge/Firebase-11.3.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)

A full-featured, enterprise-grade Billing, Invoicing, Customer, and Product Management System built with **React 19**, **Vite**, **Ant Design 5**, **Redux Toolkit / RTK Query**, and **Firebase**. Engineered for speed, clean architecture, responsive navigation, and seamless state persistence.

---

## 🌟 Key Features

### 📑 1. Smart Invoice Management
- **Interactive Invoice Builder**: Create dynamic multi-item invoices with live subtotal, tax, discount, and grand total calculations.
- **Invoice Overview & Analytics**: Real-time status breakdown (Paid, Pending, Overdue, Draft) with interactive metric cards.
- **Detailed Invoice Preview**: Modal view of invoices with quick print/download support and customer details.
- **Search & Filter**: Real-time multi-criteria filtering by invoice ID, customer name, date range, and payment status.

### 👥 2. Customer & Client Directory
- **Customer CRM**: Centralized customer records with payment history, status tags, and contact metadata.
- **Quick Onboarding Modal**: Add new clients on-the-fly directly inside workflows (invoicing, quotation, etc.).
- **Blacklist Management**: Integrated Blacklist API to protect businesses against delinquent accounts.

### 🏷️ 3. Offers & Quotations
- **Quotation Generator**: Create customized quotations with expiry dates, custom terms, and currency selection.
- **Status Lifecycle**: Track quotations through Draft, Sent, Accepted, and Declined states.

### 📦 4. Product Catalog & Categories
- **Inventory & Pricing**: Manage product stock, pricing, revenue categories, and tax classes.
- **Reusable Forms**: Streamlined product creation and editing modals with validation and automatic category fetching.

### 🔐 5. Authentication & State Persistence
- **Firebase Auth & Session Management**: Secure login flow with persistent credentials and error alerting.
- **Redux Persist**: Persistent client UI settings (sidebar state, theme, session tokens) across browser refreshes.
- **RTK Query Caching**: High-performance data fetching with automated tag-based cache invalidation for zero stale data.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite 8 (ESM, HMR) |
| **UI & Styling** | Ant Design 5, Lucide React, Ant Design Icons, Custom Theme Engine |
| **State Management** | Redux Toolkit, RTK Query (Multi-Endpoint APIs), Redux Persist |
| **Routing** | React Router DOM v7 (Nested Layouts, Protected Routes) |
| **Backend & Auth** | Firebase 11 (Authentication, Cloud Firestore) |
| **Date & Formatting** | Day.js |
| **Code Quality** | Oxlint, Vite Production Optimizer |

---

## 📂 Project Structure

```
BILLING-PROJECT-USING-MODEL/
├── src/
│   ├── assets/                 # Static images, logos, and SVGs
│   ├── components/
│   │   ├── common/             # Reusable UI primitives (Button, Input, Badge, EmptyState)
│   │   ├── invoices/           # Invoice statistics, cards, detail modal
│   │   ├── layout/             # DashboardLayout, Header, PageHeader, Sidebar
│   │   │   └── sidebar/        # Modular SidebarNav, SidebarBrand, SidebarProfile
│   │   ├── offers/             # Quotation modals and offer management
│   │   ├── products/           # Product forms and inventory components
│   │   ├── table/              # Universal DataTable with Ant Design Table wrappers
│   │   ├── Modal.jsx           # Reusable generic Modal wrapper
│   │   └── CardComponent.jsx   # Generic Card wrapper
│   ├── firebase/               # Firebase app initialization and auth config
│   ├── hooks/                  # Custom hooks (useConfirmNavigation, useLocalStorage)
│   ├── pages/                  # Route views (Invoices, Customers, Products, Offers, Contact, Login)
│   ├── redux/
│   │   ├── api/                # RTK Query API slices (api.js, blackListApi.js)
│   │   ├── slices/             # Redux UI & application state slices
│   │   └── store.js            # Central Redux store configuration with redux-persist
│   ├── utils/                  # Helper functions and API response normalizers
│   ├── App.jsx                 # Route definitions and application shell
│   └── main.jsx                # Application root with Redux & AntD Config Providers
├── public/                     # Public assets
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Talalilyas1208/billing-project-using-models.git
   cd billing-project-using-models
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment / Firebase:**
   Verify or update your Firebase configuration in [src/firebase/config.js](file:///Users/mac/Documents/BILLING-PROJECT-USING-MODEL/src/firebase/config.js).

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📊 Available Pages & Routes

- `/` / `/invoices` — Complete Invoice overview, metrics, and search
- `/new-invoice` — Interactive invoice creation with dynamic item rows
- `/customers` — Customer management, activity status, and blacklist verification
- `/products` — Product catalog, stock levels, and revenue categorization
- `/offers` — Quotations and proposal management
- `/contact` — Client messaging, feedback, and support channel
- `/login` — Secure Firebase-backed authentication portal

---

## 🎨 UI/UX Highlights
- **Fluid Layout**: Collapsible modern dark-sidebar with smooth transitions and persistent state.
- **Consistent Design System**: Unified color palette (`#4f46e5` indigo theme), standardized status badges, responsive tables, and custom loading/empty states.
- **Optimistic UI Updates**: Instant feedback on client actions paired with background synchronization.

---

## 👤 Author

**Talal Ilyas**
- GitHub: [@Talalilyas1208](https://github.com/Talalilyas1208)
- Repository: [billing-project-using-models](https://github.com/Talalilyas1208/billing-project-using-models)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
