const express = require('express');
const router = express.Router();
const products = require('../data/products');
const cartRouter = require('./cart');

// POST /api/checkout
router.post('/', (req, res) => {
  const cart = cartRouter.getCart();

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const orderItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product ? product.name : 'Unknown',
      price: product ? product.price : 0,
      qty: item.qty,
      subtotal: product ? product.price * item.qty : 0,
    };
  });

  const total = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
  const orderId = `ORD-${Date.now()}`;

  // Clear cart after successful checkout
  cartRouter.clearCart();

  return res.status(200).json({
    success: true,
    orderId,
    items: orderItems,
    total,
    message: 'Order placed successfully! Thank you for shopping with ShopSmart.',
  });
});

module.exports = router;
