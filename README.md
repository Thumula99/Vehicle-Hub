# 🚗 AutoHub - Car Buying & Selling Platform

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)

A lightweight, high-performance web application for buying and selling vehicles. Built with **Next.js/React** on the frontend and **Node.js/Express** on the backend. This project utilizes a **Custom File-Based JSON Storage Engine** (built using Node.js `fs/promises`) instead of a traditional database system, making it zero-dependency, easy to deploy, and fully persistent out-of-the-box.

---

## 📖 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [File-Based Storage System](#-file-based-storage-system)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#-api-documentation)
- [Data Schemas](#-data-schemas)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👤 User & Seller Experience
* **Dynamic Listing Creation:** Multi-step vehicle submission form supporting make, model, year, price, mileage, body style, condition, and image uploads.
* **Seller Dashboard:** View active listings, update vehicle status (*Available*, *Pending*, *Sold*), edit prices, or delete posts.
* **In-App Buyer-Seller Messaging:** Direct inquiry messaging between buyers and vehicle owners stored securely in JSON logs.

### 🔍 Buyer Discovery
* **Faceted Filtering & Search:** Instant search filter by keyword, price range, manufacturing year, mileage, fuel type, and transmission.
* **Vehicle Comparison Tool:** Side-by-side spec comparison for up to 4 selected vehicles.
* **Wishlist / Saved Cars:** Bookmark favorite listings stored locally in session storage or user state.

### 🛡 Admin & Maintenance
* **Listing Moderation Queue:** Admins can review, approve, or reject user-submitted listings before public display.
* **File Integrity Checks:** Automated utility scripts to validate, seed, and backup JSON database files.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) / React | React Framework with SSR/SSG capabilities and Tailwind CSS |
| **Backend** | [Node.js](https://nodejs.org/) / Express | RESTful API server handling business logic, validation, and file IO |
| **Storage Engine** | File-Based Storage (`fs/promises`) | Native Node.js file system storing data in structured JSON files |
| **File Uploads** | Multer | Multipart/form-data handler for vehicle photo uploads to static directory |
| **Styling** | Tailwind CSS / Lucide Icons | Responsive UI styling and icon set |

---

## 📁 File-Based Storage System

Instead of relying on external database engines like MongoDB or PostgreSQL, **AutoHub** uses a modular **JSON File Store Engine**.

### How It Works:
1. **Directory Structure:** All data records are stored in the `/server/data/` directory (`cars.json`, `users.json`, `messages.json`).
2. **Atomic Operations:** Reads and writes utilize asynchronous Node.js `fs/promises` wrapped in mutex locks to prevent race conditions during concurrent file modifications.
3. **Static Media Storage:** Uploaded vehicle images are saved directly to `/server/public/uploads/` and referenced in JSON records via public URL paths.

> **Note:** This architecture provides zero complex configuration, instant portability, and easy backup operations by simply copying the `/data` directory.

---

## 📂 Project Architecture

```
autohub/
├── client/                      # Next.js / React Frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages (Listings, Dashboard, Admin)
│   │   ├── components/          # Reusable UI components (CarCard, FilterBar, Navbar, Modal)
│   │   ├── context/             # Global Auth & Saved Cars state
│   │   ├── services/            # Axios API client functions
│   │   └── types/               # TypeScript interface definitions
│   ├── public/                  # Static assets and icons
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                      # Node.js / Express Backend
    ├── data/                    # JSON File Storage System
    │   ├── cars.json            # Vehicle records
    │   ├── users.json           # User accounts & profiles
    │   └── messages.json        # Buyer-seller chat messages
    ├── middleware/              # Authentication & upload middlewares
    ├── routes/                  # Express REST API routes
    │   ├── cars.js              # Vehicle CRUD operations
    │   ├── users.js             # User auth & management
    │   └── messages.js          # Messaging routes
    ├── utils/                   # File storage helper functions (jsonStore.js)
    ├── uploads/                 # Stored uploaded image files
    ├── server.js                # Express app entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* `npm` (v9.0.0 or higher) or `yarn` / `pnpm`

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/autohub-marketplace.git
   cd autohub-marketplace
   ```

2. **Setup Backend Server:**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend Client:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Express Backend:**
   ```bash
   cd server
   npm run dev
   # Backend running at http://localhost:5000
   ```

2. **Start the Next.js Frontend:**
   ```bash
   cd client
   npm run dev
   # Frontend running at http://localhost:3000
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## 📡 API Documentation

### Vehicle Listings (`/api/cars`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/cars` | Fetch all approved vehicle listings (supports query params for filtering) | ❌ |
| `GET` | `/api/cars/:id` | Fetch single vehicle details by ID | ❌ |
| `POST` | `/api/cars` | Create a new vehicle listing (with image upload) | ✅ |
| `PUT` | `/api/cars/:id` | Update an existing vehicle listing | ✅ |
| `DELETE`| `/api/cars/:id` | Delete a vehicle listing and its associated images | ✅ |

### Messages & Inquiries (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/messages/user/:userId` | Get messages sent/received by a specific user | ✅ |
| `POST` | `/api/messages` | Send an inquiry message to a seller | ✅ |

---

## 📝 Data Schemas

### Vehicle Object Example (`server/data/cars.json`)
```json
[
  {
    "id": "car_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "sellerId": "usr_1024",
    "title": "2021 Toyota Camry SE",
    "make": "Toyota",
    "model": "Camry",
    "year": 2021,
    "price": 24500,
    "mileage": 32000,
    "transmission": "Automatic",
    "fuelType": "Petrol",
    "bodyType": "Sedan",
    "condition": "Used - Excellent",
    "status": "Available",
    "description": "Single owner, clean maintenance record, accident-free.",
    "images": [
      "/uploads/1715001122-camry1.jpg",
      "/uploads/1715001122-camry2.jpg"
    ],
    "createdAt": "2026-03-15T10:30:00.000Z",
    "updatedAt": "2026-03-15T10:30:00.000Z"
  }
]
```

### Message Object Example (`server/data/messages.json`)
```json
[
  {
    "id": "msg_8f1a2b3c",
    "carId": "car_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "senderId": "usr_2048",
    "receiverId": "usr_1024",
    "message": "Hi, is this Toyota Camry still available for a test drive this weekend?",
    "timestamp": "2026-03-16T14:20:00.000Z"
  }
]
```

---

## 🔑 Environment Variables

### Backend (`server/.env.example`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
```

### Frontend (`client/.env.local.example`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
