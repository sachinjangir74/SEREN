const express = require('express');
const router = express.Router();
const { getPrograms, getProgramBySlug, getMyPrograms, getProgramProgress, markModuleComplete } = require('../controllers/programController');
const { protect } = require('../middleware/auth');

router.get('/', getPrograms);
router.get('/my-programs', protect, getMyPrograms);
router.get('/:slug', getProgramBySlug);
router.get('/:slug/progress', protect, getProgramProgress);
router.post('/:slug/modules/:moduleId/complete', protect, markModuleComplete);

module.exports = router;
