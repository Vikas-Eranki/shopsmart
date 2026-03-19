const express = require('express');
const router = express.Router();
const products = require('../data/products');

// GET /api/products  (supports ?search= and ?category= query params)
router.get('/', (req, res) => {
  const { search, category } = req.query;

  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id, 10));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

// GET /api/categories
router.get('/meta/categories', (req, res) => {
  const categories = ['All', ...new Set(products.map((p) => p.category))];
  res.json(categories);
});

module.exports = router;
