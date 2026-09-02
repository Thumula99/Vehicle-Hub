# 🚗 Vehicle-Hub (AutoHub) — Car Marketplace

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A lightweight, portable web application for buying and selling vehicles. Vehicle-Hub (a.k.a. AutoHub) uses a Next.js/React frontend and a Node.js/Express backend with a simple JSON file-based storage for quick local setup and development.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Four Main Features (Team Assignments)](#four-main-features-team-assignments)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Run (development)](#run-development)
- [Environment Variables](#environment-variables)
- [API Reference & cURL Examples](#api-reference--curl-examples)
- [Data Schemas](#data-schemas)
- [Storage & File Uploads](#storage--file-uploads)
- [Testing & CI](#testing--ci)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

Vehicle-Hub is a simple, extendable marketplace for vehicle listings targeted at teams wanting a minimal stack to iterate quickly. It supports listing creation, seller dashboards, buyer–seller messaging, faceted search and comparisons, and admin moderation. Data is stored in JSON files under `server/data/` for portability.

---

## Four Main Features (Team Assignments)

Below are four main features mapped to one team member each. Each feature includes a goal, tasks, suggested files/areas to change, acceptance criteria, and suggested branch name.

1) Feature 1 — Authentication & User Profiles
- Branch: feature/auth
- Goal: Secure user auth, role-based access (buyer / seller / admin), profile management.
- Tasks:
  - Backend:
    - Implement registration and login endpoints with JWT issuance.
    - Use bcrypt for password hashing and implement refresh token flow (optional).
    - Add auth middleware to protect endpoints and enforce roles.
    - Extend `server/data/users.json` to include profile fields: name, phone, address, role, verifiedSeller, wishlist (array).
  - Frontend:
    - Create AuthContext (providers/hooks) for token storage and user state.
    - Build Login, Register, and Profile pages (edit profile, change password).
- Acceptance criteria:
  - Users can register and log in; protected routes require valid JWT; profile updates persist to `users.json`.

2) Feature 2 — Seller Dashboard & Listing Management
- Branch: feature/dashboard
- Goal: Full seller workflow: multi-step listing creation, image uploads, manage statuses.
- Tasks:
  - Frontend:
    - Multi-step listing form (basic info, specs, pricing, images).
    - Seller dashboard to view, edit, change listing status (Available, Pending, Sold), and delete listings.
  - Backend:
    - Improve `/api/cars` endpoints for seller-specific operations.
    - Use multer for image uploads; validate file types and sizes.
    - Save image files to `server/uploads/` and store URLs in `cars.json`.
- Acceptance criteria:
  - Sellers can create/edit/delete listings with image uploads; status changes reflect in listing responses.

3) Feature 3 — Real-time Messaging & Notifications
- Branch: feature/chat
- Goal: Real-time buyer–seller chat with persistent message history and basic notifications.
- Tasks:
  - Backend:
    - Integrate socket.io (or native WebSocket) to emit/receive messages.
    - Persist messages to `server/data/messages.json`.
    - Add endpoints to fetch conversation history and unread counts.
  - Frontend:
    - Chat UI component (conversation list, open chat window, send messages).
    - Notification badge for unread messages.
- Acceptance criteria:
  - Real-time message delivery between connected users, messages are persisted, and unread counts update correctly.

4) Feature 4 — Advanced Search, Filters, Comparison & Wishlist
- Branch: feature/search-compare
- Goal: Robust discovery tools and persistent wishlist stored in user profiles.
- Tasks:
  - Backend:
    - Enhance `/api/cars` to accept query params for faceted filtering (minPrice, maxPrice, minYear, maxYear, mileage, fuelType, transmission), sorting, and pagination.
    - Implement server-side keyword search (title + description + make/model).
  - Frontend:
    - FilterBar component for faceted filters and sorting.
    - Listing results with pagination / infinite scroll.
    - Compare view to compare up to 4 vehicles side-by-side.
    - Wishlist UI that stores items in the authenticated user's profile (moves from session storage to `users.json`).
- Acceptance criteria:
  - Filters and search return correct results with pagination; wishlist persists per user; compare view displays selected vehicle specs.

---

## Tech Stack

- Frontend: Next.js (App Router) + React + Tailwind CSS
- Backend: C#
- Realtime: socket.io (optional)
- Storage: JSON files in `server/data/` using fs/promises
- File uploads: multer
- Image processing (optional): sharp
- Testing: Jest + Supertest (server), React Testing Library (client)

---

## Repository Layout

autohub/
