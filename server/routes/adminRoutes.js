const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getStats, getUsers, getAppointments } = require('../controllers/adminController');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/appointments', getAppointments);

module.exports = router;
