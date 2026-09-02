'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useWishlist } from '../../context/WishlistContext';
import { Car, Heart, MessageSquare, User, LogOut, PlusCircle, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useChat();
  const { wishlistIds } = useWishlist();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-sky-600 text-white p-2 rounded-xl">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Vehicle-Hub
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cars" className="text-gray-600 hover:text-sky-600 font-medium transition">
              Browse Vehicles
            </Link>
            <Link href="/cars/compare" className="text-gray-600 hover:text-sky-600 font-medium transition">
              Compare
            </Link>
            {user?.role === 'seller' && (
              <Link href="/seller/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-sky-600 font-medium transition">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-medium transition">
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Wishlist Link */}
                <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition" title="Wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistIds.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>

                {/* Messages Link */}
                <Link href="/messages" className="relative p-2 text-gray-600 hover:text-sky-600 transition" title="Messages">
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-sky-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Post Vehicle CTA for Sellers */}
                {user?.role === 'seller' && (
                  <Link
                    href="/seller/create-listing"
                    className="hidden sm:flex items-center space-x-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Vehicle</span>
                  </Link>
                )}

                {/* Profile & Logout */}
                <Link href="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-sky-600 text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-sky-600 px-3 py-2 text-sm font-medium transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
