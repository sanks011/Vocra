const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const interviewController = require('../controllers/interview.controller');

// Candidate routes
router.get('/candidate/interviews', isAuthenticated, interviewController.getCandidateInterviews);
router.post('/:interviewId/start', isAuthenticated, interviewController.startInterview);

// Recruiter routes
router.get('/recruiter/interviews', isAuthenticated, interviewController.getRecruiterInterviews);

// Shared routes (both candidate and recruiter)
router.get('/:interviewId/status', isAuthenticated, interviewController.getInterviewStatus);
router.get('/:interviewId/analytics', isAuthenticated, interviewController.getInterviewAnalytics);

// Admin/Recruiter only
router.put('/:interviewId/status', isAuthenticated, interviewController.updateInterviewStatus);

// Test route
router.get('/test', isAuthenticated, interviewController.testEndpoint);

module.exports = router;
