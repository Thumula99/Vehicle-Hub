'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { carService } from '../services/carService';
import CarCard from '../components/cars/CarCard';
import { Search, ShieldCheck, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  useEffect(() => {
    carService.getCars({ limit: 4 })
      .then(res => {
        if (res.success) setFeaturedCars(res.cars);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/cars?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push('/cars');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/30 px-4 py-1.5 rounded-full text-xs text-sky-300 font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>Sri Lanka's Modern Vehicle Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Find Your Dream Drive with <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">AutoHub</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
            Browse verified listings, compare specs across models, negotiate with sellers in real-time, and make confident automotive purchases.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Toyota, Aqua, Hybrid, Colombo..."
                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl outline-none text-sm placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/30"
            >
              <span>Search Cars</span>
            </button>
          </form>
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Verified Sellers</h3>
            <p className="text-sm text-gray-500">
              Admin-verified vehicle dealers and individual sellers guarantee listing authenticity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Real-Time Messaging</h3>
            <p className="text-sm text-gray-500">
              Direct, instant chat between buyers and sellers with live typing and unread alerts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Side-by-Side Comparison</h3>
            <p className="text-sm text-gray-500">
              Compare up to 4 vehicles simultaneously across mileage, fuel efficiency, price, and specs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Vehicles</h2>
            <p className="text-sm text-gray-500">Fresh listings added recently by verified sellers</p>
          </div>
          <Link href="/cars" className="inline-flex items-center space-x-1 text-sky-600 hover:text-sky-700 font-semibold text-sm">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>
    </div>
  );
}
