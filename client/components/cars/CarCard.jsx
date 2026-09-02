'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Fuel, Gauge, Calendar, MapPin } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function CarCard({ car }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(car.id);

  const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';
  const displayImage = car.images && car.images.length > 0 
    ? `http://localhost:5001${car.images[0]}`
    : fallbackImage;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group flex flex-col">
      {/* Image & Wishlist Button */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img
          src={displayImage}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(car.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition shadow-sm ${
            wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm">
          {car.condition || 'Used'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{car.location || 'Sri Lanka'}</span>
          </div>

          <Link href={`/cars/${car.id}`} className="hover:text-sky-600 transition">
            <h3 className="font-semibold text-gray-900 line-clamp-1 text-base">{car.title}</h3>
          </Link>

          <p className="text-lg font-bold text-sky-600 mt-2">
            LKR {car.price ? car.price.toLocaleString() : 'N/A'}
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-gray-400" />
              <span>{car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : '-'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="w-3.5 h-3.5 text-gray-400" />
              <span>{car.fuelType || 'Petrol'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3">
          <Link
            href={`/cars/${car.id}`}
            className="block text-center w-full py-2 bg-gray-50 hover:bg-sky-50 text-sky-600 hover:text-sky-700 font-medium rounded-xl text-sm transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
