const Program = require('../models/Program');

// @desc    Get all active programs
// @route   GET /api/programs
// @access  Public
exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true });
    res.status(200).json({ success: true, count: programs.length, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single program by slug
// @route   GET /api/programs/:slug
// @access  Public
exports.getProgramBySlug = async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug, isActive: true });
    
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    res.status(200).json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const ProgramProgress = require('../models/ProgramProgress');
const User = require('../models/User');

// @desc    Get user's enrolled programs
// @route   GET /api/programs/my-programs
// @access  Private
exports.getMyPrograms = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const enrolledSlugs = user.enrolledPrograms.map(p => p.programSlug);
    if (enrolledSlugs.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Also get their progress documents
    const progresses = await ProgramProgress.find({ user: req.user._id });
    
    // Get full program details
    const programs = await Program.find({ slug: { $in: enrolledSlugs } });

    // Map them together
    const enrichedPrograms = programs.map(prog => {
      const progDoc = progresses.find(p => p.programSlug === prog.slug);
      const enrollmentInfo = user.enrolledPrograms.find(p => p.programSlug === prog.slug);
      
      return {
        ...prog.toObject(),
        progress: progDoc ? progDoc : { completedSteps: [] },
        percentage: enrollmentInfo ? enrollmentInfo.progress : 0
      };
    });

    res.status(200).json({ success: true, data: enrichedPrograms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get specific program progress
// @route   GET /api/programs/:slug/progress
// @access  Private
exports.getProgramProgress = async (req, res) => {
  try {
    let progress = await ProgramProgress.findOne({ user: req.user._id, programSlug: req.params.slug });
    
    if (!progress) {
      // Initialize if it doesn't exist but they should be enrolled
      progress = await ProgramProgress.create({
        user: req.user._id,
        programSlug: req.params.slug,
        completedSteps: []
      });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Mark a module/step as complete
// @route   POST /api/programs/:slug/modules/:moduleId/complete
// @access  Private
exports.markModuleComplete = async (req, res) => {
  try {
    const { slug, moduleId } = req.params;
    
    let progress = await ProgramProgress.findOne({ user: req.user._id, programSlug: slug });
    if (!progress) {
      progress = new ProgramProgress({ user: req.user._id, programSlug: slug, completedSteps: [] });
    }

    if (!progress.completedSteps.includes(moduleId)) {
      progress.completedSteps.push(moduleId);
      progress.lastAccessed = Date.now();
    }
    
    // Auto-calculate percentage to sync with User.js
    const program = await Program.findOne({ slug });
    if (program && program.modules && program.modules.length > 0) {
      const percentage = Math.round((progress.completedSteps.length / program.modules.length) * 100);
      progress.isCompleted = percentage === 100;
      
      // Sync with User
      await User.updateOne(
        { _id: req.user._id, 'enrolledPrograms.programSlug': slug },
        { '$set': { 'enrolledPrograms.$.progress': percentage } }
      );
    }

    await progress.save();
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
