'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/wishlistService';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistCars, setWishlistCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlistIds([]);
      setWishlistCars([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success) {
        setWishlistCars(res.wishlist || []);
        setWishlistIds(res.wishlistIds || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (carId) => {
    if (!isAuthenticated) return false;
    try {
      if (wishlistIds.includes(carId)) {
        await wishlistService.removeFromWishlist(carId);
        setWishlistIds(prev => prev.filter(id => id !== carId));
        setWishlistCars(prev => prev.filter(c => c.id !== carId));
      } else {
        await wishlistService.addToWishlist(carId);
        setWishlistIds(prev => [...prev, carId]);
        loadWishlist();
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const isInWishlist = (carId) => wishlistIds.includes(carId);

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      wishlistCars,
      loading,
      toggleWishlist,
      isInWishlist,
      loadWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
