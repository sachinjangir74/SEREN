const express = require('express');
const router = express.Router();
const { createMood, getMoods, resetWeekMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createMood)
  .get(protect, getMoods);

router.get('/user', protect, getMoods);
router.delete('/reset-week', protect, resetWeekMoods);

module.exports = router;
