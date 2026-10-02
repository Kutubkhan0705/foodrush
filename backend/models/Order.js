const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Food Processing', enum: ['Food Processing', 'Out for Delivery', 'Delivered', 'Cancelled'] },
  payment: { type: Boolean, default: false },
  paymentId: { type: String, default: '' },
  paymentMethod: { type: String, default: 'razorpay', enum: ['razorpay', 'cod'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
