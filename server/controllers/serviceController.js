const Service = require('../models/Service');
const Therapist = require('../models/Therapist');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single service by slug (and related therapists)
// @route   GET /api/services/:slug
// @access  Public
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const therapists = await Therapist.find({ specialties: service.category, available: true }).limit(4);

    res.status(200).json({ success: true, data: { service, therapists } });     
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

