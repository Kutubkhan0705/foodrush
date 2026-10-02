const mongoose = require('mongoose');
require('dotenv').config();

const foods = [
  // Burgers
  { name: 'Classic Chicken Burger', description: 'Juicy grilled chicken patty with lettuce, tomato and special sauce', price: 149, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.5, prepTime: '15-20 min' },
  { name: 'Double Beef Smash Burger', description: 'Double smashed beef patty with cheddar cheese and caramelized onions', price: 199, category: 'Burger', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', rating: 4.8, prepTime: '20-25 min' },
  { name: 'Veggie Burger', description: 'Crispy aloo tikki patty with mint chutney and fresh veggies', price: 99, category: 'Burger', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', rating: 4.2, prepTime: '15-20 min' },

  // Pizza
  { name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella and basil on thin crust', price: 249, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', rating: 4.6, prepTime: '25-30 min' },
  { name: 'Chicken BBQ Pizza', description: 'Smoky BBQ sauce, grilled chicken, onions and bell peppers', price: 349, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', rating: 4.7, prepTime: '25-30 min' },
  { name: 'Paneer Tikka Pizza', description: 'Spicy paneer tikka with capsicum and onion on tandoori base', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', rating: 4.5, prepTime: '25-30 min' },

  // Biryani
  { name: 'Chicken Dum Biryani', description: 'Slow cooked aromatic basmati rice with tender chicken pieces', price: 249, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.9, prepTime: '30-40 min' },
  { name: 'Mutton Biryani', description: 'Rich and flavorful mutton biryani with saffron and fried onions', price: 349, category: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', rating: 4.8, prepTime: '35-45 min' },
  { name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables and whole spices', price: 179, category: 'Biryani', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', rating: 4.3, prepTime: '25-35 min' },

  // Chinese
  { name: 'Chicken Fried Rice', description: 'Wok tossed rice with egg, chicken and vegetables in soy sauce', price: 179, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.4, prepTime: '20-25 min' },
  { name: 'Veg Hakka Noodles', description: 'Stir fried noodles with colorful vegetables in Indo-Chinese style', price: 149, category: 'Chinese', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', rating: 4.3, prepTime: '15-20 min' },
  { name: 'Chicken Manchurian', description: 'Crispy chicken balls in spicy tangy Manchurian gravy', price: 199, category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', rating: 4.6, prepTime: '20-25 min' },

  // South Indian
  { name: 'Masala Dosa', description: 'Crispy golden dosa filled with spiced potato masala, served with sambar', price: 99, category: 'South Indian', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', rating: 4.7, prepTime: '15-20 min' },
  { name: 'Idli Sambar', description: 'Soft steamed rice cakes served with hot sambar and coconut chutney', price: 79, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', rating: 4.5, prepTime: '10-15 min' },
  { name: 'Uttapam', description: 'Thick rice pancake topped with onions, tomatoes and green chillies', price: 119, category: 'South Indian', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400', rating: 4.4, prepTime: '15-20 min' },

  // Ice Cream
  { name: 'Belgian Chocolate Scoop', description: 'Rich creamy Belgian chocolate ice cream with chocolate chips', price: 99, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', rating: 4.8, prepTime: '5 min' },
  { name: 'Mango Kulfi', description: 'Traditional Indian frozen dessert made with condensed milk and mango', price: 79, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', rating: 4.7, prepTime: '5 min' },
  { name: 'Strawberry Sundae', description: 'Vanilla ice cream topped with fresh strawberry sauce and whipped cream', price: 129, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', rating: 4.6, prepTime: '5 min' },

  // Dessert
  { name: 'Gulab Jamun', description: 'Soft milk solid dumplings soaked in rose flavored sugar syrup', price: 69, category: 'Dessert', image: 'https://images.unsplash.com/photo-1666195966573-f2c3e3e8b1e8?w=400', rating: 4.8, prepTime: '10 min' },
  { name: 'Chocolate Brownie', description: 'Warm fudgy chocolate brownie served with vanilla ice cream', price: 149, category: 'Dessert', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', rating: 4.7, prepTime: '10 min' },
  { name: 'Rasmalai', description: 'Soft cottage cheese patties in sweetened thickened milk with saffron', price: 89, category: 'Dessert', image: 'https://images.unsplash.com/photo-1666195966573-f2c3e3e8b1e8?w=400', rating: 4.9, prepTime: '10 min' },

  // Drinks
  { name: 'Mango Lassi', description: 'Thick creamy yogurt drink blended with fresh Alphonso mangoes', price: 79, category: 'Drinks', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', rating: 4.7, prepTime: '5 min' },
  { name: 'Cold Coffee', description: 'Chilled blended coffee with milk and ice cream, topped with cream', price: 99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', rating: 4.6, prepTime: '5 min' },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime juice with soda water, mint and black salt', price: 59, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', rating: 4.4, prepTime: '5 min' },

  // Sandwich
  { name: 'Grilled Chicken Sandwich', description: 'Grilled chicken breast with lettuce, cheese and chipotle mayo', price: 149, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', rating: 4.5, prepTime: '15 min' },
  { name: 'Veg Club Sandwich', description: 'Triple decker sandwich with paneer, veggies and green chutney', price: 119, category: 'Sandwich', image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400', rating: 4.3, prepTime: '10-15 min' },

  // Pasta
  { name: 'Penne Arrabbiata', description: 'Penne pasta in spicy tomato sauce with garlic and fresh basil', price: 199, category: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', rating: 4.5, prepTime: '20-25 min' },
  { name: 'Chicken Alfredo', description: 'Creamy white sauce pasta with grilled chicken and parmesan', price: 249, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', rating: 4.7, prepTime: '20-25 min' },

  // Rolls
  { name: 'Chicken Kathi Roll', description: 'Spicy chicken tikka wrapped in flaky paratha with onions and chutney', price: 129, category: 'Rolls', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', rating: 4.6, prepTime: '15-20 min' },
  { name: 'Paneer Tikka Roll', description: 'Marinated paneer tikka in soft paratha with mint chutney', price: 109, category: 'Rolls', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', rating: 4.5, prepTime: '15-20 min' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Food = require('./models/Food');
  await Food.deleteMany({});
  await Food.insertMany(foods);
  console.log(`✅ ${foods.length} food items seeded successfully!`);
  process.exit();
}).catch(err => { console.error(err); process.exit(1); });
