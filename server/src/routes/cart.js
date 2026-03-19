const express = require('express');
const router = express.Router();
const products = require('../data/products');

// In-memory cart: [{ productId, qty }]
let cart = [];

// GET /api/cart
router.get('/', (req, res) => {
  const enriched = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  });
  res.json({ items: enriched, count: cart.reduce((a, i) => a + i.qty, 0) });
});

// POST /api/cart  — body: { productId, qty }
router.post('/', (req, res) => {
  const { productId, qty = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  const product = products.find((p) => p.id === Number(productId));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = cart.find((i) => i.productId === Number(productId));
  if (existing) {
    existing.qty += Number(qty);
  } else {
    cart.push({ productId: Number(productId), qty: Number(qty) });
  }

  const enriched = cart.map((item) => {
    const p = products.find((pr) => pr.id === item.productId);
    return { ...item, product: p };
  });

  return res.status(201).json({ items: enriched, count: cart.reduce((a, i) => a + i.qty, 0) });
});

// DELETE /api/cart/:productId
router.delete('/:productId', (req, res) => {
  const id = parseInt(req.params.productId, 10);
  const before = cart.length;
  cart = cart.filter((i) => i.productId !== id);

  if (cart.length === before) {
    return res.status(404).json({ error: 'Item not in cart' });
  }

  return res.json({ success: true, count: cart.reduce((a, i) => a + i.qty, 0) });
});

// Expose cart reference for checkout route to reset
router.clearCart = () => {
  cart = [];
};
router.getCart = () => cart;

module.exports = router;
