const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../middleware/validate');

const registerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'therapist', 'admin']).optional().default('user')
  }).passthrough()
};

const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
};

const updateProfileSchema = {
  body: z.object({
    name: z.string().optional(),
    bio: z.string().optional()
  }).passthrough()
};
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getTherapists,
  enrollProgram
} = require('../controllers/authController');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.get('/therapists', getTherapists);

router.post('/enroll', protect, enrollProgram);

module.exports = router;
