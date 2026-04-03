const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitAssessment, getAssessmentBySlug } = require('../controllers/assessmentController');

router.get('/:slug', getAssessmentBySlug);
router.post('/:slug/submit', protect, submitAssessment);

module.exports = router;
