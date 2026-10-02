const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/add', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  const user = await User.findById(req.user.id);
  const cart = user.cartData || {};
  cart[itemId] = (cart[itemId] || 0) + 1;
  await User.findByIdAndUpdate(req.user.id, { cartData: cart });
  res.json({ message: 'Added to cart', cart });
});

router.post('/remove', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  const user = await User.findById(req.user.id);
  const cart = user.cartData || {};
  if (cart[itemId] > 1) cart[itemId]--;
  else delete cart[itemId];
  await User.findByIdAndUpdate(req.user.id, { cartData: cart });
  res.json({ message: 'Removed from cart', cart });
});

router.get('/get', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ cart: user.cartData || {} });
});

router.post('/clear', authMiddleware, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { cartData: {} });
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
