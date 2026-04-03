const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/auth');
const { getChatCompanionResponse } = require('../controllers/aiController');

// @route   GET /api/chat/:room
// @desc    Get chat history for a room
router.get('/:room', protect, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ room: req.params.room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chat/ai
// @desc    Get AI response from Gemini Controller (Or fallback mock)
router.post('/ai', protect, getChatCompanionResponse);

module.exports = router;
