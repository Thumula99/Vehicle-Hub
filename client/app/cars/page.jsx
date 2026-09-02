'use client';

import React, { useState, useEffect } from 'react';
import { carService } from '../../services/carService';
import CarCard from '../../components/cars/CarCard';
import FilterBar from '../../components/search/FilterBar';
import SearchBar from '../../components/search/SearchBar';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function CarsCatalogPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    make: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    sort: 'newest',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await carService.getCars(filters);
      if (res.success) {
        setCars(res.cars);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      make: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      sort: 'newest',
      page: 1,
      limit: 12
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {pagination.total} verified vehicles available for sale
          </p>
        </div>

        <div className="w-full md:w-96">
          <SearchBar
            value={filters.keyword}
            onChange={(val) => setFilters(prev => ({ ...prev, keyword: val, page: 1 }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Cars List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
            <span className="text-xs text-gray-500 font-medium ml-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
                className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-sky-500"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_newest">Year: Newest First</option>
                <option value="mileage_low">Mileage: Lowest First</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-72 border border-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
              <SlidersHorizontal className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-700">No Vehicles Match Your Criteria</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search keywords.</p>
              <button
                onClick={handleResetFilters}
                className="mt-2 text-sm text-sky-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-6">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-4 py-2 border rounded-xl text-sm font-medium bg-white disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-gray-600">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-4 py-2 border rounded-xl text-sm font-medium bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
