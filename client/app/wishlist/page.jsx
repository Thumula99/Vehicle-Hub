'use client';

import React from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { Heart, ArrowLeft, Trash2, SlidersHorizontal, Check, Eye } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistCars, loading, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <Link href="/cars" className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-sky-600 transition mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Browsing</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 text-red-500 rounded-2xl">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Saved Vehicles</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {wishlistCars.length} saved {wishlistCars.length === 1 ? 'vehicle' : 'vehicles'} in your persistent buyer wishlist
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl h-80 border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : wishlistCars.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-3xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Your Wishlist is Empty</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Save interesting cars from the marketplace to keep track of prices, compare options, and contact sellers.
            </p>
            <Link
              href="/cars"
              className="inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              Explore Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistCars.map(car => {
              const displayImg = car.images && car.images.length > 0
                ? (car.images[0].startsWith('http') ? car.images[0] : `http://localhost:5001${car.images[0]}`)
                : fallbackImage;
              const compared = isInCompare(car.id);

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={displayImg}
                        alt={car.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = fallbackImage; }}
                      />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        {car.condition || 'Used'}
                      </span>
                      <button
                        onClick={() => toggleWishlist(car.id)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <p className="text-xs text-gray-400 font-medium">{car.make} • {car.year}</p>
                      <Link href={`/cars/${car.id}`} className="block font-bold text-gray-900 text-base hover:text-sky-600 line-clamp-1">
                        {car.title}
                      </Link>
                      <p className="text-xl font-extrabold text-sky-600">
                        LKR {car.price ? car.price.toLocaleString() : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {car.mileage?.toLocaleString()} km • {car.fuelType} • {car.transmission}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompare(car)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 ${
                        compared
                          ? 'bg-sky-50 border-sky-300 text-sky-700'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {compared ? <Check className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
                      <span>{compared ? 'Compared' : 'Compare'}</span>
                    </button>

                    <Link
                      href={`/cars/${car.id}`}
                      className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs text-center transition flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
