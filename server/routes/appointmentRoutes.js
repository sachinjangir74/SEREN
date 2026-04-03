const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../middleware/validate');

const createAppointmentSchema = {
  body: z.object({
    therapistId: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    timeSlot: z.string().optional(),
    duration: z.number().optional()
  }).passthrough()
};

const updateStatusSchema = {
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    status: z.enum(['scheduled', 'completed', 'cancelled', 'no-show'])
  })
};
const {
  createAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

router.route('/')
  .post(protect, validate(createAppointmentSchema), createAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .delete(protect, deleteAppointment);

router.route('/:id/status')
  .patch(protect, validate(updateStatusSchema), updateAppointmentStatus);

module.exports = router;
