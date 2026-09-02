'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '../../context/CompareContext';
import { SlidersHorizontal, X, ArrowRight, Trash2 } from 'lucide-react';

export default function CompareFloatingBar() {
  const { compareCars, compareCount, removeFromCompare, clearCompare } = useCompare();

  if (compareCount === 0) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-slate-700/60 flex items-center justify-between gap-4">
        {/* Left Side: Summary & Clear */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base">Compare Queue</span>
              <span className="bg-sky-500 text-white text-[11px] px-2 py-0.5 rounded-full font-extrabold">
                {compareCount}/4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {compareCount < 2 ? 'Select at least 1 more car to compare' : 'Ready to compare side-by-side'}
            </p>
          </div>
        </div>

        {/* Middle: Vehicle Thumbnails */}
        <div className="hidden md:flex items-center space-x-2">
          {compareCars.map((car) => {
            const displayImg = car.images && car.images.length > 0
              ? `http://localhost:5001${car.images[0]}`
              : fallbackImage;

            return (
              <div
                key={car.id}
                className="relative group w-14 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0"
              >
                <img
                  src={displayImg}
                  alt={car.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
                <button
                  onClick={() => removeFromCompare(car.id)}
                  className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={clearCompare}
            className="p-2 text-slate-400 hover:text-red-400 transition text-xs flex items-center space-x-1"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            href="/cars/compare"
            className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-lg ${
              compareCount >= 2
                ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span>Compare Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
