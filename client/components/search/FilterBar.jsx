'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2 font-semibold text-gray-900">
          <Filter className="w-4 h-4 text-sky-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-sky-600 flex items-center space-x-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Make */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Make</label>
        <select
          name="make"
          value={filters.make || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50"
        >
          <option value="">All Makes</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Nissan">Nissan</option>
          <option value="Suzuki">Suzuki</option>
          <option value="Mitsubishi">Mitsubishi</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="BMW">BMW</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Fuel Type</label>
        <select
          name="fuelType"
          value={filters.fuelType || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50"
        >
          <option value="">All Fuels</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Transmission</label>
        <select
          name="transmission"
          value={filters.transmission || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50"
        >
          <option value="">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Price (LKR)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50"
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Year</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minYear"
            placeholder="Min"
            value={filters.minYear || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50"
          />
          <input
            type="number"
            name="maxYear"
            placeholder="Max"
            value={filters.maxYear || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
