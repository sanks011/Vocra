const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');

// @route   GET /api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL || 'https://vocra-eight.vercel.app'}/login`, 
    session: true 
  }),
  (req, res) => {
    // Successful authentication
    // Check if user has a userType set
    const clientUrl = process.env.CLIENT_URL || 'https://vocra-eight.vercel.app';
    if (req.user && req.user.userType && req.user.userType !== null) {
      // User has a role, redirect to dashboard
      res.redirect(`${clientUrl}/dashboard`);
    } else {
      // User doesn't have a role set, redirect to profile setup
      res.redirect(`${clientUrl}/profile-setup`);
    }
  }
);

// @route   GET /api/auth/current
// @desc    Get current user
// @access  Private
router.get('/current', authController.getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authController.logout);

// @route   PUT /api/auth/user-type
// @desc    Update user type (recruiter/candidate)
// @access  Private
router.put('/user-type', authController.updateUserType);

module.exports = router;
