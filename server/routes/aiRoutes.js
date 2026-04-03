const express = require("express");
const router = express.Router();
const { getChatCompanionResponse, summarizeSession, getDashboardInsights } = require("../controllers/aiController");

// AI Route for Companion Chatbot
router.post("/companion", getChatCompanionResponse);

// AI Route for Session Summarization
router.post("/summarize", summarizeSession);

// AI Route for Intelligent Dashboard Insights
const { protect } = require("../middleware/auth");
router.get("/insights", protect, getDashboardInsights);

module.exports = router;