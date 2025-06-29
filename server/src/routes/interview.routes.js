const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const webhookController = require('../controllers/webhook.controller');
const debugController = require('../controllers/debug.controller');

// Middleware to handle CORS for webhook endpoints
const webhookCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Webhook endpoint for Omnidimension to send interview results
router.post('/webhook/omnidimension', webhookCors, webhookController.handleOmnidimensionWebhook);

// Context endpoint for Omnidimension to get interview details
router.get('/webhook/context', webhookCors, webhookController.getInterviewContext);

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

// Debug routes for manual testing and troubleshooting
router.get('/debug/active', isAuthenticated, debugController.listActiveInterviews);
router.get('/debug/:interviewId/status', isAuthenticated, debugController.checkInterviewStatus);
router.post('/debug/:interviewId/process', isAuthenticated, debugController.forceProcessCall);
router.post('/debug/process-stale', isAuthenticated, debugController.processStaleInterviews);

module.exports = router;
