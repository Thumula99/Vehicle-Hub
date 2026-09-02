'use client';

import React from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useWishlist } from '../../context/WishlistContext';
import CarCard from '../../components/cars/CarCard';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistCars, loading } = useWishlist();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <Link href="/cars" className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-sky-600 transition mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Browsing</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Heart className="w-7 h-7 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Vehicles</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Vehicles you have saved for later review and price comparison
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-72 border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : wishlistCars.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4">
            <Heart className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-700">Your Wishlist is Empty</h3>
            <p className="text-sm text-gray-400">Save interesting vehicles from the catalog to view them here.</p>
            <Link
              href="/cars"
              className="inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition"
            >
              Explore Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
