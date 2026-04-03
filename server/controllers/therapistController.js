const Therapist = require('../models/Therapist');

// @desc    Get all therapists (optionally filtered by category)
// @route   GET /api/therapists
// @access  Public
exports.getTherapists = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { available: true };
    if (category) {
      // Look for therapists that have the requested category in their specialties array
      query.specialties = category;
    }

    const therapists = await Therapist.find(query);
    
    res.status(200).json({ success: true, count: therapists.length, data: therapists });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
