-- ==========================================================
-- 🚗 Vehicle-Hub (AutoHub) — Supabase PostgreSQL Schema
-- ==========================================================
-- Run this script in the Supabase SQL Editor to initialize
-- all tables, indexes, relationships, and seed data.
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 2. Users Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT ('user-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    verified_seller BOOLEAN DEFAULT FALSE,
    wishlist TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 3. Cars Table (Vehicle Listings)
-- ==========================================================
CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY DEFAULT ('car-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INT NOT NULL,
    price NUMERIC NOT NULL,
    mileage NUMERIC DEFAULT 0,
    fuel_type TEXT DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
    transmission TEXT DEFAULT 'Automatic' CHECK (transmission IN ('Automatic', 'Manual')),
    condition TEXT DEFAULT 'Used' CHECK (condition IN ('Brand New', 'Used', 'Reconditioned')),
    location TEXT DEFAULT '',
    description TEXT DEFAULT '',
    images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Pending', 'Sold', 'Deleted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 4. Conversations Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY DEFAULT ('conv-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    car_id TEXT REFERENCES cars(id) ON DELETE SET NULL,
    buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message TEXT DEFAULT '',
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 5. Messages Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY DEFAULT ('msg-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id TEXT REFERENCES cars(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 6. Notifications Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT ('notif-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'chat',
    read BOOLEAN DEFAULT FALSE,
    reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 7. High-Performance Indexes for Search & Filter
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_cars_search ON cars USING gin (
    to_tsvector('english', title || ' ' || make || ' ' || model || ' ' || location || ' ' || description)
);
CREATE INDEX IF NOT EXISTS idx_cars_filters ON cars (make, model, fuel_type, transmission, status, price, year);
CREATE INDEX IF NOT EXISTS idx_cars_seller ON cars (seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages (conversation_id, receiver_id, read);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations (buyer_id, seller_id);

-- ==========================================================
-- 8. Seed Initial Accounts & Listings
-- ==========================================================
INSERT INTO users (id, name, email, password_hash, phone, address, role, verified_seller, wishlist)
VALUES 
(
    'user-001',
    'Jane Seller',
    'seller@autohub.com',
    '$2a$10$rCzXj24Tf.U6iVf6q/L/4u0yVl49d7B4u0yVl49d7B4u0yVl49d7B',
    '+94771234567',
    '123 Galle Road, Colombo 03',
    'seller',
    TRUE,
    '{}'
),
(
    'user-002',
    'John Buyer',
    'buyer@autohub.com',
    '$2a$10$rCzXj24Tf.U6iVf6q/L/4u0yVl49d7B4u0yVl49d7B4u0yVl49d7B',
    '+94719876543',
    '45 Kandy Road, Kiribathgoda',
    'buyer',
    FALSE,
    '{"car-001"}'
),
(
    'user-003',
    'System Admin',
    'admin@autohub.com',
    '$2a$10$rCzXj24Tf.U6iVf6q/L/4u0yVl49d7B4u0yVl49d7B4u0yVl49d7B',
    '+94112345678',
    'Vehicle-Hub HQ, Colombo 07',
    'admin',
    TRUE,
    '{}'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO cars (id, seller_id, title, make, model, year, price, mileage, fuel_type, transmission, condition, location, description, images, status)
VALUES
(
    'car-001',
    'user-001',
    'Toyota Aqua S Grade 2018',
    'Toyota',
    'Aqua',
    2018,
    6250000,
    65000,
    'Hybrid',
    'Automatic',
    'Used',
    'Colombo',
    'Mint condition, 1st owner, company maintained with complete service records.',
    '{}',
    'Available'
),
(
    'car-002',
    'user-001',
    'Honda Vezel RS 2019',
    'Honda',
    'Vezel',
    2019,
    8900000,
    48000,
    'Hybrid',
    'Automatic',
    'Used',
    'Kandy',
    'Dual clutch updated, leather interior, safety package included.',
    '{}',
    'Available'
)
ON CONFLICT (id) DO NOTHING;
