const Interview = require('../models/interview.model');
const Job = require('../models/job.model');
const User = require('../models/user.model');
const omnidimensionService = require('../services/omnidimension.service');
const cvProcessingService = require('../services/cv-processing.service');
const path = require('path');

// Create and schedule interview after job application
exports.scheduleInterview = async (jobId, candidateId, resumeUrl) => {
  try {
    // Get job and candidate details
    const job = await Job.findById(jobId).populate('recruiter');
    const candidate = await User.findById(candidateId);

    if (!job || !candidate) {
      throw new Error('Job or candidate not found');
    }

    // Set schedule and expiry (24 hours from now)
    const scheduledAt = new Date();
    const expiresAt = new Date(scheduledAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    // Create interview record
    const interview = new Interview({
      jobId: job._id,
      candidateId: candidate._id,
      recruiterId: job.recruiter._id,
      scheduledAt,
      expiresAt,
      jobContext: {
        title: job.title,
        description: job.description,
        requirements: job.requirements || [],
        company: job.company
      }
    });

    // Process CV if resume URL provided
    if (resumeUrl) {
      try {
        const resumePath = path.join(__dirname, '../uploads/resumes', path.basename(resumeUrl));
        const cvData = await cvProcessingService.extractTextFromCV(resumePath);
        
        interview.cvText = cvData.summary;
        interview.cvProcessed = true;
      } catch (error) {
        console.error('CV processing failed:', error.message);
        // Continue without CV processing
        interview.cvText = 'CV processing failed. Please conduct interview based on job requirements.';
      }
    }    // Create AI agent for this interview
    try {
      const agent = await omnidimensionService.createInterviewAgent(
        interview.jobContext,
        interview.cvText || 'No CV provided'
      );
      interview.agentId = agent.id;
      console.log(`Agent created successfully with ID: ${agent.id}`);
    } catch (error) {
      console.error('Agent creation failed:', error.message);
      // Continue without agent - manual interview fallback
      interview.agentId = null;
    }

    await interview.save();
    
    // Update job application status to 'Interview'
    await Job.findByIdAndUpdate(
      jobId,
      { $set: { "applicants.$[elem].status": "Interview" } },
      { arrayFilters: [{ "elem.user": candidateId }] }
    );

    console.log(`Interview scheduled for candidate ${candidate.name} for job ${job.title}`);
    return interview;
  } catch (error) {
    console.error('Error scheduling interview:', error);
    throw error;
  }
};

// Get candidate's scheduled interviews
exports.getCandidateInterviews = async (req, res) => {
  try {
    const candidateId = req.user.id;
    console.log('Fetching interviews for candidate:', candidateId);
    
    const interviews = await Interview.find({ candidateId })
      .populate('jobId', 'title company location salary')
      .populate('recruiterId', 'name email')
      .sort({ scheduledAt: -1 });

    console.log('Found interviews:', interviews.length);
    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error getting candidate interviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recruiter's interviews
exports.getRecruiterInterviews = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    
    const interviews = await Interview.find({ recruiterId })
      .populate('jobId', 'title company location')
      .populate('candidateId', 'name email')
      .sort({ scheduledAt: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error getting recruiter interviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start interview call
exports.startInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { phoneNumber } = req.body; // Phone number is now required
    const candidateId = req.user.id;

    const interview = await Interview.findById(interviewId)
      .populate('candidateId', 'name email phone');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Verify candidate access
    if (interview.candidateId._id.toString() !== candidateId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if interview is still valid
    if (interview.status === 'expired') {
      return res.status(400).json({ message: 'Interview has expired' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview already completed' });
    }

    if (new Date() > interview.expiresAt) {
      interview.status = 'expired';
      await interview.save();
      return res.status(400).json({ message: 'Interview has expired' });
    }    // Check if phone number is provided
    const candidatePhone = phoneNumber || interview.candidateId.phone;
    if (!candidatePhone) {
      return res.status(400).json({ 
        message: 'Phone number is required for the interview. Please provide your phone number.' 
      });
    }

    // Ensure we have an agent ID - create one if missing
    if (!interview.agentId) {
      console.log('No agent ID found, creating agent for interview...');
      try {
        const agent = await omnidimensionService.createInterviewAgent(
          interview.jobContext,
          interview.cvText || 'No CV provided'
        );
        interview.agentId = agent.id;
        await interview.save();
        console.log(`Agent created with ID: ${agent.id}`);
      } catch (error) {
        console.error('Failed to create agent:', error.message);
        return res.status(500).json({ 
          message: 'Failed to create interview agent. Please try again later.' 
        });
      }
    }

    // Start the call with Omnidimension
    try {
      const callContext = {
        candidate_name: interview.candidateId.name,
        job_title: interview.jobContext.title,
        company: interview.jobContext.company,
        cv_summary: interview.cvText || 'No CV available'
      };      const callData = await omnidimensionService.createCallSession(
        interview.agentId,
        candidatePhone,
        callContext
      );

      console.log('Call dispatch successful:', callData);

      // Update interview with call details
      interview.callId = callData.call_id || callData.id || 'unknown';
      interview.status = 'in_progress';
      interview.startedAt = new Date();
      interview.attemptCount += 1;
      
      await interview.save();

      res.status(200).json({
        message: 'Interview call dispatched successfully. You will receive a call shortly.',
        callId: interview.callId,
        interview: interview,
        phoneNumber: candidatePhone
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      res.status(500).json({ 
        message: 'Failed to start interview call',
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get interview status
exports.getInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await Interview.findById(interviewId)
      .populate('jobId', 'title company')
      .populate('candidateId', 'name email')
      .populate('recruiterId', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if user has access to this interview
    const userId = req.user.id;
    if (interview.candidateId._id.toString() !== userId && 
        interview.recruiterId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }    // If interview has a call ID, get latest status from Omnidimension
    if (interview.callId && interview.status === 'in_progress') {
      try {
        const callDetails = await omnidimensionService.getCallAnalytics(interview.callId);
        
        if (callDetails.status === 'completed' || callDetails.call_ended_at) {
          // Interview completed, parse analysis
          const parsedAnalysis = omnidimensionService.parseInterviewAnalysis(callDetails);
          
          interview.status = 'completed';
          interview.completedAt = new Date();
          interview.interviewData = parsedAnalysis;
          
          await interview.save();
        }
      } catch (error) {
        console.error('Error getting call status:', error);
      }
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error('Error getting interview status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get interview analytics
exports.getInterviewAnalytics = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await Interview.findById(interviewId)
      .populate('jobId', 'title company')
      .populate('candidateId', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if user has access (recruiter or candidate)
    const userId = req.user.id;
    if (interview.candidateId._id.toString() !== userId && 
        interview.recruiterId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (interview.status !== 'completed') {
      return res.status(400).json({ message: 'Interview not completed yet' });
    }

    res.status(200).json({
      interview: {
        id: interview._id,
        job: interview.jobId,
        candidate: interview.candidateId,
        status: interview.status,
        scheduledAt: interview.scheduledAt,
        completedAt: interview.completedAt,
        duration: interview.interviewData.duration
      },
      analytics: interview.interviewData.analysis,
      transcript: interview.interviewData.transcript,
      questions: interview.interviewData.questions
    });
  } catch (error) {
    console.error('Error getting interview analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update interview status (for testing or manual updates)
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status } = req.body;
    
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Only recruiter can update status
    if (interview.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    interview.status = status;
    
    if (status === 'completed' && !interview.completedAt) {
      interview.completedAt = new Date();
    }

    await interview.save();

    res.status(200).json({ message: 'Interview status updated', interview });
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Test endpoint
exports.testEndpoint = async (req, res) => {
  try {
    res.status(200).json({ message: 'Interview routes working!', user: req.user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

module.exports = exports;
