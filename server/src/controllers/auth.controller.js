const User = require('../models/user.model');

// Get current authenticated user
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(req.user._id).select('-__v');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Successfully logged out' });
  });
};

// Update user type (recruiter/candidate)
exports.updateUserType = async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { userType } = req.body;

    if (!userType || !['recruiter', 'candidate'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { userType },
      { new: true }
    ).select('-__v');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
