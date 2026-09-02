'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareCars, setCompareCars] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('autohub_compare');
      if (saved) {
        setCompareCars(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load compare items from localStorage:', err);
    }
  }, []);

  const saveToStorage = (cars) => {
    try {
      localStorage.setItem('autohub_compare', JSON.stringify(cars));
    } catch (err) {
      console.error('Failed to save compare items to localStorage:', err);
    }
  };

  const addToCompare = (car) => {
    if (compareCars.length >= 4) {
      alert('You can compare a maximum of 4 vehicles at a time.');
      return false;
    }
    if (!compareCars.some(c => c.id === car.id)) {
      const updated = [...compareCars, car];
      setCompareCars(updated);
      saveToStorage(updated);
    }
    return true;
  };

  const removeFromCompare = (carId) => {
    const updated = compareCars.filter(c => c.id !== carId);
    setCompareCars(updated);
    saveToStorage(updated);
  };

  const toggleCompare = (car) => {
    if (isInCompare(car.id)) {
      removeFromCompare(car.id);
      return false;
    } else {
      return addToCompare(car);
    }
  };

  const clearCompare = () => {
    setCompareCars([]);
    saveToStorage([]);
  };

  const isInCompare = (carId) => compareCars.some(c => c.id === carId);

  return (
    <CompareContext.Provider value={{
      compareCars,
      compareCount: compareCars.length,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
