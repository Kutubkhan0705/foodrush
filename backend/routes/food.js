const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const Food = require('../models/Food');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'foodrush', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== 'All' ? { category } : {};
  const foods = await Food.find(filter);
  res.json(foods);
});

router.get('/:id', async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.json(food);
});

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const food = await Food.create({ ...req.body, image: req.file.path });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.image = req.file.path;
  const food = await Food.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(food);
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: 'Food deleted' });
});

module.exports = router;
