# 🚗 Vehicle-Hub (AutoHub) — Modern Car Marketplace

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

A lightweight, high-performance web-based vehicle marketplace application built for collaborative university development. **Vehicle-Hub (AutoHub)** allows buyers to search, filter, compare, save, and communicate with sellers in real-time, while providing sellers with a full dashboard, multi-step listing wizard, image uploads, and inventory status management.

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Team Feature Assignments](#team-feature-assignments)
- [Technology Stack](#technology-stack)
- [Database Architecture (Supabase)](#database-architecture-supabase)
- [Repository Layout](#repository-layout)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Supabase Setup](#supabase-setup)
  - [Running the Application](#running-the-application)
- [Environment Configuration](#environment-configuration)
- [API Reference & cURL Examples](#api-reference--curl-examples)
- [Git Workflow & Branching Strategy](#git-workflow--branching-strategy)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [End-to-End Verification](#end-to-end-verification)
- [License](#license)

---

## 🌟 Project Overview

**Vehicle-Hub (AutoHub)** uses **Supabase (Cloud PostgreSQL)** as its primary database layer, with an integrated local storage fallback for rapid development. This ensures production-grade relational data modeling, fast indexed search queries, and instant real-time sync.

### Key Capabilities

* **Buyers**: Browse & search vehicles with multi-facet filters, sort by price/year/mileage, view vehicle details with galleries, compare up to 4 vehicles side-by-side with spec diffs, add cars to persistent wishlists, and chat directly with sellers with unread notification badges.
* **Sellers**: Dedicated dashboard with listing statistics, 5-step vehicle creation wizard, multi-image upload via Multer, listing status toggles (`Available`, `Pending`, `Sold`), and real-time buyer inquiry management.
* **Administrators**: Moderate listings, manage user accounts, verify trusted sellers, and inspect marketplace statistics.

---

## 👥 Team Feature Assignments

| Member | Feature Domain | Git Branch | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Authentication & User Profiles** | `feature/auth` | JWT Auth, bcrypt password hashing, auth/role middlewares (`buyer`, `seller`, `admin`), profile edit, password change, `AuthContext`, `/login`, `/register`, `/profile`. |
| **Member 2** | **Seller Dashboard & Listing Management** | `feature/dashboard` | Vehicle CRUD, Multer multi-image upload, image serving (`/uploads`), 5-step listing wizard, status management (`Available`, `Pending`, `Sold`), `/seller/dashboard`, `/cars/:id`. |
| **Member 3** | **Real-Time Messaging & Notifications** | `feature/chat` | Socket.IO server & events, conversation & message schemas, message persistence, unread badge counter (`🔔`), live typing indicators, `/messages` chat interface. |
| **Member 4** | **Advanced Search, Filters, Compare & Wishlist** | `feature/search-compare` | Multi-facet filter engine, case-insensitive keyword search, sorting & pagination, persistent wishlist, 4-vehicle comparison matrix with highlight badges, `/cars`, `/wishlist`, `/cars/compare`. |

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **UI Library**: [React 18+](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`AuthContext`, `ChatContext`, `WishlistContext`, `CompareContext`)
- **HTTP Client**: Axios with JWT request interceptors

### Backend
- **Runtime**: [Node.js 18+ LTS](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) with local JSON fallback
- **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Real-Time Communication**: [Socket.IO 4.7+](https://socket.io/)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)

---

## 🗄 Database Architecture (Supabase)

The database schema is defined in [`server/supabase-schema.sql`](file:///Users/dilshanpasindu/Documents/GitHub/Vehicle-Hub/server/supabase-schema.sql):

* **`users`**: User records, hashed passwords, roles (`buyer`, `seller`, `admin`), `verified_seller` badge, and `wishlist` array.
* **`cars`**: Vehicle inventory, specifications, pricing, seller relationship, status (`Available`, `Pending`, `Sold`), and uploaded image URLs.
* **`conversations`**: Active buyer–seller conversations linked to specific vehicles.
* **`messages`**: Real-time chat messages with timestamps and read receipts.
* **`notifications`**: User event triggers and unread counter states.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download](https://nodejs.org/))
- **npm**: `v9.0.0` or higher
- **Supabase Account** (Optional for cloud DB; local JSON fallback works automatically)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Thumula99/Vehicle-Hub.git
   cd Vehicle-Hub
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Supabase Setup (Optional Cloud Database)
1. Create a new project in [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in Supabase and execute the contents of [`server/supabase-schema.sql`](file:///Users/dilshanpasindu/Documents/GitHub/Vehicle-Hub/server/supabase-schema.sql).
3. Copy your project URL and service role / anon key into `server/.env`.

### Running the Application

1. **Start the Backend Server** (Port `5001`):
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Client** (Port `3000`):
   ```bash
   cd ../client
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Configuration

### Backend (`server/.env`)
```env
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_vehicle_hub_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# Supabase (Optional)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

---

## 📡 API Reference & cURL Examples

### 1. Faceted Search & Filter
```bash
curl "http://localhost:5001/api/cars?keyword=Toyota&minPrice=4000000&maxPrice=9000000&fuelType=Hybrid&sort=price_asc&page=1&limit=10"
```

### 2. 4-Vehicle Comparison
```bash
curl "http://localhost:5001/api/cars/compare?ids=car-001,car-002"
```

### 3. Add to Wishlist
```bash
curl -X POST http://localhost:5001/api/users/me/wishlist/car-001 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## 🧪 Testing & Quality Assurance

```bash
cd server
npm test
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
