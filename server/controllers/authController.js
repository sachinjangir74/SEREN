const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    console.log("--- Signup Request Start ---");
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const { name, email, password, username, age, gender, role } = req.body;
    const userEmail = email || username; 

    if (!userEmail || !password || !name) {
      console.warn("Signup missing fields:", { name, userEmail, hasPassword: !!password });
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password)' });
    }

    const userExists = await User.findOne({ email: userEmail });

    if (userExists) {
      console.warn("Signup email already exists:", userEmail);
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Role Escalation Prevention
    const userRole = (role === 'admin' || role === 'therapist') ? 'user' : (role || 'user');

    const user = await User.create({
      name,
      email: userEmail,
      password,
      age: age || undefined,
      gender: gender || 'prefer_not_to_say',
      role: userRole,
    });

    if (user) {
      console.log("Signup Success:", userEmail);
      user.password = undefined; 
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
          gender: user.gender,
          avatar: user.avatar,
          preferences: user.preferences,
          token: generateToken(user._id),
        }
      });
    } else {
      console.error("Signup failed to create user object");
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("--- Signup Internal Error ---");
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already registered (Caught by DB)' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const userEmail = email || username;

    if (!userEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email: userEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      user.password = undefined; // Don't send password back
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // Theme / Preferences enhancements
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        preferences: updatedUser.preferences,
        token: generateToken(updatedUser._id),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all therapists
// @route   GET /api/auth/therapists
// @access  Public
exports.getTherapists = async (req, res) => {
  try {
    const therapists = await User.find({ role: 'therapist' }).select('-password -preferences -email -role -createdAt -updatedAt');
    res.json({ success: true, data: therapists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Enroll in a program
// @route   POST /api/auth/enroll
// @access  Private
exports.enrollProgram = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { programSlug } = req.body;
    
    // Check if already enrolled
    const alreadyEnrolled = user.enrolledPrograms.find(p => p.programSlug === programSlug);
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this program' });
    }

    user.enrolledPrograms.push({
      programSlug,
      progress: 0,
    });

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
