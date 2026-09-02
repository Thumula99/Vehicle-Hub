const request = require('supertest');
const { app } = require('../server');

describe('Search, Filters & Comparison Tests', () => {
  it('should search cars by keyword', async () => {
    const res = await request(app).get('/api/cars?keyword=Toyota');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should filter cars by price range', async () => {
    const res = await request(app).get('/api/cars?minPrice=5000000&maxPrice=7000000');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
