const express = require('express');
const multer = require('multer');
const path = require('path');
const Food = require('../models/Food');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
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
    const food = await Food.create({ ...req.body, image: req.file.filename });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.image = req.file.filename;
  const food = await Food.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(food);
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: 'Food deleted' });
});

module.exports = router;
