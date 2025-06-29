const axios = require('axios');

class OmnidimensionService {
  constructor() {
    this.apiKey = process.env.OMNIDIMENSION_API_KEY;
    this.baseUrl = process.env.OMNIDIMENSION_BASE_URL || 'https://api.omnidim.io';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
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
        instructions: agentInstructions,
        voice: "alloy",
        language: "en",
        model: "gpt-4o-mini",
        tools: [],
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await this.client.post('/agents', agentData);
      return response.data;
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
   * Start an interview call
   */
  async startInterviewCall(agentId, candidateName, candidateEmail) {
    try {
      const callData = {
        agent_id: agentId,
        customer_name: candidateName,
        customer_email: candidateEmail,
        max_duration: 300, // 5 minutes in seconds
        record: true,
        transcribe: true,
        analyze: true,
        metadata: {
          type: 'screening_interview',
          duration_limit: '5_minutes'
        }
      };

      const response = await this.client.post('/calls', callData);
      return response.data;
    } catch (error) {
      console.error('Error starting interview call:', error.response?.data || error.message);
      throw new Error('Failed to start interview call');
    }
  }

  /**
   * Get call status and details
   */
  async getCallDetails(callId) {
    try {
      const response = await this.client.get(`/calls/${callId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting call details:', error.response?.data || error.message);
      throw new Error('Failed to get call details');
    }
  }

  /**
   * Get call transcript and analysis
   */
  async getCallAnalysis(callId) {
    try {
      const response = await this.client.get(`/calls/${callId}/analysis`);
      return response.data;
    } catch (error) {
      console.error('Error getting call analysis:', error.response?.data || error.message);
      throw new Error('Failed to get call analysis');
    }
  }

  /**
   * Update call status
   */
  async updateCallStatus(callId, status) {
    try {
      const response = await this.client.put(`/calls/${callId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating call status:', error.response?.data || error.message);
      throw new Error('Failed to update call status');
    }
  }

  /**
   * Parse interview analysis into our format
   */
  parseInterviewAnalysis(analysis) {
    // Parse the Omnidimension analysis into our interview data structure
    return {
      duration: analysis.duration || 0,
      transcript: analysis.transcript || '',
      questions: analysis.questions || [],
      analysis: {
        overallScore: this.calculateOverallScore(analysis),
        technicalScore: analysis.technical_score || 0,
        communicationScore: analysis.communication_score || 0,
        confidenceScore: analysis.confidence_score || 0,
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        recommendation: this.getRecommendation(analysis.overall_score || 0),
        summary: analysis.summary || ''
      }
    };
  }

  /**
   * Calculate overall score from various metrics
   */
  calculateOverallScore(analysis) {
    const technical = analysis.technical_score || 0;
    const communication = analysis.communication_score || 0;
    const confidence = analysis.confidence_score || 0;
    
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
