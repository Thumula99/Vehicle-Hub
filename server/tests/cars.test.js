const request = require('supertest');
const { app } = require('../server');

describe('Cars & Listings API Tests', () => {
  it('should fetch public car listings', async () => {
    const res = await request(app).get('/api/cars');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.cars)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('should reject unauthenticated car creation', async () => {
    const res = await request(app)
      .post('/api/cars')
      .send({
        title: 'Unauthorized Car',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        price: 5000000
      });

    expect(res.statusCode).toBe(401);
  });
});
