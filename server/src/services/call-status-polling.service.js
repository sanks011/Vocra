const Interview = require('../models/interview.model');
const { getCallStatus } = require('./omnidimension.service');
const { analyzeTranscript, extractQuestionsFromTranscript } = require('./transcript-analysis.service');

/**
 * Poll Omnidimension for call status updates
 * This runs periodically to check if calls have ended
 */
async function pollCallStatuses() {
  try {
    console.log('🔍 Polling call statuses...');
    
    // Find all interviews that are in progress
    const activeInterviews = await Interview.find({
      status: 'in_progress',
      callId: { $exists: true, $ne: '' }
    }).populate('candidateId').populate('jobId');

    if (activeInterviews.length === 0) {
      console.log('No active interviews to poll');
      return;
    }

    console.log(`Found ${activeInterviews.length} active interviews to check`);    for (const interview of activeInterviews) {
      try {
        console.log(`Checking status for interview ${interview._id}, callId: ${interview.callId}`);
        
        let callStatus = null;
        try {
          callStatus = await getCallStatus(interview.callId);
          console.log(`Call ${interview.callId} status:`, callStatus);
        } catch (statusError) {
          console.error(`Error in getCallStatus for ${interview.callId}:`, statusError.message);
          
          // If call is older than 15 minutes, assume it's completed to avoid stuck calls
          const now = new Date();
          const startTime = interview.startedAt || interview.createdAt;
          const fifteenMinutes = 15 * 60 * 1000;
          
          if ((now - startTime) > fifteenMinutes) {
            console.log(`⏰ Call ${interview.callId} is older than 15 minutes and status check is failing. Marking as completed.`);
            callStatus = { 
              status: 'completed', 
              transcript: 'No transcript available due to API error. Manual review required.',
              duration: Math.round((now - startTime) / 1000) // Duration in seconds
            };
          }
        }        // If call is completed, process it
        if (callStatus && (
          callStatus.status === 'completed' || 
          callStatus.status === 'ended' || 
          callStatus.status === 'finished' ||
          callStatus.call_status === 'completed' ||
          callStatus.call_status === 'ended' ||
          callStatus.call_status === 'finished'
        )) {
          console.log(`📞 Call ${interview.callId} completed, processing results...`);
          await processCompletedCall(interview, callStatus);
        } 
        
        // Alternatively, check if interview is old and still in_progress (automatic fallback)
        // This ensures we don't have stuck calls in the system
        else if (interview.status === 'in_progress') {
          const now = new Date();
          const startTime = interview.startedAt || interview.scheduledAt;
          const oneDayAgo = new Date(now - (24 * 60 * 60 * 1000)); // 24 hours ago
          
          if (startTime < oneDayAgo) {
            console.log(`⚠️ Interview ${interview._id} has been in progress for over 24 hours - forcing completion`);
            
            // Create a mock call status with an empty transcript
            const mockCallStatus = {
              status: 'completed',
              transcript: 'Call was automatically completed after timeout. No transcript available.',
              duration: Math.round((now - startTime) / 1000) // Duration in seconds
            };
            
            await processCompletedCall(interview, mockCallStatus);
          }
        }

        // Check if call has been active too long (timeout after 1 hour)
        const now = new Date();
        const startTime = interview.startedAt || interview.createdAt;
        const timeDiff = now - startTime;
        const oneHour = 60 * 60 * 1000;

        if (timeDiff > oneHour) {
          console.log(`⏰ Call ${interview.callId} timeout - marking as expired`);
          interview.status = 'expired';
          interview.completedAt = new Date();
          await interview.save();
        }

      } catch (error) {
        console.error(`Error checking status for interview ${interview._id}:`, error);
      }
    }

  } catch (error) {
    console.error('Error in call status polling:', error);
  }
}

/**
 * Process a completed call
 */
