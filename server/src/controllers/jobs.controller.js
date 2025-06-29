const Job = require('../models/job.model');
const User = require('../models/user.model');

// Get jobs posted by a specific recruiter
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .sort({ postedDate: -1 })
      .lean(); // lean() for better performance

    // Add applicants count for each job
    const jobsWithCount = jobs.map(job => ({
      ...job,
      applicantsCount: job.applicants ? job.applicants.length : 0
    }));

    res.status(200).json(jobsWithCount);
  } catch (error) {
    console.error('Error getting recruiter jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get job statistics
exports.getJobStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    
    // Get all jobs for this recruiter
    const jobs = await Job.find({ recruiter: recruiterId });
    
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'Active').length;
    const closedJobs = jobs.filter(job => job.status === 'Closed').length;
    
    // Calculate total applicants across all jobs
    const totalApplicants = jobs.reduce((total, job) => {
      return total + (job.applicants ? job.applicants.length : 0);
    }, 0);
    
    const stats = {
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplicants
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting job statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get application analytics
exports.getApplicationAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    
    // Get all jobs for this recruiter with applicants
    const jobs = await Job.find({ recruiter: recruiterId })
      .populate('applicants.user', 'name email')
      .sort({ postedDate: -1 });
    
    // Generate monthly data for the last 6 months
    const currentDate = new Date();
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[monthDate.getMonth()];
      
      // Count applications for this month
      let applications = 0;
      let interviews = 0;
      
      jobs.forEach(job => {
        if (job.applicants) {
          job.applicants.forEach(applicant => {
            const appliedDate = new Date(applicant.appliedDate);
            if (appliedDate.getMonth() === monthDate.getMonth() && 
                appliedDate.getFullYear() === monthDate.getFullYear()) {
              applications++;
              if (applicant.status === 'Interview' || applicant.status === 'Hired') {
                interviews++;
              }
            }
          });
        }
      });
      
      monthlyData.push({
        name: monthName,
        applications,
        interviews
      });
    }
    
    // Generate category data based on job types
    const categoryData = [];
    const typeCount = {};
    
    jobs.forEach(job => {
      typeCount[job.type] = (typeCount[job.type] || 0) + (job.applicants ? job.applicants.length : 0);
    });
    
    Object.entries(typeCount).forEach(([type, count]) => {
      categoryData.push({ name: type, count });
    });
    
    // Generate status data
    const statusCount = {
      'Open': 0,
      'Interview': 0,
      'Filled': 0
    };
    
    jobs.forEach(job => {
      if (job.status === 'Active') statusCount['Open']++;
      else if (job.status === 'Closed') statusCount['Filled']++;
      
      if (job.applicants) {
        job.applicants.forEach(applicant => {
          if (applicant.status === 'Interview') statusCount['Interview']++;
        });
      }
    });
    
    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
    
    res.status(200).json({
      monthlyData,
      categoryData,
      statusData
    });
  } catch (error) {
    console.error('Error getting application analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all jobs with optional filtering
exports.getAllJobs = async (req, res) => {
  try {
    const { search, status, type } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email avatar')
      .sort({ postedDate: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email avatar')
      .populate('applicants.user', 'name email avatar');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    console.log('=== CREATE JOB DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    console.log('Is authenticated:', req.isAuthenticated ? req.isAuthenticated() : 'No isAuthenticated method');
    
    const { title, company, location, type, salary, description } = req.body;

    if (!title || !company || !location || !type || !salary || !description) {
      console.log('Missing required fields:', { title, company, location, type, salary, description });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if req.user exists
    if (!req.user || !req.user.id) {
      console.log('No user in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if user is a recruiter
    const user = await User.findById(req.user.id);
    console.log('User found:', user);
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.userType !== 'recruiter') {
      console.log('User is not a recruiter:', user.userType);
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }

    const newJob = new Job({
      title,
      company,
      location,
      type,
      salary,
      description,
      recruiter: req.user.id
    });

    console.log('Saving new job:', newJob);
    const job = await newJob.save();
    console.log('Job saved successfully:', job);
    
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const { title, company, location, type, salary, description, status } = req.body;
    
    // Find job and check ownership
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if current user is the recruiter who posted the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    const jobFields = {};
    if (title) jobFields.title = title;
    if (company) jobFields.company = company;
    if (location) jobFields.location = location;
    if (type) jobFields.type = type;
    if (salary) jobFields.salary = salary;
    if (description) jobFields.description = description;
    if (status) jobFields.status = status;

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: jobFields },
      { new: true }
    ).populate('recruiter', 'name email avatar');

    res.status(200).json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job removed' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if job is active
    if (job.status !== 'Active') {
      return res.status(400).json({ message: 'This job is not accepting applications' });
    }

    // Check if user has already applied
    if (job.applicants.filter(app => app.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    job.applicants.push({ user: req.user.id });
    await job.save();

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id, applicantId } = req.params;
    
    if (!['Reviewing', 'Interview', 'Rejected', 'Hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const job = await Job.findById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Find and update applicant status
    const applicantIndex = job.applicants.findIndex(
      app => app.user.toString() === applicantId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    job.applicants[applicantIndex].status = status;
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get jobs posted by the authenticated recruiter (alias for getRecruiterJobs)
exports.getMyJobs = async (req, res) => {
  try {
    if (req.user.userType !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only recruiters can access this endpoint.'
      });
    }

    const jobs = await Job.find({ recruiter: req.user.id })
      .sort({ postedDate: -1 })
      .lean();

    const jobsWithCount = jobs.map(job => ({
      ...job,
      applicantsCount: job.applicants ? job.applicants.length : 0
    }));

    res.json({
      success: true,
      jobs: jobsWithCount,
      total: jobsWithCount.length
    });
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
