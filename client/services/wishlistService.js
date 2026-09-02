import api from './api';

export const wishlistService = {
  async getWishlist() {
    const res = await api.get('/users/me/wishlist');
    return res.data;
  },

  async addToWishlist(carId) {
    const res = await api.post(`/users/me/wishlist/${carId}`);
    return res.data;
  },

  async removeFromWishlist(carId) {
    const res = await api.delete(`/users/me/wishlist/${carId}`);
    return res.data;
  }
};
