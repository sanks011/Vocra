const Interview = require('../models/interview.model');

// Webhook endpoint for Omnidimension to submit interview results
exports.handleOmnidimensionWebhook = async (req, res) => {
  try {
    console.log('Received interview results webhook:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    const {
      interview_id,
      candidate_name,
      job_title,
      company,
      duration,
      transcript,
      technical_score,
      communication_score,
      confidence_score,
      strengths,
      weaknesses,
      recommendation,
      questions
    } = req.body;

    console.log('Questions received (type:', typeof questions, '):', questions);

    if (!interview_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'interview_id is required' 
      });
    }

    // Find the interview by our custom interview ID (stored in callId field)
    const interview = await Interview.findOne({ callId: interview_id });
    
    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }

    // Calculate overall score
    const overallScore = Math.round(
      (technical_score + communication_score + confidence_score) / 3
    );    // Parse questions if it's a string (JSON string from Omnidimension)
    let parsedQuestions = [];
    if (questions) {
      if (typeof questions === 'string') {
        try {
          parsedQuestions = JSON.parse(questions);
          // If it's still a string after parsing, split by newlines or other delimiters
          if (typeof parsedQuestions === 'string') {
            parsedQuestions = parsedQuestions.split('\n').filter(q => q.trim()).map(q => ({
              question: q.trim(),
              answer: '',
              timestamp: new Date()
            }));
          }
        } catch (parseError) {
          console.warn('Failed to parse questions JSON, treating as plain text:', parseError);
          // If JSON parsing fails, split the string by common delimiters
          parsedQuestions = questions.split(/[;\n\r]/).filter(q => q.trim()).map(q => ({
            question: q.trim(),
            answer: '',
            timestamp: new Date()
          }));
        }
      } else if (Array.isArray(questions)) {
        // If questions is already an array, ensure each item has the right structure
        parsedQuestions = questions.map(q => {
          if (typeof q === 'string') {
            return {
              question: q,
              answer: '',
              timestamp: new Date()
            };
          } else if (typeof q === 'object' && q.question) {
            return {
              question: q.question,
              answer: q.answer || '',
              timestamp: q.timestamp || new Date()
            };
          }
          return {
            question: String(q),
            answer: '',
            timestamp: new Date()
          };
        });
      }    }

    console.log('Parsed questions:', JSON.stringify(parsedQuestions, null, 2));

    // Update interview with results
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.interviewData = {
      duration: duration || 300,
      transcript: transcript || '',
      questions: parsedQuestions,
      analysis: {
        overallScore: overallScore,
        technicalScore: technical_score || 0,
        communicationScore: communication_score || 0,
        confidenceScore: confidence_score || 0,
        strengths: Array.isArray(strengths) ? strengths : (strengths ? [strengths] : []),
        weaknesses: Array.isArray(weaknesses) ? weaknesses : (weaknesses ? [weaknesses] : []),
        recommendation: recommendation || 'neutral'
      }
    };

    await interview.save();

    console.log(`Interview ${interview._id} completed via webhook`);

    res.status(200).json({
      success: true,
      message: 'Interview results received successfully',
      interview_id: interview._id
    });

  } catch (error) {
    console.error('Error processing interview results webhook:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Endpoint to provide interview context to Omnidimension
exports.getInterviewContext = async (req, res) => {
  try {
    const { interview_id } = req.query;

    if (!interview_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'interview_id is required' 
      });
    }

    // Find the interview
    const interview = await Interview.findOne({ callId: interview_id })
      .populate('jobId', 'title company description requirements')
      .populate('candidateId', 'name email');
    
    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        interview_id: interview_id,
        candidate_name: interview.candidateId.name,
        candidate_email: interview.candidateId.email,
        job_title: interview.jobContext.title,
        company: interview.jobContext.company,
        job_description: interview.jobContext.description,
        job_requirements: interview.jobContext.requirements,
        cv_summary: interview.cvText || 'No CV available',
        interview_duration: 300 // 5 minutes
      }
    });

  } catch (error) {
    console.error('Error getting interview context:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports = exports;
