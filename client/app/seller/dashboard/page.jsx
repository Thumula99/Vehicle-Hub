'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { carService } from '../../../services/carService';
import StatCard from '../../../components/dashboard/StatCard';
import { Car, PlusCircle, CheckCircle, Clock, Trash2, Edit3, Tag } from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await carService.getSellerListings();
      if (res.success) setListings(res.cars);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await carService.updateCarStatus(id, newStatus);
      if (res.success) {
        setListings(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await carService.deleteCar(id);
      if (res.success) {
        setListings(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const total = listings.length;
  const available = listings.filter(c => c.status === 'Available').length;
  const pending = listings.filter(c => c.status === 'Pending').length;
  const sold = listings.filter(c => c.status === 'Sold').length;

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your vehicle listings, status, and inquiries</p>
          </div>
          <Link
            href="/seller/create-listing"
            className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-sm transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post New Vehicle</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Listings" value={total} icon={Car} color="sky" />
          <StatCard title="Available" value={available} icon={CheckCircle} color="green" />
          <StatCard title="Pending Deal" value={pending} icon={Clock} color="amber" />
          <StatCard title="Sold Out" value={sold} icon={Tag} color="purple" />
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-6">
          <h2 className="text-lg font-bold text-gray-900">Your Vehicle Inventory</h2>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-3">
              <Car className="w-12 h-12 mx-auto text-gray-300" />
              <p>You haven't posted any vehicle listings yet.</p>
              <Link href="/seller/create-listing" className="text-sky-600 font-semibold hover:underline text-sm">
                Create your first listing now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Posted Date</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map(car => (
                    <tr key={car.id} className="hover:bg-gray-50/50">
                      <td className="py-4 font-semibold text-gray-900">
                        <Link href={`/cars/${car.id}`} className="hover:text-sky-600">
                          {car.title}
                        </Link>
                      </td>
                      <td className="py-4 text-sky-600 font-bold">LKR {car.price?.toLocaleString()}</td>
                      <td className="py-4">
                        <select
                          value={car.status || 'Available'}
                          onChange={(e) => handleStatusChange(car.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg outline-none border ${
                            car.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            car.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Pending">Pending</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>
                      <td className="py-4 text-gray-500 text-xs">
                        {new Date(car.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
