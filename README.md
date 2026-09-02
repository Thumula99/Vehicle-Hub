# 🚗 Vehicle-Hub (AutoHub) — Modern Car Marketplace

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
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
- [Repository Layout](#repository-layout)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Configuration](#environment-configuration)
- [API Reference & cURL Examples](#api-reference--curl-examples)
- [Data Storage & Schemas](#data-storage--schemas)
- [File Upload Architecture](#file-upload-architecture)
- [Real-Time Messaging Architecture](#real-time-messaging-architecture)
- [Git Workflow & Branching Strategy](#git-workflow--branching-strategy)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [End-to-End Verification](#end-to-end-verification)
- [License](#license)

---

## 🌟 Project Overview

**Vehicle-Hub (AutoHub)** is engineered as a zero-external-database system using structured JSON file persistence (`server/data/*.json`) with asynchronous `fs/promises` handlers. This eliminates complex database installation requirements while maintaining full ACID-like data reliability for university grading and local development.

### Key Capabilities

* **Buyers**: Register, log in, browse & search vehicles with multi-facet filters, sort by price/year/mileage, view vehicle details with galleries, compare up to 4 vehicles side-by-side, add cars to persistent wishlists, and chat directly with sellers with unread notification badges.
* **Sellers**: Dedicated dashboard with listing statistics, 5-step vehicle creation wizard, multi-image upload via Multer, listing status toggles (`Available`, `Pending`, `Sold`), and real-time buyer inquiry management.
* **Administrators**: Moderate listings, manage user accounts, verify trusted sellers, and inspect marketplace statistics.

---

## 👥 Team Feature Assignments

The project is divided into four cleanly isolated modules assigned to separate Git feature branches:

| Member | Feature Domain | Git Branch | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Authentication & User Profiles** | `feature/auth` | JWT Auth, bcrypt password hashing, auth/role middlewares (`buyer`, `seller`, `admin`), profile edit, password change, `AuthContext`, `/login`, `/register`, `/profile`. |
| **Member 2** | **Seller Dashboard & Listing Management** | `feature/dashboard` | Vehicle CRUD, Multer multi-image upload, image serving (`/uploads`), 5-step listing wizard, status management (`Available`, `Pending`, `Sold`), `/seller/dashboard`, `/cars/:id`. |
| **Member 3** | **Real-Time Messaging & Notifications** | `feature/chat` | Socket.IO server & events, conversation & message schemas, message persistence, unread badge counter (`🔔`), live typing indicators, `/messages` chat interface. |
| **Member 4** | **Advanced Search, Filters, Compare & Wishlist** | `feature/search-compare` | Multi-facet filter engine, regex keyword search, sorting & pagination, persistent wishlist in `users.json`, 4-vehicle side-by-side comparison matrix, `/cars`, `/wishlist`, `/cars/compare`. |

> Detailed task breakdown and checklists can be found in [TASK.md](file:///Users/dilshanpasindu/Documents/GitHub/Vehicle-Hub/TASK.md).

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **UI Library**: [React 18+](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`AuthContext`, `ChatContext`, `WishlistContext`)
- **HTTP Client**: Axios with JWT request interceptors

### Backend
- **Runtime**: [Node.js 18+ LTS](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Real-Time Communication**: [Socket.IO 4.7+](https://socket.io/)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **Persistence**: Flat-file JSON storage (`fs/promises`) with atomic write patterns

### Testing
- **Backend**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)
- **Frontend**: [React Testing Library](https://testing-library.com/)

---

## 📂 Repository Layout

```text
Vehicle-Hub/
├── client/                               # Next.js 14+ Frontend
│   ├── app/                              # App Router Pages
│   │   ├── (auth)/login/page.jsx         # Login Page
│   │   ├── (auth)/register/page.jsx      # Registration Page
│   │   ├── profile/page.jsx              # User Profile Management
│   │   ├── cars/page.jsx                 # Search & Filter Catalog
│   │   ├── cars/[id]/page.jsx            # Single Vehicle Details
│   │   ├── cars/compare/page.jsx         # 4-Vehicle Comparison
│   │   ├── seller/dashboard/page.jsx     # Seller Dashboard
│   │   ├── seller/create-listing/page.jsx# 5-Step Listing Wizard
│   │   ├── wishlist/page.jsx             # Buyer Wishlist
│   │   ├── messages/page.jsx             # Real-Time Chat Window
│   │   ├── admin/page.jsx                # Admin Panel
│   │   ├── layout.jsx                    # Root Layout & Nav
│   │   └── page.jsx                      # Homepage
│   ├── components/                       # Reusable UI Components
│   ├── context/                          # Auth, Chat, and Wishlist Contexts
│   ├── hooks/                            # Custom React Hooks
│   ├── services/                         # API Client & Services
│   ├── public/                           # Static Assets & Mock Images
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                               # Node.js + Express Backend
│   ├── controllers/                      # Route Logic Controllers
│   ├── middleware/                       # Auth, Role, Upload & Error Middlewares
│   ├── routes/                           # API Routes (/api/auth, /api/cars, etc.)
│   ├── sockets/                          # Socket.IO Event Handlers
│   ├── services/                         # JSON Flat-File Storage Service
│   ├── data/                             # JSON Database Files
│   │   ├── users.json
│   │   ├── cars.json
│   │   ├── messages.json
│   │   ├── conversations.json
│   │   └── notifications.json
│   ├── uploads/                          # Uploaded Vehicle Images
│   ├── tests/                            # Jest + Supertest Suites
│   ├── .env.example
│   ├── server.js                         # Express & Socket.IO Entrypoint
│   └── package.json
│
├── .gitignore
├── LICENSE
├── README.md
└── TASK.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download](https://nodejs.org/))
- **npm**: `v9.0.0` or higher
- **Git**: `v2.30.0` or higher

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

### Running the Application

1. **Start the Backend Server** (Port `5001`):
   ```bash
   cd server
   cp .env.example .env
   npm run dev
   ```

2. **Start the Frontend Client** (Port `3000`):
   ```bash
   cd ../client
   cp .env.example .env.local
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
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

---

## 📡 API Reference & cURL Examples

### 1. User Registration
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "phone": "0771234567",
    "address": "Colombo 03",
    "role": "seller"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Password123!"
  }'
```

### 3. Search & Filter Vehicles
```bash
curl "http://localhost:5001/api/cars?keyword=Toyota&minPrice=4000000&maxPrice=9000000&fuelType=Hybrid&sort=price_asc&page=1&limit=10"
```

### 4. Create Vehicle Listing (Multipart with Images)
```bash
curl -X POST http://localhost:5001/api/cars \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -F "title=Toyota Aqua S Grade 2018" \
  -F "make=Toyota" \
  -F "model=Aqua" \
  -F "year=2018" \
  -F "price=6250000" \
  -F "mileage=65000" \
  -F "fuelType=Hybrid" \
  -F "transmission=Automatic" \
  -F "condition=Used" \
  -F "location=Colombo" \
  -F "description=First owner mint condition hybrid car." \
  -F "images=@/path/to/car-front.jpg"
```

### 5. Compare Vehicles
```bash
curl "http://localhost:5001/api/cars/compare?ids=car-001,car-002,car-003"
```

---

## 💾 Data Storage & Schemas

Data is persisted as JSON files located inside `server/data/`:

* **`users.json`**: Stores user accounts, hashed passwords, roles (`buyer`, `seller`, `admin`), seller verification status, and wishlist IDs.
* **`cars.json`**: Stores vehicle specifications, pricing, status (`Available`, `Pending`, `Sold`), and image paths.
* **`messages.json`**: Stores chat message history linked to conversations and vehicles.
* **`conversations.json`**: Tracks active buyer–seller conversations per vehicle.
* **`notifications.json`**: Stores unread user alerts and message counts.

---

## 📷 File Upload Architecture

* Vehicle image uploads are handled via **Multer** middleware.
* Uploaded images are validated for allowed MIME types (`image/jpeg`, `image/png`, `image/webp`) and capped at **5MB** per file.
* Files are stored in `server/uploads/` with unique sanitized filenames (`car-<timestamp>-<hash>.<ext>`).
* Express serves uploaded images statically at `/uploads/*`.
* The database (`cars.json`) stores accessible URL paths (e.g. `"/uploads/car-1719800001-front.jpg"`). Binary image data is **never** stored inside JSON.

---

## 💬 Real-Time Messaging Architecture

```text
[ Buyer Browser ] ─────────── Socket.IO (joinConversation) ─────────── [ Express Server ]
        │                                                                     │
        ├─────── emit("sendMessage", { carId, receiverId, message }) ────────┤
        │                                                                     │
        │                                                        [ Save to messages.json ]
        │                                                                     │
        │                                                        [ Emit to Seller Room ]
        │                                                                     │
[ Buyer Browser ] ◄────────── emit("receiveMessage") ───────────────── [ Seller Browser ]
```

* Rooms are partitioned by `conversationId` (`conv-<buyerId>-<sellerId>-<carId>`).
* Online status and live typing indicators are broadcasted in real-time.
* If a recipient is offline, unread counters in `notifications.json` increment and display immediately upon their next login.

---

## 🌿 Git Workflow & Branching Strategy

The project strictly follows a Git Feature-Branch model:

```text
main (Release Branch)
  ▲
  │ (Pull Request after full integration)
dev (Development & Integration Branch)
  ▲
  ├── feature/auth           (Member 1)
  ├── feature/dashboard      (Member 2)
  ├── feature/chat           (Member 3)
  └── feature/search-compare (Member 4)
```

### Commit Convention
Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
* `feat(auth): implement JWT login and password hashing`
* `feat(cars): add 5-step vehicle listing wizard`
* `feat(search): add faceted filtering and sorting`
* `feat(chat): implement real-time socket communication`
* `fix(auth): handle expired token gracefully`
* `test(cars): add unit tests for listing CRUD`

---

## 🧪 Testing & Quality Assurance

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

---

## 🏁 End-to-End Verification

To verify the complete integration across all four member modules:
1. **Seller** registers, logs in, creates a vehicle listing with 3 uploaded photos, and views the listing on their dashboard.
2. **Buyer** searches for the vehicle using keyword and price filters, opens the vehicle details page, adds it to their wishlist, and adds it to the comparison view.
3. **Buyer** clicks "Contact Seller" and sends a real-time message.
4. **Seller** receives the message in real-time (`🔔 1`), opens the chat, and replies.
5. **Buyer** receives the reply instantly without reloading.
6. **Seller** marks the listing as `Sold`, which updates live in the public catalog.
7. **Admin** logs into `/admin` to verify seller credentials and inspect marketplace listings.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
