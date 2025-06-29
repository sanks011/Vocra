const cron = require('node-cron');
const Interview = require('../models/interview.model');
const Job = require('../models/job.model');

class InterviewSchedulerService {
  constructor() {
    this.init();
  }

  init() {
    // Run every hour to check for expired interviews
    cron.schedule('0 * * * *', () => {
      this.checkExpiredInterviews();
    });

    // Run every 5 minutes to check interview status
    cron.schedule('*/5 * * * *', () => {
      this.updateInterviewStatuses();
    });

    console.log('Interview scheduler service initialized');
  }

  /**
   * Check for expired interviews and update application status
   */
  async checkExpiredInterviews() {
    try {
      const now = new Date();
      
      // Find interviews that have expired but are still scheduled
      const expiredInterviews = await Interview.find({
        status: 'scheduled',
        expiresAt: { $lt: now }
      });

      console.log(`Found ${expiredInterviews.length} expired interviews`);

      for (const interview of expiredInterviews) {
        // Update interview status
        interview.status = 'expired';
        await interview.save();

        // Update job application status to 'Rejected'
        try {
          await Job.findByIdAndUpdate(
            interview.jobId,
            { $set: { "applicants.$[elem].status": "Rejected" } },
            { arrayFilters: [{ "elem.user": interview.candidateId }] }
          );
          
          console.log(`Expired interview ${interview._id} - Application rejected`);
        } catch (error) {
          console.error('Error updating job application status:', error);
        }
      }
    } catch (error) {
      console.error('Error checking expired interviews:', error);
    }
  }

  /**
   * Update status of in-progress interviews
   */
  async updateInterviewStatuses() {
    try {
      // Find interviews that are in progress
      const inProgressInterviews = await Interview.find({
        status: 'in_progress',
        callId: { $exists: true, $ne: '' }
      });

      const omnidimensionService = require('./omnidimension.service');

      for (const interview of inProgressInterviews) {
        try {
          const callDetails = await omnidimensionService.getCallDetails(interview.callId);
          
          if (callDetails.status === 'completed') {
            // Get analysis and update interview
            const analysis = await omnidimensionService.getCallAnalysis(interview.callId);
            const parsedAnalysis = omnidimensionService.parseInterviewAnalysis(analysis);
            
            interview.status = 'completed';
            interview.completedAt = new Date();
            interview.interviewData = parsedAnalysis;
            
            await interview.save();

            // Update job application status based on recommendation
            let newStatus = 'Reviewing';
            if (parsedAnalysis.analysis.recommendation === 'strongly_recommend' || 
                parsedAnalysis.analysis.recommendation === 'recommend') {
              newStatus = 'Interview'; // Move to next round
            } else if (parsedAnalysis.analysis.recommendation === 'strongly_not_recommend') {
              newStatus = 'Rejected';
            }

            await Job.findByIdAndUpdate(
              interview.jobId,
              { $set: { "applicants.$[elem].status": newStatus } },
              { arrayFilters: [{ "elem.user": interview.candidateId }] }
            );

            console.log(`Interview ${interview._id} completed with recommendation: ${parsedAnalysis.analysis.recommendation}`);
          }
        } catch (error) {
          console.error(`Error updating interview ${interview._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error updating interview statuses:', error);
    }
  }

  /**
   * Manual trigger for testing
   */
  async checkAllInterviews() {
    await this.checkExpiredInterviews();
    await this.updateInterviewStatuses();
  }
}

module.exports = new InterviewSchedulerService();
