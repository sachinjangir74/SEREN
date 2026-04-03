const Assessment = require('../models/Assessment');

// @desc    Get assessment details by slug (so frontend can render questions)
// @route   GET /api/assessments/:slug
// @access  Public
exports.getAssessmentBySlug = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ slug: req.params.slug });
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    
    // Check if user is logged in
    if (req.user) {
      req.user.assessmentResults.push({
        assessmentSlug: slug,
        score: totalScore,
        severity: result ? result.severity : 'Unknown',
        date: new Date()
      });
      await req.user.save();
    }

    res.status(200).json({
 success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Submit assessment answers and get results
// @route   POST /api/assessments/:slug/submit
// @access  Public
exports.submitAssessment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { answers } = req.body; 
    // Expecting answers to be an array of numbers (scores for each question)
    // Example: { "answers": [2, 3, 1, 0, 2] }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Please provide an array of answer scores.' });
    }

    const assessment = await Assessment.findOne({ slug });
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    // Calculate total score
    const totalScore = answers.reduce((acc, curr) => acc + Number(curr), 0);

    // Find matching threshold
    let result = null;
    for (let threshold of assessment.scoreThresholds) {
      if (totalScore >= threshold.minScore && totalScore <= threshold.maxScore) {
        result = threshold;
        break;
      }
    }

    // Fallback if score logic misses boundaries somehow
    if (!result && assessment.scoreThresholds.length > 0) {
      result = assessment.scoreThresholds[assessment.scoreThresholds.length - 1];
    }

    // Save to user profile if user is logged in
    if (req.user) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          assessmentResults: {
            assessmentSlug: slug,
            score: totalScore,
            severity: result ? result.severity : 'Unknown',
            date: new Date()
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        assessmentTitle: assessment.title,
        totalScore,
        severity: result ? result.severity : 'Unknown',
        recommendation: result ? result.recommendation : 'Please consult a professional.',
        suggestedProgramSlug: result ? result.suggestedProgramSlug : null
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
