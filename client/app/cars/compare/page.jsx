'use client';

import React, { useState, useEffect } from 'react';
import { carService } from '../../../services/carService';
import { SlidersHorizontal, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const [allCars, setAllCars] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareCars, setCompareCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carService.getCars({ limit: 50 })
      .then(res => {
        if (res.success) {
          setAllCars(res.cars);
          if (res.cars.length >= 2) {
            setSelectedIds([res.cars[0].id, res.cars[1].id]);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      setLoading(true);
      carService.compareCars(selectedIds)
        .then(res => {
          if (res.success) setCompareCars(res.cars);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setCompareCars([]);
    }
  }, [selectedIds]);

  const addCarToCompare = (id) => {
    if (selectedIds.length >= 4) {
      alert('You can compare a maximum of 4 vehicles simultaneously.');
      return;
    }
    if (!selectedIds.includes(id)) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const removeCar = (id) => {
    setSelectedIds(prev => prev.filter(item => item !== id));
  };

  const specs = [
    { label: 'Price', key: 'price', format: (v) => v ? `LKR ${v.toLocaleString()}` : '-' },
    { label: 'Year', key: 'year' },
    { label: 'Mileage', key: 'mileage', format: (v) => v ? `${v.toLocaleString()} km` : '-' },
    { label: 'Fuel Type', key: 'fuelType' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Condition', key: 'condition' },
    { label: 'Location', key: 'location' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link href="/cars" className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-sky-600 transition mb-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Compare Vehicles</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select up to 4 models to compare side-by-side specifications and value.
        </p>
      </div>

      {/* Select Vehicle Dropdowns */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">Add Vehicles to Comparison ({selectedIds.length}/4)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {allCars.map(c => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => isSelected ? removeCar(c.id) : addCarToCompare(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {isSelected ? '✓ ' : '+ '} {c.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {compareCars.length < 2 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-medium">Please select at least 2 vehicles to compare.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 w-44 font-bold text-gray-400 uppercase text-xs">Specification</th>
                {compareCars.map(c => (
                  <th key={c.id} className="p-4 font-bold text-gray-900 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="line-clamp-1">{c.title}</span>
                      <button
                        onClick={() => removeCar(c.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {specs.map(spec => (
                <tr key={spec.key} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">{spec.label}</td>
                  {compareCars.map(c => {
                    const val = c[spec.key];
                    const display = spec.format ? spec.format(val) : (val || '-');
                    return (
                      <td key={c.id} className="p-4 font-medium text-gray-800">
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
