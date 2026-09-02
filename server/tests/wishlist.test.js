const request = require('supertest');
const { app } = require('../server');

describe('Feature 4: Wishlist Test Suite', () => {
  let authToken = '';
  const testEmail = `wishlist_tester_${Date.now()}@autohub.com`;

  beforeAll(async () => {
    // Register user for wishlist testing
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Wishlist Tester',
        email: testEmail,
        password: 'Password123!',
        role: 'buyer'
      });
    authToken = res.body.token;
  });

  it('should reject unauthenticated wishlist requests', async () => {
    const res = await request(app).get('/api/users/me/wishlist');
    expect(res.statusCode).toBe(401);
  });

  it('should return initial empty wishlist for new user', async () => {
    const res = await request(app)
      .get('/api/users/me/wishlist')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.wishlist).toEqual([]);
  });

  it('should add a valid vehicle to user wishlist', async () => {
    const res = await request(app)
      .post('/api/users/me/wishlist/car-001')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.wishlist).toContain('car-001');
  });

  it('should prevent duplicate wishlist entries', async () => {
    const res = await request(app)
      .post('/api/users/me/wishlist/car-001')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    const count = res.body.wishlist.filter(id => id === 'car-001').length;
    expect(count).toBe(1);
  });

  it('should fetch populated wishlist with car details', async () => {
    const res = await request(app)
      .get('/api/users/me/wishlist')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.wishlist.length).toBe(1);
    expect(res.body.wishlist[0].id).toBe('car-001');
    expect(res.body.wishlist[0].title).toBeDefined();
  });

  it('should remove a vehicle from user wishlist', async () => {
    const res = await request(app)
      .delete('/api/users/me/wishlist/car-001')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.wishlist).not.toContain('car-001');
  });
});
