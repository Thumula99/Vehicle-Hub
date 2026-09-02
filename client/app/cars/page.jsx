'use client';

import React, { useState, useEffect } from 'react';
import { carService } from '../../services/carService';
import CarCard from '../../components/cars/CarCard';
import FilterBar from '../../components/search/FilterBar';
import SearchBar from '../../components/search/SearchBar';
import { SlidersHorizontal, ArrowUpDown, X, Car } from 'lucide-react';

export default function CarsCatalogPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    make: '',
    model: '',
    fuelType: '',
    transmission: '',
    condition: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    maxMileage: '',
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
    const timer = setTimeout(() => {
      fetchCars();
    }, 200);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      make: '',
      model: '',
      fuelType: '',
      transmission: '',
      condition: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      maxMileage: '',
      sort: 'newest',
      page: 1,
      limit: 12
    });
  };

  const removeFilterKey = (key) => {
    setFilters(prev => ({ ...prev, [key]: '', page: 1 }));
  };

  // Extract active filter labels
  const activeTags = [];
  if (filters.keyword) activeTags.push({ key: 'keyword', label: `Search: "${filters.keyword}"` });
  if (filters.make) activeTags.push({ key: 'make', label: `Make: ${filters.make}` });
  if (filters.model) activeTags.push({ key: 'model', label: `Model: ${filters.model}` });
  if (filters.fuelType) activeTags.push({ key: 'fuelType', label: `Fuel: ${filters.fuelType}` });
  if (filters.transmission) activeTags.push({ key: 'transmission', label: `Trans: ${filters.transmission}` });
  if (filters.condition) activeTags.push({ key: 'condition', label: `Condition: ${filters.condition}` });
  if (filters.minPrice) activeTags.push({ key: 'minPrice', label: `Min LKR: ${Number(filters.minPrice).toLocaleString()}` });
  if (filters.maxPrice) activeTags.push({ key: 'maxPrice', label: `Max LKR: ${Number(filters.maxPrice).toLocaleString()}` });
  if (filters.minYear) activeTags.push({ key: 'minYear', label: `Year ≥ ${filters.minYear}` });
  if (filters.maxYear) activeTags.push({ key: 'maxYear', label: `Year ≤ ${filters.maxYear}` });
  if (filters.location) activeTags.push({ key: 'location', label: `Loc: ${filters.location}` });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browse Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover {pagination.total} verified vehicle listings across Sri Lanka
          </p>
        </div>

        <div className="w-full md:w-96">
          <SearchBar
            value={filters.keyword}
            onChange={(val) => setFilters(prev => ({ ...prev, keyword: val, page: 1 }))}
          />
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeTags.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 pt-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Active:</span>
          {activeTags.map(tag => (
            <span
              key={tag.key}
              className="inline-flex items-center space-x-1 bg-sky-50 text-sky-700 border border-sky-200 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              <span>{tag.label}</span>
              <button
                onClick={() => removeFilterKey(tag.key)}
                className="hover:text-red-500 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-xs text-red-600 hover:underline font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Cars List & Pagination */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Header */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
            <span className="text-xs text-gray-500 font-semibold ml-1">
              Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} Results
            </span>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-sky-500 text-gray-700"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_newest">Year: Newest First</option>
                <option value="year_oldest">Year: Oldest First</option>
                <option value="mileage_low">Mileage: Lowest First</option>
                <option value="mileage_high">Mileage: Highest First</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl h-80 border border-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
              <Car className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No Vehicles Found</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                No vehicles matched your selected filter combination. Try resetting filters or expanding your price/year range.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-block px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Reset All Filters
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
            <div className="flex justify-center items-center space-x-2 pt-6 pb-8">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                    pagination.page === p
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition"
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
