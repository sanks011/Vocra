const User = require('../models/user.model');

// Get current authenticated user
exports.getCurrentUser = async (req, res) => {
  try {
    console.log('Session ID:', req.sessionID);
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('User from session:', req.user);
    
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(req.user._id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
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
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    // Destroy the session completely
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: 'Error destroying session' });
      }
      // Clear the session cookie with correct options for cross-site
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN || undefined
      });
      res.status(200).json({ message: 'Successfully logged out' });
    });
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
