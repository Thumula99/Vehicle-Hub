# 🚗 Vehicle-Hub (AutoHub) — Modern Car Marketplace

[![.NET 8](https://img.shields.io/badge/.NET_8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](./.github/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

A high-performance, full-stack vehicle marketplace application engineered with a **C# ASP.NET Core (.NET 8.0) Web API backend**, a **Next.js 14+ / React frontend**, **SignalR** real-time messaging, and **Supabase (PostgreSQL)** database backing with automated **GitHub Actions CI/CD**.

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Team Feature Assignments](#team-feature-assignments)
- [Technology Stack](#technology-stack)
- [Database Architecture (Supabase)](#database-architecture-supabase)
- [CI/CD Pipelines (GitHub Actions)](#cicd-pipelines-github-actions)
- [Repository Layout](#repository-layout)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Running Backend (.NET 8 C#)](#running-backend-net-8-c)
  - [Running Frontend (Next.js 14)](#running-frontend-nextjs-14)
- [Environment Configuration](#environment-configuration)
- [API Reference & Swagger](#api-reference--swagger)
- [License](#license)

---

## 🌟 Project Overview

**Vehicle-Hub (AutoHub)** is designed for seamless car buying, selling, comparing, and real-time negotiations.

### Key Capabilities

* **Buyers**: Search and filter vehicles with multi-facet queries, sort listings, compare up to 4 models side-by-side with spec highlights, save to persistent wishlists, and chat in real-time with sellers.
* **Sellers**: Manage inventory via a comprehensive Seller Dashboard, publish listings through a 5-step wizard with multiple image uploads, and update listing statuses (`Available`, `Pending`, `Sold`).
* **Administrators**: Verify trusted sellers, moderate listings, and monitor platform statistics.

---

## 👥 Team Feature Assignments

| Member | Feature Domain | Git Branch | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Authentication & User Profiles** | `feature/auth` | JWT Bearer Auth, BCrypt password hashing, role policies (`buyer`, `seller`, `admin`), profile & password management, `AuthContext`, `/login`, `/register`, `/profile`. |
| **Member 2** | **Seller Dashboard & Listing Management** | `feature/dashboard` | Vehicle CRUD, Multi-image upload, image serving (`/uploads`), 5-step listing wizard, status management (`Available`, `Pending`, `Sold`), `/seller/dashboard`, `/cars/:id`. |
| **Member 3** | **Real-Time Messaging & Notifications** | `feature/chat` | SignalR ChatHub (`/hubs/chat`), conversation & message schemas, unread badge counter (`🔔`), live typing indicators, `/messages` chat interface. |
| **Member 4** | **Advanced Search, Filters, Compare & Wishlist** | `feature/search-compare` | Faceted search engine, case-insensitive keyword search, sorting & pagination, persistent wishlist, 4-vehicle comparison matrix with highlight badges, `/cars`, `/wishlist`, `/cars/compare`. |

---

## 🛠 Technology Stack

### Backend (.NET 8 C#)
- **Framework**: ASP.NET Core 8.0 Web API (`net8.0`)
- **Language**: C# 12
- **Real-Time Communication**: SignalR (`/hubs/chat`)
- **Authentication**: JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`) & `BCrypt.Net-Next`
- **Documentation**: Swagger / OpenAPI (`Swashbuckle.AspNetCore`)
- **Database**: Supabase (PostgreSQL) + Local thread-safe JSON storage fallback

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3+
- **Icons**: Lucide React
- **State Management**: React Context API (`AuthContext`, `ChatContext`, `WishlistContext`, `CompareContext`)

### DevOps & CI/CD
- **Automation**: GitHub Actions
- **Continuous Integration**: `.github/workflows/ci.yml` (Builds & validates .NET backend and Next.js frontend)
- **Continuous Delivery**: `.github/workflows/cd.yml` (Packages release artifacts)

---

## 🗄 Database Architecture (Supabase)

Defined in [`server/supabase-schema.sql`](file:///Users/dilshanpasindu/Documents/GitHub/Vehicle-Hub/server/supabase-schema.sql):

* **`users`**: Account credentials, roles (`buyer`, `seller`, `admin`), `verified_seller`, and `wishlist` array.
* **`cars`**: Vehicle inventory, specifications, seller foreign keys, status (`Available`, `Pending`, `Sold`), and image paths.
* **`conversations`**: Active buyer–seller conversations linked to vehicle listings.
* **`messages`**: Real-time chat messages and read states.
* **`notifications`**: User alerts and unread counts.

---

## 🚀 Getting Started

### Prerequisites
- **.NET 8.0 SDK**: ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- **Node.js**: `v18.0.0+` ([Download](https://nodejs.org/))
- **Git**: `v2.30.0+`

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Thumula99/Vehicle-Hub.git
   cd Vehicle-Hub
   ```

2. **Run Backend (.NET 8 C#)**:
   ```bash
   cd server
   dotnet restore
   dotnet run
   ```
   Backend starts on `http://localhost:5001`.  
   Swagger UI available at: [http://localhost:5001/swagger](http://localhost:5001/swagger)

3. **Run Frontend (Next.js 14)**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Frontend starts on [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Environment Configuration

### Backend (`server/appsettings.json`)
```json
{
  "Jwt": {
    "Secret": "VehicleHub_Secret_Key_For_Jwt_Authentication_2026_DotNet8_Must_Be_Long",
    "Issuer": "VehicleHubApi",
    "Audience": "VehicleHubClient",
    "ExpiryInDays": 7
  },
  "Supabase": {
    "Url": "https://your-project.supabase.co",
    "AnonKey": "your-anon-key"
  },
  "ClientUrl": "http://localhost:3000"
}
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

---

## 📡 API Reference & Swagger

Interactive OpenAPI documentation is generated automatically. Start the C# backend and visit:
👉 **[http://localhost:5001/swagger](http://localhost:5001/swagger)**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
