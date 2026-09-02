const request = require('supertest');
const { app } = require('../server');

describe('Wishlist API Tests', () => {
  it('should reject unauthenticated wishlist requests', async () => {
    const res = await request(app).get('/api/users/me/wishlist');
    expect(res.statusCode).toBe(401);
  });
});
