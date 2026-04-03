const express = require('express');
const router = express.Router();
const { getTherapists } = require('../controllers/therapistController');

router.get('/', getTherapists);

module.exports = router;
