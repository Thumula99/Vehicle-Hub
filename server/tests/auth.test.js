const request = require('supertest');
const { app } = require('../server');

describe('Authentication API Tests', () => {
  const testEmail = `testuser_${Date.now()}@autohub.com`;
  let authToken = '';

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Runner',
        email: testEmail,
        password: 'Password123!',
        role: 'buyer'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('should reject duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Test',
        email: testEmail,
        password: 'Password123!',
        role: 'buyer'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'Password123!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  it('should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should fetch profile with valid JWT', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
  });
});
