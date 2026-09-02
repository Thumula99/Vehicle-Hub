const request = require('supertest');
const { app } = require('../server');

describe('Feature 4: Search, Filters & Comparison Test Suite', () => {
  it('should search cars by keyword case-insensitively', async () => {
    const res = await request(app).get('/api/cars?keyword=toyota');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.cars)).toBe(true);
    res.body.cars.forEach(car => {
      const match = car.title.toLowerCase().includes('toyota') ||
                    car.make.toLowerCase().includes('toyota') ||
                    car.description.toLowerCase().includes('toyota');
      expect(match).toBe(true);
    });
  });

  it('should filter cars by combined price and year range', async () => {
    const res = await request(app).get('/api/cars?minPrice=5000000&maxPrice=10000000&minYear=2018');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.cars.forEach(car => {
      expect(Number(car.price)).toBeGreaterThanOrEqual(5000000);
      expect(Number(car.price)).toBeLessThanOrEqual(10000000);
      expect(Number(car.year)).toBeGreaterThanOrEqual(2018);
    });
  });

  it('should filter by fuelType and transmission', async () => {
    const res = await request(app).get('/api/cars?fuelType=Hybrid&transmission=Automatic');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.cars.forEach(car => {
      expect(car.fuelType.toLowerCase()).toBe('hybrid');
      expect(car.transmission.toLowerCase()).toBe('automatic');
    });
  });

  it('should sort cars by price ascending', async () => {
    const res = await request(app).get('/api/cars?sort=price_asc');
    expect(res.statusCode).toBe(200);
    const cars = res.body.cars;
    for (let i = 0; i < cars.length - 1; i++) {
      expect(Number(cars[i].price)).toBeLessThanOrEqual(Number(cars[i + 1].price));
    }
  });

  it('should paginate car results accurately', async () => {
    const res = await request(app).get('/api/cars?page=1&limit=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(1);
    expect(res.body.cars.length).toBeLessThanOrEqual(1);
  });

  it('should compare between 2 and 4 vehicles successfully', async () => {
    const res = await request(app).get('/api/cars/compare?ids=car-001,car-002');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cars.length).toBe(2);
    expect(res.body.highlights).toBeDefined();
    expect(res.body.highlights.lowestPrice).toBeDefined();
  });

  it('should reject comparison with less than 2 vehicles', async () => {
    const res = await request(app).get('/api/cars/compare?ids=car-001');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject comparison with more than 4 vehicles', async () => {
    const res = await request(app).get('/api/cars/compare?ids=car-001,car-002,car-003,car-004,car-005');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
