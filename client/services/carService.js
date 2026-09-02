import api from './api';

export const carService = {
  async getCars(params = {}) {
    const res = await api.get('/cars', { params });
    return res.data;
  },

  async getCarById(id) {
    const res = await api.get(`/cars/${id}`);
    return res.data;
  },

  async createCar(formData) {
    const res = await api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async updateCar(id, formData) {
    const res = await api.put(`/cars/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async updateCarStatus(id, status) {
    const res = await api.patch(`/cars/${id}/status`, { status });
    return res.data;
  },

  async deleteCar(id) {
    const res = await api.delete(`/cars/${id}`);
    return res.data;
  },

  async getSellerListings() {
    const res = await api.get('/cars/seller/my-listings');
    return res.data;
  },

  async compareCars(carIds = []) {
    const res = await api.get('/cars/compare', {
      params: { ids: carIds.join(',') }
    });
    return res.data;
  }
};
