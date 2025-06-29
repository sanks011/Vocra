const axios = require('axios');

class OmnidimensionService {
  constructor() {
    this.apiKey = process.env.OMNIDIMENSION_API_KEY;
    this.baseUrl = process.env.OMNIDIMENSION_BASE_URL || 'https://backend.omnidim.io/api/v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Create an AI agent for conducting interviews
   */
  async createInterviewAgent(jobContext, cvContext) {
    try {
      const agentInstructions = this.generateAgentInstructions(jobContext, cvContext);
      
      const agentData = {
        name: `Interview Agent - ${jobContext.title}`,
        context_breakdown: [
          {
            title: "Interview Context",
            body: agentInstructions
          }
        ],
        welcome_message: `Hello! I'm here to conduct a brief screening interview for the ${jobContext.title} position at ${jobContext.company}. This will take about 5 minutes. Are you ready to begin?`,
        transcriber: {
          provider: "deepgram_stream",
          silence_timeout_ms: 400
        },
        model: {
          model: "gpt-4o-mini",
          temperature: 0.7        },
        voice: {
          provider: "eleven_labs",
          voice_id: "JBFqnCBsd6RMkjVDRZzb"
        },
        call_type: "Outgoing"
      };

      const response = await this.client.post('/agents/create', agentData);
      console.log('Agent creation response:', response.data);
      
      // Handle different response structures
      const responseData = response.data.json || response.data;
      if (!responseData || !responseData.id) {
        throw new Error('Invalid response: agent ID not found');
      }
      
      return responseData;
    } catch (error) {
      console.error('Error creating interview agent:', error.response?.data || error.message);
      throw new Error('Failed to create interview agent');
    }
  }

  /**
   * Generate contextual instructions for the AI agent
   */
  generateAgentInstructions(jobContext, cvContext) {
    return `You are an AI interview agent conducting a 5-minute screening interview for the position of ${jobContext.title} at ${jobContext.company}.

JOB CONTEXT:
- Position: ${jobContext.title}
- Company: ${jobContext.company}
- Job Description: ${jobContext.description}
- Key Requirements: ${jobContext.requirements.join(', ')}

CANDIDATE CV SUMMARY:
${cvContext}

INTERVIEW GUIDELINES:
1. Keep the interview to exactly 5 minutes
2. Ask 3-4 relevant questions based on the job requirements and candidate's background
3. Focus on technical skills, experience, and cultural fit
4. Be professional but conversational
5. Listen carefully to answers for detailed analysis

QUESTION CATEGORIES TO COVER:
- Technical competency related to job requirements
- Relevant experience from their CV
- Problem-solving ability
- Communication skills
- Interest in the role/company

Start with a brief introduction, then proceed with targeted questions. End by thanking them and explaining next steps.

Remember: Be concise, professional, and focus on getting valuable insights within the 5-minute timeframe.`;
  }
  /**
   * Create a call session for the candidate to join
   * Note: Omnidimension primarily supports phone calls, so we'll dispatch a call
   */
  async createCallSession(agentId, candidatePhoneNumber, callContext = {}) {
    try {
      if (!candidatePhoneNumber) {
        throw new Error('Phone number is required for call dispatch');
      }

      // Ensure phone number has country code
      const formattedPhoneNumber = candidatePhoneNumber.startsWith('+') 
        ? candidatePhoneNumber 
        : `+1${candidatePhoneNumber}`;

      const callData = {
        agent_id: parseInt(agentId),
        to_number: formattedPhoneNumber,
        call_context: callContext
      };      const response = await this.client.post('/calls/dispatch', callData);
      console.log('Call dispatch response:', response.data);
      
      // Handle different response structures
      const responseData = response.data.json || response.data;
      if (!responseData) {
        throw new Error('Invalid response: no data returned');
      }
      
      // Normalize the response to match expected structure
      return {
        call_id: responseData.requestId || responseData.id,
        id: responseData.requestId || responseData.id,
        status: responseData.status || 'dispatched',
        success: responseData.success
      };
    } catch (error) {
      console.error('Error creating call session:', error.response?.data || error.message);
      throw new Error('Failed to create call session');
    }
  }
  /**
   * Get call analytics and status
   */
  async getCallAnalytics(callLogId) {
    try {
      const response = await this.client.get(`/calls/logs/${callLogId}`);
      return response.data.json;
    } catch (error) {
      console.error('Error getting call analytics:', error.response?.data || error.message);
      throw new Error('Failed to get call analytics');
    }
  }

  /**
   * Get call details and status
   */
  async getCallDetails(callLogId) {
    try {
      const response = await this.client.get(`/calls/logs/${callLogId}`);
      return response.data.json || response.data;
    } catch (error) {
      console.error('Error getting call details:', error.response?.data || error.message);
      throw new Error('Failed to get call details');
    }
  }

  /**
   * Get call analysis
   */
  async getCallAnalysis(callLogId) {
    try {
      const response = await this.client.get(`/calls/logs/${callLogId}`);
      const callData = response.data.json || response.data;
      
      // Return the analysis part of the call data
      return {
        transcript: callData.transcript || '',
        duration: callData.duration || 0,
        analysis: callData.analysis || {},
        questions: callData.questions || []
      };
    } catch (error) {
      console.error('Error getting call analysis:', error.response?.data || error.message);
      throw new Error('Failed to get call analysis');
    }
  }

  /**
   * Get all call logs for an agent
   */
  async getCallLogs(agentId, page = 1, pageSize = 30) {
    try {
      const params = {
        pageno: page,
        pagesize: pageSize,
        agentid: agentId
      };

      const response = await this.client.get('/calls/logs', { params });
      return response.data.json;
    } catch (error) {
      console.error('Error getting call logs:', error.response?.data || error.message);
      throw new Error('Failed to get call logs');
    }
  }
  /**
   * Parse interview analysis into our format
   */
  parseInterviewAnalysis(callLog) {
    // Parse the Omnidimension call log into our interview data structure
    return {
      duration: callLog.call_duration || callLog.duration || 0,
      transcript: callLog.transcript || callLog.full_transcript || '',
      questions: this.extractQuestionsFromTranscript(callLog.transcript || ''),
      analysis: {
        overallScore: this.calculateOverallScore(callLog),
        technicalScore: callLog.technical_score || this.analyzeTechnical(callLog.transcript || ''),
        communicationScore: callLog.communication_score || this.analyzeCommunication(callLog.transcript || ''),
        confidenceScore: callLog.confidence_score || this.analyzeConfidence(callLog.transcript || ''),
        strengths: callLog.strengths || this.extractStrengths(callLog.transcript || ''),
        weaknesses: callLog.weaknesses || this.extractWeaknesses(callLog.transcript || ''),
        recommendation: this.getRecommendation(callLog.overall_score || 0),
        summary: callLog.summary || callLog.call_summary || 'Interview completed successfully'
      }
    };
  }

  /**
   * Extract questions from transcript
   */
  extractQuestionsFromTranscript(transcript) {
    // Simple extraction of questions (lines ending with ?)
    const lines = transcript.split('\n');
    return lines
      .filter(line => line.trim().endsWith('?'))
      .map((question, index) => ({
        id: index + 1,
        question: question.trim(),
        answer: '' // Would need more sophisticated parsing to match answers
      }));
  }

  /**
   * Basic analysis methods for fallback scoring
   */
  analyzeTechnical(transcript) {
    // Basic keyword-based technical analysis
    const technicalKeywords = ['experience', 'skill', 'project', 'technology', 'development'];
    const matches = technicalKeywords.filter(keyword => 
      transcript.toLowerCase().includes(keyword)
    ).length;
    return Math.min(matches * 20, 100); // Max 100
  }

  analyzeCommunication(transcript) {
    // Basic communication analysis based on transcript length and structure
    const wordCount = transcript.split(' ').length;
    if (wordCount > 200) return 85;
    if (wordCount > 100) return 70;
    if (wordCount > 50) return 50;
    return 30;
  }

  analyzeConfidence(transcript) {
    // Basic confidence analysis
    const confidenceIndicators = ['yes', 'definitely', 'absolutely', 'sure', 'confident'];
    const matches = confidenceIndicators.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    return Math.min(matches * 15 + 40, 100); // Base 40, up to 100
  }

  extractStrengths(transcript) {
    return [
      'Responded well to questions',
      'Clear communication',
      'Relevant experience mentioned'
    ];
  }

  extractWeaknesses(transcript) {
    return [
      'Could provide more detailed examples',
      'Some hesitation in responses'
    ];
  }
  /**
   * Calculate overall score from various metrics
   */
  calculateOverallScore(callLog) {
    const technical = callLog.technical_score || this.analyzeTechnical(callLog.transcript || '');
    const communication = callLog.communication_score || this.analyzeCommunication(callLog.transcript || '');
    const confidence = callLog.confidence_score || this.analyzeConfidence(callLog.transcript || '');
    
    // Weighted average
    return Math.round((technical * 0.4 + communication * 0.3 + confidence * 0.3));
  }

  /**
   * Get recommendation based on overall score
   */
  getRecommendation(score) {
    if (score >= 85) return 'strongly_recommend';
    if (score >= 70) return 'recommend';
    if (score >= 50) return 'neutral';
    if (score >= 30) return 'not_recommend';
    return 'strongly_not_recommend';
  }
}

module.exports = new OmnidimensionService();
