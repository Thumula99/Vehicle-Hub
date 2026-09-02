import React from 'react';
import Link from 'next/link';
import { Car, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-xl">
              <Car className="w-6 h-6 text-sky-400" />
              <span>Vehicle-Hub</span>
            </div>
            <p className="text-sm text-gray-400">
              The premier peer-to-peer vehicle marketplace for buyers and sellers across the island.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="hover:text-sky-400 transition">Browse Vehicles</Link></li>
              <li><Link href="/cars/compare" className="hover:text-sky-400 transition">Compare Models</Link></li>
              <li><Link href="/wishlist" className="hover:text-sky-400 transition">My Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seller/create-listing" className="hover:text-sky-400 transition">Post a Vehicle</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-sky-400 transition">Seller Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support & Security</h4>
            <p className="text-sm text-gray-400 mb-2">
              University Software Engineering Team Project. Built with Next.js & Express.
            </p>
            <p className="text-xs text-gray-500">
              © 2026 Vehicle-Hub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
