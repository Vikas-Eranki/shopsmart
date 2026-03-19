const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api/products', () => {
  it('should return 200 with an array of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return products matching a search query', async () => {
    const res = await request(app).get('/api/products?search=headphones');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name.toLowerCase()).toContain('headphones');
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=Electronics');
    expect(res.statusCode).toEqual(200);
    res.body.forEach((p) => {
      expect(p.category).toBe('Electronics');
    });
  });

  it('should return empty array for non-matching search', async () => {
    const res = await request(app).get('/api/products?search=xyznonexistent999');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/products/:id', () => {
  it('should return a product by id', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('price');
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/categories', () => {
  it('should return an array of categories including "All"', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('All');
    expect(res.body).toContain('Electronics');
    expect(res.body).toContain('Fashion');
  });
});

describe('Cart API', () => {
  it('GET /api/cart should return an empty cart initially', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('count');
  });

  it('POST /api/cart should add a product to the cart', async () => {
    const res = await request(app).post('/api/cart').send({ productId: 1, qty: 1 });
    expect(res.statusCode).toEqual(201);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].productId).toBe(1);
  });

  it('POST /api/cart should return 400 when productId is missing', async () => {
    const res = await request(app).post('/api/cart').send({ qty: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/cart should return 404 for unknown productId', async () => {
    const res = await request(app).post('/api/cart').send({ productId: 9999, qty: 1 });
    expect(res.statusCode).toEqual(404);
  });

  it('DELETE /api/cart/:productId should remove item from cart', async () => {
    // Add first
    await request(app).post('/api/cart').send({ productId: 2, qty: 1 });
    // Then remove
    const res = await request(app).delete('/api/cart/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });
});

describe('POST /api/checkout', () => {
  it('should place an order when cart has items and clear cart', async () => {
    // Add an item first
    await request(app).post('/api/cart').send({ productId: 3, qty: 2 });

    const res = await request(app).post('/api/checkout');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('orderId');
    expect(res.body).toHaveProperty('total');
    expect(res.body.items.length).toBeGreaterThan(0);

    // Cart should now be empty
    const cartRes = await request(app).get('/api/cart');
    expect(cartRes.body.count).toBe(0);
  });
});
