'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Fuel, Gauge, Calendar, MapPin, SlidersHorizontal, Check } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

export default function CarCard({ car }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const wishlisted = isInWishlist(car.id);
  const compared = isInCompare(car.id);

  const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';
  const displayImage = car.images && car.images.length > 0 
    ? (car.images[0].startsWith('http') ? car.images[0] : `http://localhost:5001${car.images[0]}`)
    : fallbackImage;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 overflow-hidden group flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <img
            src={displayImage}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => { e.target.src = fallbackImage; }}
          />

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
            {car.condition || 'Used'}
          </div>

          {/* Top Right Action: Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(car.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-sm ${
              wishlisted ? 'bg-red-500 text-white' : 'bg-white/85 text-gray-700 hover:text-red-500'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
            <span>{car.location || 'Sri Lanka'}</span>
          </div>

          <Link href={`/cars/${car.id}`} className="block hover:text-sky-600 transition">
            <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-sky-600 transition">
              {car.title}
            </h3>
          </Link>

          <p className="text-xl font-extrabold text-sky-600">
            LKR {car.price ? car.price.toLocaleString() : 'N/A'}
          </p>

          {/* Specs Micro-Grid */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-gray-400" />
              <span>{car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : '0 km'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="w-3.5 h-3.5 text-gray-400" />
              <span>{car.fuelType || 'Petrol'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
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
          className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs text-center transition flex items-center justify-center"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
