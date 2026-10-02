const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const exists = await User.findOne({ email: 'admin@foodrush.com' });
  if (exists) { console.log('Admin already exists'); process.exit(); }
  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@foodrush.com', password: hashed, role: 'admin' });
  console.log('✅ Admin created: admin@foodrush.com / admin123');
  process.exit();
}).catch(err => { console.error(err); process.exit(1); });
