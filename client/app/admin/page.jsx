'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import api from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import { Users, Shield, Car, Check, X, ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleVerify = async (userId, currentStatus) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/verify-seller`, {
        verifiedSeller: !currentStatus
      });
      if (res.data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, verifiedSeller: !currentStatus } : u));
      }
    } catch (err) {
      alert('Failed to update seller verification status');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administrator Console</h1>
          <p className="text-sm text-gray-500 mt-1">Platform management, seller verification, and marketplace auditing</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Registered Users" value={stats.totalUsers} icon={Users} color="purple" />
            <StatCard title="Total Listings" value={stats.totalListings} icon={Car} color="sky" />
            <StatCard title="Active Sellers" value={stats.sellers} icon={Shield} color="green" />
            <StatCard title="Verified Sellers" value={stats.verifiedSellers} icon={ShieldAlert} color="amber" />
          </div>
        )}

        {/* Users Management Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Registered Accounts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
                <tr>
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Seller Verified</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="py-4 font-semibold text-gray-900">{u.name}</td>
                    <td className="py-4 text-gray-500">{u.email}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'seller' ? 'bg-sky-100 text-sky-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4">
                      {u.verifiedSeller ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600 space-x-1">
                          <Check className="w-4 h-4" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Unverified</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {u.role === 'seller' && (
                        <button
                          onClick={() => toggleVerify(u.id, u.verifiedSeller)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                            u.verifiedSeller
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.verifiedSeller ? 'Revoke Badge' : 'Verify Seller'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
