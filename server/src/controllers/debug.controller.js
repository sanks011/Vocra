const Interview = require('../models/interview.model');
const { getCallStatus } = require('../services/omnidimension.service');
const { processCompletedCall, forceProcessStaleInterviews } = require('../services/call-status-polling.service');

/**
 * Manual check for interview status - useful for debugging
 */
exports.checkInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await Interview.findById(interviewId)
      .populate('candidateId', 'name email')
      .populate('jobId', 'title company');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    let callStatus = null;
    if (interview.callId) {
      try {
        callStatus = await getCallStatus(interview.callId);
      } catch (error) {
        console.error('Error getting call status:', error);
      }
    }

    res.json({
      interview: {
        id: interview._id,
        status: interview.status,
        callId: interview.callId,
        scheduledAt: interview.scheduledAt,
        startedAt: interview.startedAt,
        completedAt: interview.completedAt,
        candidateName: interview.candidateId?.name,
        jobTitle: interview.jobId?.title,
        company: interview.jobId?.company,
        duration: interview.interviewData?.duration || 0,
        transcriptLength: interview.interviewData?.transcript?.length || 0,
        hasAnalysis: !!interview.interviewData?.analysis,
        questionsCount: interview.interviewData?.questions?.length || 0
      },
      callStatus: callStatus,
      suggestions: generateSuggestions(interview, callStatus)
    });

  } catch (error) {
    console.error('Error checking interview status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Force process a completed call - useful for debugging
 */
exports.forceProcessCall = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await Interview.findById(interviewId)
      .populate('candidateId')
      .populate('jobId');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (!interview.callId) {
      return res.status(400).json({ message: 'No call ID found for this interview' });
    }

    // Get call status from Omnidimension
    const callStatus = await getCallStatus(interview.callId);
    
    if (!callStatus) {
      return res.status(404).json({ message: 'Call status not found in Omnidimension' });
    }

    // Force process the call
    await processCompletedCall(interview, callStatus);

    // Get updated interview
    const updatedInterview = await Interview.findById(interviewId)
      .populate('candidateId', 'name')
      .populate('jobId', 'title company');

    res.json({
      message: 'Call processed successfully',
      interview: {
        id: updatedInterview._id,
        status: updatedInterview.status,
        duration: updatedInterview.interviewData?.duration || 0,
        transcriptLength: updatedInterview.interviewData?.transcript?.length || 0,
        questionsCount: updatedInterview.interviewData?.questions?.length || 0,
        overallScore: updatedInterview.interviewData?.analysis?.overallScore || 0,
        recommendation: updatedInterview.interviewData?.analysis?.recommendation || 'neutral'
      },
      callStatus: callStatus
    });

  } catch (error) {
    console.error('Error force processing call:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * List all active interviews for debugging
 */
exports.listActiveInterviews = async (req, res) => {
  try {
    const activeInterviews = await Interview.find({
      status: 'in_progress',
      callId: { $exists: true, $ne: '' }
    })
    .populate('candidateId', 'name email')
    .populate('jobId', 'title company')
    .sort({ startedAt: -1 });

    const interviewsWithStatus = [];

    for (const interview of activeInterviews) {
      let callStatus = null;
      try {
        callStatus = await getCallStatus(interview.callId);
      } catch (error) {
        console.error(`Error getting status for call ${interview.callId}:`, error);
      }

      interviewsWithStatus.push({
        id: interview._id,
        candidateName: interview.candidateId?.name,
        jobTitle: interview.jobId?.title,
        company: interview.jobId?.company,
        callId: interview.callId,
        startedAt: interview.startedAt,
        status: interview.status,
        callStatus: callStatus?.status || callStatus?.call_status || 'unknown',
        duration: callStatus?.duration || callStatus?.call_duration || 0,
        hasTranscript: !!(callStatus?.transcript || callStatus?.call_transcript)
      });
    }

    res.json({
      totalActiveInterviews: activeInterviews.length,
      interviews: interviewsWithStatus
    });

  } catch (error) {
    console.error('Error listing active interviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Force process all stale interviews that might be stuck
 */
exports.processStaleInterviews = async (req, res) => {
  try {
    const result = await forceProcessStaleInterviews();
    res.json({
      success: true,
      message: `Processed ${result.processed} stale interviews`,
      ...result
    });
  } catch (error) {
    console.error('Error processing stale interviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error processing stale interviews', 
      error: error.message 
    });
  }
};

function generateSuggestions(interview, callStatus) {
  const suggestions = [];

  if (interview.status === 'in_progress' && !callStatus) {
    suggestions.push('Call status not available from Omnidimension - check API connection');
  }

  if (interview.status === 'in_progress' && callStatus) {
    if (callStatus.status === 'completed' || callStatus.call_status === 'completed') {
      suggestions.push('Call is completed but interview still shows in_progress - processing may be needed');
    } else if (callStatus.status === 'active' || callStatus.call_status === 'active') {
      suggestions.push('Call is currently active - candidate should be on the phone');
    } else {
      suggestions.push(`Call status is "${callStatus.status || callStatus.call_status}" - check if this is expected`);
    }
  }

  if (interview.status === 'completed' && !interview.interviewData?.transcript) {
    suggestions.push('Interview marked complete but no transcript available');
  }

  if (interview.status === 'completed' && !interview.interviewData?.analysis) {
    suggestions.push('Interview complete but no AI analysis available');
  }

  const now = new Date();
  const startTime = interview.startedAt || interview.createdAt;
  const timeDiff = now - startTime;
  const thirtyMinutes = 30 * 60 * 1000;

  if (interview.status === 'in_progress' && timeDiff > thirtyMinutes) {
    suggestions.push('Interview has been in progress for over 30 minutes - consider checking for timeout');
  }

  return suggestions;
}

module.exports = {
  checkInterviewStatus: exports.checkInterviewStatus,
  forceProcessCall: exports.forceProcessCall,
  listActiveInterviews: exports.listActiveInterviews,
  processStaleInterviews: exports.processStaleInterviews
};
