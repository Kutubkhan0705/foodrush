const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/food', require('./routes/food'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/order', require('./routes/order'));
app.use('/api/payment', require('./routes/payment'));

app.get('/', (req, res) => res.json({ message: 'FoodRush API Running' }));

app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Food = require('./models/Food');
    const bcrypt = require('bcryptjs');
    const admin = await User.findOne({ email: 'admin@foodrush.com' });
    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin', email: 'admin@foodrush.com', password: hashed, role: 'admin' });
    }
    const count = await Food.countDocuments();
    if (count === 0) {
      const foods = [
        { name: 'Classic Chicken Burger', description: 'Juicy grilled chicken patty with lettuce, tomato and special sauce', price: 149, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.5, prepTime: '15-20 min' },
        { name: 'Double Beef Smash Burger', description: 'Double smashed beef patty with cheddar cheese and caramelized onions', price: 199, category: 'Burger', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', rating: 4.8, prepTime: '20-25 min' },
        { name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella and basil on thin crust', price: 249, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.6, prepTime: '25-30 min' },
        { name: 'Chicken BBQ Pizza', description: 'Smoky BBQ sauce, grilled chicken, onions and bell peppers', price: 349, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', rating: 4.7, prepTime: '25-30 min' },
        { name: 'Chicken Dum Biryani', description: 'Slow cooked aromatic basmati rice with tender chicken pieces', price: 249, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.9, prepTime: '30-40 min' },
        { name: 'Mutton Biryani', description: 'Rich and flavorful mutton biryani with saffron and fried onions', price: 349, category: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', rating: 4.8, prepTime: '35-45 min' },
        { name: 'Chicken Fried Rice', description: 'Wok tossed rice with egg, chicken and vegetables in soy sauce', price: 179, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.4, prepTime: '20-25 min' },
        { name: 'Veg Hakka Noodles', description: 'Stir fried noodles with colorful vegetables in Indo-Chinese style', price: 149, category: 'Chinese', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', rating: 4.3, prepTime: '15-20 min' },
        { name: 'Masala Dosa', description: 'Crispy golden dosa filled with spiced potato masala, served with sambar', price: 99, category: 'South Indian', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', rating: 4.7, prepTime: '15-20 min' },
        { name: 'Belgian Chocolate Scoop', description: 'Rich creamy Belgian chocolate ice cream with chocolate chips', price: 99, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', rating: 4.8, prepTime: '5 min' },
        { name: 'Mango Lassi', description: 'Thick creamy yogurt drink blended with fresh Alphonso mangoes', price: 79, category: 'Drinks', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', rating: 4.7, prepTime: '5 min' },
        { name: 'Chicken Kathi Roll', description: 'Spicy chicken tikka wrapped in flaky paratha with onions and chutney', price: 129, category: 'Rolls', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', rating: 4.6, prepTime: '15-20 min' },
      ];
      await Food.insertMany(foods);
    }
    res.json({ success: true, message: 'Seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