async function processCompletedCall(interview, callStatus) {
  try {
    // First check if interview is already processed to avoid duplicate processing
    if (interview.status === 'completed') {
      console.log(`Interview ${interview._id} already marked as completed, skipping processing`);
      return;
    }
    
    // Extract data from call status
    const transcript = callStatus?.transcript || callStatus?.call_transcript || '';
    const duration = callStatus?.duration || callStatus?.call_duration || 0;

    console.log(`Processing completed call for interview ${interview._id}`);
    console.log(`Transcript length: ${transcript.length} characters`);
    console.log(`Duration: ${duration} seconds`);

    // Perform AI analysis if we have a transcript
    let aiAnalysis = null;
    if (transcript && transcript.trim()) {
      console.log('🤖 Starting AI analysis of transcript...');
      try {
        aiAnalysis = await analyzeTranscript(
          transcript,
          interview.jobContext || {},
          interview.candidateId?.name || 'Candidate'
        );
        console.log('✅ AI analysis completed successfully');
      } catch (analysisError) {
        console.error('❌ AI analysis failed:', analysisError);
      }
    }

    // Extract questions from transcript
    const questions = extractQuestionsFromTranscript(transcript);
    console.log(`📋 Extracted ${questions.length} questions from transcript`);

    // Update interview with results
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.interviewData = {
      duration: duration,
      transcript: transcript,
      questions: questions,
      analysis: aiAnalysis ? {
        overallScore: aiAnalysis.overallScore,
        technicalScore: aiAnalysis.technicalScore,
        communicationScore: aiAnalysis.communicationScore,
        confidenceScore: aiAnalysis.confidenceScore,
        strengths: aiAnalysis.strengths,
        weaknesses: aiAnalysis.weaknesses,
        recommendation: aiAnalysis.recommendation,
        summary: aiAnalysis.detailedFeedback
      } : {
        overallScore: 50,
        technicalScore: 50,
        communicationScore: 50,
        confidenceScore: 50,
        strengths: ['Interview completed'],
        weaknesses: ['Analysis pending'],
        recommendation: 'neutral',
        summary: 'Interview completed - manual review required'
      },
      aiAnalysis: aiAnalysis,
      omnidimensionData: callStatus
    };

    await interview.save();
    console.log(`✅ Interview ${interview._id} processed successfully`);

  } catch (error) {
    console.error(`Error processing completed call for interview ${interview._id}:`, error);
  }
}

/**
 * Start the call status polling service
 */
function startCallStatusPolling() {
  console.log('🚀 Starting call status polling service...');
  
  // Poll every 30 seconds
  const pollInterval = 30 * 1000;
  
  // Initial poll
  setTimeout(pollCallStatuses, 5000); // Wait 5 seconds before first poll
  
  // Set up recurring polling
  setInterval(pollCallStatuses, pollInterval);
  
  console.log(`📅 Call status polling configured to run every ${pollInterval/1000} seconds`);
}

/**
 * Force process all stale interviews
 * This can be called manually to check for stuck interviews and mark them as completed
 */
async function forceProcessStaleInterviews() {
  try {
    console.log('🔍 Checking for stale interviews...');
    
    // Find all interviews that are stuck in 'in_progress' status
    const staleTime = new Date();
    staleTime.setHours(staleTime.getHours() - 2); // 2 hours ago
    
    const staleInterviews = await Interview.find({
      status: 'in_progress',
      startedAt: { $lt: staleTime }
    }).populate('candidateId').populate('jobId');
    
    console.log(`Found ${staleInterviews.length} stale interviews`);
    
    for (const interview of staleInterviews) {
      console.log(`Processing stale interview ${interview._id} (started ${interview.startedAt})`);
      
      // Try to get status from API first
      let callStatus = null;
      try {
        callStatus = await getCallStatus(interview.callId);
      } catch (error) {
        console.log(`Could not get call status for ${interview.callId}, using fallback`);
      }
      
      if (!callStatus) {
        callStatus = {
          status: 'completed',
          transcript: 'Interview was completed automatically due to timeout. No transcript available.',
          duration: Math.round((new Date() - interview.startedAt) / 1000)
        };
      }
      
      await processCompletedCall(interview, callStatus);
    }
    
    return {
      processed: staleInterviews.length,
      interviews: staleInterviews.map(i => i._id)
    };
    
  } catch (error) {
    console.error('Error in force processing stale interviews:', error);
    return {
      error: error.message,
      processed: 0
    };
  }
}

module.exports = {
  pollCallStatuses,
  processCompletedCall,
  startCallStatusPolling,
  forceProcessStaleInterviews
};
