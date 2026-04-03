const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { name, email, phone, doctor, mode, date, time, duration, service, notes, therapistId } = req.body;

    const appointment = new Appointment({
      user: req.user._id,
      therapistId,
      name,
      email,
      phone,
      doctor,
      mode,
      date,
      time,
      duration,
      service,
      notes,
    });

    const createdAppointment = await appointment.save();

    // Setup Notification for patient
    await Notification.create({
      user: req.user._id,
      type: 'appointment',
      title: 'Appointment Booked',
      message: `Your ${mode} appointment with ${doctor} is scheduled for ${date} at ${time}.`,
      link: '/dashboard'
    });

    // Also attempt to notify the therapist if they exist in the DB by that exact name
    let therapist = null;
    try { 
      therapist = (therapistId && therapistId.length === 24) 
        ? await User.findById(therapistId) 
        : await User.findOne({ name: doctor, role: 'therapist' }); 
    } catch(err) {}

    if (therapist) {
      await Notification.create({
        user: therapist._id,
        type: 'appointment',
        title: 'New Patient Booking',
        message: `${name} has booked a ${mode} session for ${date} at ${time}.`,
        link: '/therapist'
      });
    }

    res.status(201).json({
      success: true,
      data: createdAppointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's appointments (Paginated & Sorted)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let query = { user: req.user._id, ...(status && { status }) };
    
    if (req.user.role === 'therapist') {
        // Find appointments specifically assigned to this therapist by name or ID
        query = { $or: [{ doctor: req.user.name }, { therapistId: req.user._id }], ...(status && { status }) };
    }

    // Support populating the user reference to show Patient names to therapists
    const appointments = await Appointment.find(query)
      .populate('user', 'name email avatar age gender')
      .sort({ date: -1, time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: appointments,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await appointment.deleteOne();
    res.json({ success: true, message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== 'therapist' && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    // Notify user of status change
    await Notification.create({
      user: appointment.user,
      type: 'system',
      title: 'Appointment Updated',
      message: `Your appointment status has been changed to ${status}.`,
      link: '/dashboard'
    });

    res.json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};