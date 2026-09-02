const request = require('supertest');
const { app } = require('../server');

describe('Messaging API Tests', () => {
  it('should reject unauthenticated message requests', async () => {
    const res = await request(app).get('/api/messages/conversations');
    expect(res.statusCode).toBe(401);
  });
});
