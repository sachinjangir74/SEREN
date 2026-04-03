const Mood = require('../models/Mood');
const User = require('../models/User');

exports.createMood = async (req, res) => {
  try {
    const { mood, note } = req.body;
    if (!mood) {
      return res.status(400).json({ success: false, message: 'Please provide a mood' });
    }
    const newMood = await Mood.create({
      user: req.user._id,
      mood,
      note
    });

    // Gamification Tracker: Update Streak
    const user = await User.findById(req.user._id);
    if (user) {
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const lastActive = user.gamification?.lastActiveDate ? new Date(user.gamification.lastActiveDate) : null;
      if (lastActive) lastActive.setHours(0,0,0,0);

      let currentStreak = user.gamification?.currentStreak || 0;
      let longestStreak = user.gamification?.longestStreak || 0;
      let badges = user.gamification?.badges || [];

      // Check if logged yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (!lastActive || lastActive < yesterday) {
        // Reset or start new streak
        currentStreak = 1;
      } else if (lastActive.getTime() === yesterday.getTime()) {
        // Consecutive day
        currentStreak += 1;
      }
      
      if (currentStreak > longestStreak) longestStreak = currentStreak;

      if (currentStreak >= 7 && !badges.includes('7-Day Star')) {
        badges.push('7-Day Star');
      }

      await User.findByIdAndUpdate(req.user._id, {
        $set: {
          'gamification.currentStreak': currentStreak,
          'gamification.longestStreak': longestStreak,
          'gamification.lastActiveDate': today,
          'gamification.badges': badges
        }
      });
    }

    res.status(201).json({ success: true, data: newMood });
  } catch (error) {
    console.error("CREATE MOOD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMoods = async (req, res) => {
  try {
    // Get last 60 days of moods instead of a fixed limit to support the 30-day dashboard fully
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const moods = await Mood.find({ 
      user: req.user._id,
      createdAt: { $gte: sixtyDaysAgo }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: moods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetWeekMoods = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as start of week

    await Mood.deleteMany({
      user: req.user._id,
      createdAt: { $gte: startOfWeek }
    });

    res.status(200).json({ success: true, message: 'Current week data reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
