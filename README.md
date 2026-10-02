# 🍔 FoodRush - MERN Food Delivery App

## Project Structure
```
Food Delivery/
├── backend/        → Express + MongoDB API (Port 5000)
├── frontend/       → React User App (Port 5173)
└── admin/          → React Admin Panel (Port 5174)
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB running locally (or use MongoDB Atlas)
- Razorpay account (for payments)

### 2. Backend Setup
```bash
cd backend
# Edit .env file with your credentials
npm start
```

### 3. Seed Admin User
```bash
cd backend
node seedAdmin.js
# Admin: admin@foodrush.com / admin123
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### 5. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
# Opens at http://localhost:5174
```

## 🔑 Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## ✨ Features
- User Register / Login with JWT
- Browse food by categories (Burger, Pizza, Biryani, Ice Cream, etc.)
- Add to Cart / Remove from Cart
- Checkout with Razorpay Payment
- Order tracking with status
- Admin Panel: Add/Delete food, Manage orders, Dashboard stats
- Responsive UI

## 🍦 Food Categories
Burger, Pizza, Biryani, Chinese, South Indian, Dessert, Ice Cream, Drinks, Sandwich, Pasta, Rolls
