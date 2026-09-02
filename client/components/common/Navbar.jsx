'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { Car, Heart, MessageSquare, User, LogOut, PlusCircle, LayoutDashboard, Shield, SlidersHorizontal } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useChat();
  const { wishlistIds } = useWishlist();
  const { compareCount } = useCompare();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="bg-sky-600 text-white p-2 rounded-2xl shadow-sm shadow-sky-600/30">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-800 bg-clip-text text-transparent">
              Vehicle-Hub
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cars" className="text-gray-600 hover:text-sky-600 font-semibold text-sm transition">
              Browse Vehicles
            </Link>

            <Link href="/cars/compare" className="relative flex items-center space-x-1.5 text-gray-600 hover:text-sky-600 font-semibold text-sm transition">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="bg-sky-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                  {compareCount}
                </span>
              )}
            </Link>

            {user?.role === 'seller' && (
              <Link href="/seller/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-sky-600 font-semibold text-sm transition">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link href="/admin" className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-semibold text-sm transition">
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Wishlist Link */}
                <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition rounded-xl hover:bg-gray-50" title="Wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistIds.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>

                {/* Messages Link */}
                <Link href="/messages" className="relative p-2 text-gray-600 hover:text-sky-600 transition rounded-xl hover:bg-gray-50" title="Messages">
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-sky-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Post Vehicle CTA for Sellers */}
                {user?.role === 'seller' && (
                  <Link
                    href="/seller/create-listing"
                    className="hidden sm:flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm shadow-sky-600/25"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Vehicle</span>
                  </Link>
                )}

                {/* Profile & Logout */}
                <Link href="/profile" className="flex items-center space-x-1.5 text-gray-700 hover:text-sky-600 text-sm font-semibold pl-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 transition rounded-xl hover:bg-gray-50"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-sky-600 px-3 py-2 text-sm font-semibold transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm shadow-sky-600/25"
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
