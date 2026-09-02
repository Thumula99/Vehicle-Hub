'use client';

import React from 'react';
import { Filter, RotateCcw, Tag, Fuel, Settings, Calendar, DollarSign, Gauge, MapPin } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2 font-bold text-gray-900">
          <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-sky-600 flex items-center space-x-1 transition font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Make */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Tag className="w-3.5 h-3.5 text-sky-600" />
          <span>Make</span>
        </label>
        <select
          name="make"
          value={filters.make || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-gray-50/50"
        >
          <option value="">All Makes</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Nissan">Nissan</option>
          <option value="Suzuki">Suzuki</option>
          <option value="Mitsubishi">Mitsubishi</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="BMW">BMW</option>
          <option value="Audi">Audi</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Kia">Kia</option>
        </select>
      </div>

      {/* Model */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Model Keyword</label>
        <input
          type="text"
          name="model"
          placeholder="e.g. Aqua, Vezel, Civic"
          value={filters.model || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-gray-50/50"
        />
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Condition</label>
        <select
          name="condition"
          value={filters.condition || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-gray-50/50"
        >
          <option value="">All Conditions</option>
          <option value="Brand New">Brand New</option>
          <option value="Used">Used</option>
          <option value="Reconditioned">Reconditioned</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Fuel className="w-3.5 h-3.5 text-sky-600" />
          <span>Fuel Type</span>
        </label>
        <select
          name="fuelType"
          value={filters.fuelType || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-gray-50/50"
        >
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Settings className="w-3.5 h-3.5 text-sky-600" />
          <span>Transmission</span>
        </label>
        <select
          name="transmission"
          value={filters.transmission || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-gray-50/50"
        >
          <option value="">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
          <DollarSign className="w-3.5 h-3.5 text-sky-600" />
          <span>Price Range (LKR)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50/50"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Year Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          <span>Year Range</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minYear"
            placeholder="Min Year"
            value={filters.minYear || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50/50"
          />
          <input
            type="number"
            name="maxYear"
            placeholder="Max Year"
            value={filters.maxYear || ''}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Mileage Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Gauge className="w-3.5 h-3.5 text-sky-600" />
          <span>Max Mileage (km)</span>
        </label>
        <input
          type="number"
          name="maxMileage"
          placeholder="e.g. 100000"
          value={filters.maxMileage || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-gray-50/50"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span>Location</span>
        </label>
        <input
          type="text"
          name="location"
          placeholder="e.g. Colombo, Kandy"
          value={filters.location || ''}
          onChange={handleChange}
          className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-gray-50/50"
        />
      </div>
    </div>
  );
}
