'use client';

import React, { useState, useEffect } from 'react';
import { carService } from '../../../services/carService';
import { useCompare } from '../../../context/CompareContext';
import { useWishlist } from '../../../context/WishlistContext';
import {
  SlidersHorizontal,
  Plus,
  X,
  ArrowLeft,
  Heart,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Tag,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const { compareCars, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [availableCars, setAvailableCars] = useState([]);
  const [comparedData, setComparedData] = useState([]);
  const [highlights, setHighlights] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch all cars for quick addition selector
  useEffect(() => {
    carService.getCars({ limit: 50 })
      .then(res => {
        if (res.success) setAvailableCars(res.cars);
      })
      .catch(console.error);
  }, []);

  // Fetch comparison spec details
  useEffect(() => {
    const ids = compareCars.map(c => c.id);
    if (ids.length >= 2) {
      setLoading(true);
      carService.compareCars(ids)
        .then(res => {
          if (res.success) {
            setComparedData(res.cars);
            setHighlights(res.highlights || {});
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setComparedData(compareCars);
      setHighlights({});
    }
  }, [compareCars]);

  const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80';

  const specsList = [
    {
      label: 'Price',
      key: 'price',
      render: (car) => {
        const isBest = highlights.lowestPrice && Number(car.price) === highlights.lowestPrice;
        return (
          <div className="space-y-1">
            <span className="text-lg font-extrabold text-sky-600">
              LKR {car.price ? car.price.toLocaleString() : 'N/A'}
            </span>
            {isBest && (
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                Lowest Price
              </span>
            )}
          </div>
        );
      }
    },
    {
      label: 'Model Year',
      key: 'year',
      render: (car) => {
        const isNewest = highlights.newestYear && Number(car.year) === highlights.newestYear;
        return (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{car.year}</span>
            {isNewest && (
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Newest
              </span>
            )}
          </div>
        );
      }
    },
    {
      label: 'Mileage',
      key: 'mileage',
      render: (car) => {
        const isLowest = highlights.lowestMileage !== null && Number(car.mileage) === highlights.lowestMileage;
        return (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{car.mileage?.toLocaleString()} km</span>
            {isLowest && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Lowest Mileage
              </span>
            )}
          </div>
        );
      }
    },
    {
      label: 'Fuel Type',
      key: 'fuelType',
      render: (car) => <span className="font-medium text-gray-700">{car.fuelType}</span>
    },
    {
      label: 'Transmission',
      key: 'transmission',
      render: (car) => <span className="font-medium text-gray-700">{car.transmission}</span>
    },
    {
      label: 'Condition',
      key: 'condition',
      render: (car) => (
        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
          {car.condition}
        </span>
      )
    },
    {
      label: 'Location',
      key: 'location',
      render: (car) => <span className="text-gray-600">{car.location || 'Sri Lanka'}</span>
    },
    {
      label: 'Seller Details',
      key: 'seller',
      render: (car) => (
        <div className="text-xs space-y-1">
          <p className="font-bold text-gray-900 flex items-center space-x-1">
            <span>{car.seller?.name || 'Private Seller'}</span>
            {car.seller?.verifiedSeller && <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />}
          </p>
          {car.seller?.phone && <p className="text-gray-500">{car.seller.phone}</p>}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/cars" className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-sky-600 transition mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vehicle Catalog</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-2xl">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Side-by-Side Comparison</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Compare specifications, fuel efficiency, pricing, and value across up to 4 models.
          </p>
        </div>

        {compareCars.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl font-bold transition self-start sm:self-auto border border-red-200"
          >
            Clear All Comparison
          </button>
        )}
      </div>

      {/* Quick Add Selector Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Selected Vehicles ({compareCars.length}/4) — Click to Add/Remove
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableCars.map(car => {
            const isSelected = compareCars.some(c => c.id === car.id);
            return (
              <button
                key={car.id}
                onClick={() => isSelected ? removeFromCompare(car.id) : addToCompare(car)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>{isSelected ? '✓ ' : '+ '} {car.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {compareCars.length < 2 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Select At Least 2 Vehicles to Compare</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Click the "Compare" button on any vehicle card in the catalog or select models from the quick add bar above.
          </p>
          <Link
            href="/cars"
            className="inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* Table Header: Vehicle Cards */}
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/50">
                  <th className="p-5 w-44 font-bold text-xs uppercase tracking-wider text-gray-400">
                    Vehicle Model
                  </th>
                  {comparedData.map(car => {
                    const displayImg = car.images && car.images.length > 0
                      ? (car.images[0].startsWith('http') ? car.images[0] : `http://localhost:5001${car.images[0]}`)
                      : fallbackImage;
                    const wishlisted = isInWishlist(car.id);

                    return (
                      <th key={car.id} className="p-5 min-w-[240px] max-w-[280px] align-top font-normal">
                        <div className="space-y-3">
                          <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100 border border-gray-200">
                            <img
                              src={displayImg}
                              alt={car.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = fallbackImage; }}
                            />
                            <button
                              onClick={() => removeFromCompare(car.id)}
                              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition"
                              title="Remove from comparison"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 text-base line-clamp-1">{car.title}</h4>
                            <p className="text-xs text-gray-500">{car.make} • {car.model}</p>
                          </div>

                          <div className="flex items-center space-x-2 pt-1">
                            <Link
                              href={`/cars/${car.id}`}
                              className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-center rounded-xl text-xs transition"
                            >
                              Details
                            </Link>

                            <button
                              onClick={() => toggleWishlist(car.id)}
                              className={`p-2 rounded-xl border transition ${
                                wishlisted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 hover:text-red-500 border-gray-200'
                              }`}
                              title="Wishlist"
                            >
                              <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Table Body: Specification Rows */}
              <tbody className="divide-y divide-gray-100">
                {specsList.map(spec => (
                  <tr key={spec.key} className="hover:bg-slate-50/50 transition">
                    <td className="p-5 font-bold text-xs uppercase tracking-wider text-gray-400 bg-slate-50/30">
                      {spec.label}
                    </td>
                    {comparedData.map(car => (
                      <td key={car.id} className="p-5 align-middle">
                        {spec.render(car)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
