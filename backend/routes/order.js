const express = require('express');
const Order = require('../models/Order');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/place', authMiddleware, async (req, res) => {
  try {
    const order = await Order.create({ userId: req.user.id, ...req.body });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/myorders', authMiddleware, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/status/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

module.exports = router;
