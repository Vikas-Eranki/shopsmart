const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

app.use('/api/products', productsRouter);
app.use('/api/categories', (req, res) => {
  const products = require('./data/products');
  const categories = ['All', ...new Set(products.map((p) => p.category))];
  res.json(categories);
});
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
