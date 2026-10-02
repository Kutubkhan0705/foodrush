const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    console.log('Razorpay KEY_ID:', process.env.RAZORPAY_KEY_ID);
    console.log('Amount received:', amount);
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay create-order error:', JSON.stringify(err, null, 2));
    res.status(500).json({ message: err.message || 'Razorpay error', error: err.error || err });
  }
});

router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');
    if (expectedSign === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { payment: true, paymentId: razorpay_payment_id });
      res.json({ success: true, message: 'Payment verified' });
    } else {
      console.error('Signature mismatch:', { expectedSign, razorpay_signature });
      res.status(400).json({ success: false, message: 'Payment verification failed - signature mismatch' });
    }
  } catch (err) {
    console.error('Verify error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
