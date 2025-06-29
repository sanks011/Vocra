const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const { uploadResume } = require('../middleware/upload.middleware');
const jobsController = require('../controllers/jobs.controller');

// Route handlers using the controller functions
// These must be placed BEFORE any parameterized routes like '/:id'

// GET /api/jobs/recruiter/jobs - Get all jobs for a recruiter
router.get('/recruiter/jobs', isAuthenticated, jobsController.getRecruiterJobs);

// GET /api/jobs/recruiter/stats - Get job statistics  
router.get('/recruiter/stats', isAuthenticated, jobsController.getJobStats);

// GET /api/jobs/recruiter/analytics - Get application analytics
router.get('/recruiter/analytics', isAuthenticated, jobsController.getApplicationAnalytics);

// GET /api/jobs/my-jobs - Get jobs posted by the authenticated recruiter
router.get('/my-jobs', isAuthenticated, jobsController.getMyJobs);

// GET /api/jobs - Get all job postings (public route)
router.get('/', jobsController.getAllJobs);

// GET /api/jobs/:id - Get specific job posting
router.get('/:id', jobsController.getJobById);

// POST /api/jobs - Create new job posting (recruiters only)
router.post('/', isAuthenticated, jobsController.createJob);

// PUT /api/jobs/:id - Update job posting (recruiters only, own jobs)
router.put('/:id', isAuthenticated, jobsController.updateJob);

// DELETE /api/jobs/:id - Delete job posting (recruiters only, own jobs)
router.delete('/:id', isAuthenticated, jobsController.deleteJob);

// POST /api/jobs/:id/apply - Apply for a job (candidates only)
router.post('/:id/apply', isAuthenticated, uploadResume, jobsController.applyForJob);

// GET /api/jobs/:id/application-status - Check if user has applied for a job
router.get('/:id/application-status', isAuthenticated, jobsController.checkApplicationStatus);

// PUT /api/jobs/:id/applicants/:applicantId - Update application status
router.put('/:id/applicants/:applicantId', isAuthenticated, jobsController.updateApplicationStatus);

// GET /api/jobs/recruiter/applications - Get all applications for recruiter's jobs
router.get('/recruiter/applications', isAuthenticated, jobsController.getRecruiterApplications);

// GET /api/jobs/candidate/applications - Get applications for the authenticated candidate
router.get('/candidate/applications', isAuthenticated, jobsController.getCandidateApplications);

module.exports = router;
