const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

// Mock data for demonstration - In production, this would come from a database
let jobPostings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    status: "Active",
    description: "We're looking for an experienced frontend developer with React expertise to join our dynamic team. You'll be working on cutting-edge web applications and collaborating with cross-functional teams.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Modern CSS frameworks"],
    benefits: ["Health insurance", "Remote work", "Flexible hours", "Learning budget"],
    postedBy: "recruiter1",
    postedDate: new Date("2024-01-15"),
    applicants: 45
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Contract",
    salary: "$60,000 - $80,000",
    status: "Active",
    description: "Creative designer needed for innovative web applications. You'll be responsible for creating user-centered designs that enhance user experience and drive engagement.",
    requirements: ["3+ years UI/UX experience", "Figma proficiency", "Portfolio required"],
    benefits: ["Flexible schedule", "Creative freedom", "Modern equipment"],
    postedBy: "recruiter2",
    postedDate: new Date("2024-01-10"),
    applicants: 23
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    status: "Closed",
    description: "Node.js backend engineer for scalable microservices. Join our fast-growing startup and help build the infrastructure that powers our platform.",
    requirements: ["Node.js expertise", "Database experience", "API design skills"],
    benefits: ["Equity package", "Health insurance", "Gym membership", "Team events"],
    postedBy: "recruiter1",
    postedDate: new Date("2023-12-20"),
    applicants: 67
  }
];

// GET /api/jobs - Get all job postings (public route)
router.get('/', (req, res) => {
  try {
    const { search, location, type, status } = req.query;
    let filteredJobs = [...jobPostings];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }

    if (status) {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }

    // For public access, only return active jobs and remove sensitive info
    const publicJobs = filteredJobs
      .filter(job => job.status === 'Active')
      .map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        postedDate: job.postedDate,
        applicants: job.applicants
      }));

    res.json({
      success: true,
      jobs: publicJobs,
      total: publicJobs.length
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/jobs/my-jobs - Get jobs posted by the authenticated recruiter
router.get('/my-jobs', auth, (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only recruiters can access this endpoint.'
      });
    }

    const myJobs = jobPostings.filter(job => job.postedBy === req.user.id);
    
    res.json({
      success: true,
      jobs: myJobs,
      total: myJobs.length
    });
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/jobs/:id - Get specific job posting
router.get('/:id', (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const job = jobPostings.find(j => j.id === jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Remove sensitive info for public access
    const publicJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      postedDate: job.postedDate,
      status: job.status,
      applicants: job.applicants
    };

    res.json({
      success: true,
      job: publicJob
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/jobs - Create new job posting (recruiters only)
router.post('/', auth, (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only recruiters can post jobs.'
      });
    }

    const { title, company, location, type, salary, description, requirements, benefits } = req.body;

    // Validation
    if (!title || !company || !location || !type || !salary || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create new job posting
    const newJob = {
      id: Math.max(...jobPostings.map(j => j.id)) + 1,
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements: requirements || [],
      benefits: benefits || [],
      status: 'Active',
      postedBy: req.user.id,
      postedDate: new Date(),
      applicants: 0
    };

    jobPostings.push(newJob);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/jobs/:id - Update job posting (recruiters only, own jobs)
router.put('/:id', auth, (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only recruiters can update jobs.'
      });
    }

    const jobId = parseInt(req.params.id);
    const jobIndex = jobPostings.findIndex(j => j.id === jobId);

    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const job = jobPostings[jobIndex];

    // Check if the recruiter owns this job
    if (job.postedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own job postings.'
      });
    }

    // Update job
    const updatedJob = {
      ...job,
      ...req.body,
      id: jobId, // Prevent ID change
      postedBy: job.postedBy, // Prevent owner change
      postedDate: job.postedDate, // Keep original posting date
      applicants: job.applicants // Keep applicant count
    };

    jobPostings[jobIndex] = updatedJob;

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/jobs/:id - Delete job posting (recruiters only, own jobs)
router.delete('/:id', auth, (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only recruiters can delete jobs.'
      });
    }

    const jobId = parseInt(req.params.id);
    const jobIndex = jobPostings.findIndex(j => j.id === jobId);

    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const job = jobPostings[jobIndex];

    // Check if the recruiter owns this job
    if (job.postedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own job postings.'
      });
    }

    // Remove job from array
    jobPostings.splice(jobIndex, 1);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/jobs/:id/apply - Apply for a job (candidates only)
router.post('/:id/apply', auth, (req, res) => {
  try {
    if (req.user.userType !== 'candidate') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only candidates can apply for jobs.'
      });
    }

    const jobId = parseInt(req.params.id);
    const job = jobPostings.find(j => j.id === jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // In a real application, you would store the application in a database
    // For now, just increment the applicant count
    job.applicants += 1;

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
