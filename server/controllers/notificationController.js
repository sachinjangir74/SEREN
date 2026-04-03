const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    if (notificationId === 'all') {
      await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    } else {
      const notification = await Notification.findById(notificationId);
      if (notification.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      notification.isRead = true;
      await notification.save();
    }
    res.status(200).json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};