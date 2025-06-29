const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Ensure environment variables are loaded
dotenv.config();

class OmnidimensionService {  constructor() {
    // Don't initialize client in constructor, will init on demand
    this.apiKey = process.env.OMNIDIMENSION_API_KEY;
    this.baseUrl = process.env.OMNIDIMENSION_BASE_URL || 'https://backend.omnidim.io/api/v1';
    this._client = null; // Initialize to null, will be created in getClient() when needed
    console.log('OmnidimensionService initialized with base URL:', this.baseUrl);
  }
  
  // Attempt to load .env file directly as a backup method
  loadEnvFromFile() {
    try {
      console.log('Attempting to load .env file directly...');
      
      // Try to find .env in current directory or up to 3 directories up
      let envPath = '.env';
      const maxLevelsUp = 3;
      
      for (let i = 0; i <= maxLevelsUp; i++) {
        const testPath = '../'.repeat(i) + '.env';
        const resolvedPath = path.resolve(__dirname, testPath);
        
        if (fs.existsSync(resolvedPath)) {
          envPath = resolvedPath;
          console.log(`Found .env at: ${resolvedPath}`);
          break;
        }
      }
      
      if (!fs.existsSync(envPath)) {
        const serverPath = path.resolve(__dirname, '../../.env');
        if (fs.existsSync(serverPath)) {
          envPath = serverPath;
          console.log(`Found .env at server root: ${serverPath}`);
        } else {
          console.warn(`Could not find .env file in any parent directories`);
          return false;
        }
      }
      
      // Read and parse .env file
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = dotenv.parse(envContent);
      
      // Set important variables
      if (envVars.OMNIDIMENSION_API_KEY) {
        this.apiKey = envVars.OMNIDIMENSION_API_KEY;
        console.log('Successfully loaded API key from .env file');
      }
      
      if (envVars.OMNIDIMENSION_BASE_URL) {
        this.baseUrl = envVars.OMNIDIMENSION_BASE_URL;
        console.log('Successfully loaded base URL from .env file');
      }
      
      return true;
    } catch (error) {
      console.error('Error loading .env file directly:', error);
      return false;
    }
  }
    // Get axios client (lazy initialization)
  getClient() {
    // Check if we already have a client
    if (this._client) {
      return this._client;
    }
    
    if (!this.apiKey) {
      console.warn('Warning: OMNIDIMENSION_API_KEY not found in environment variables');
      this.apiKey = process.env.OMNIDIMENSION_API_KEY; // Try again
      if (!this.apiKey) {
        console.error('❌ OMNIDIMENSION_API_KEY still not found after retry!');
        // Try loading from .env file directly
        this.loadEnvFromFile();
        
        if (!this.apiKey) {
          console.error('⚠️ Still no API key found. Using hardcoded fallback - THIS IS NOT RECOMMENDED!');
          // This is a last resort fallback
          this.apiKey = 'I0If6jYyP4_DDRwYpi7ZsnfqXgjlVoAdRTsV9hC7NpA'; // Same as in .env
        }
        
        console.log('Environment variables available:', Object.keys(process.env).filter(key => 
          key.includes('OMNIDIMENSION') || key.includes('API')
        ));
      }
    }
      console.log(`Creating Omnidimension API client with:
      - Base URL: ${this.baseUrl}
      - API Key: ${this.apiKey ? this.apiKey.substring(0, 5) + '...' : 'MISSING!'}`);
    
    // Create client and cache it
    this._client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey || 'missing-api-key'}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },      timeout: 30000 // 30 second timeout
    });
    
    return this._client;
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
        webhook_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/interviews/webhook/omnidimension`,
        post_call_actions: {
          webhook: {
            enabled: true,
            url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/interviews/webhook/omnidimension`
          }
        }
      };
      
      const client = this.getClient();
      const response = await client.post('/agents/create', agentData);
      
      console.log('Agent creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating interview agent:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generate instructions for the interview agent
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
      console.log(`Creating call session with agent ${agentId} to phone ${candidatePhoneNumber}`);
        // Prepare call data
      const callData = {
        agent_id: agentId,
        to_number: candidatePhoneNumber, // API expects to_number, not phone_number
        custom_variables: callContext
      };
      const client = this.getClient();
      const response = await client.post('/calls/dispatch', callData);
      
      console.log('Call dispatch response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating call session:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get raw call log from Omnidimension
   */
  async getCallLog(callLogId) {
    try {
      const client = this.getClient();
      const response = await client.get(`/calls/logs/${callLogId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting call log:', error);
      return null;
    }
  }

  /**
   * Get call transcript from Omnidimension
   */
  async getCallTranscript(callLogId) {
    try {
      const client = this.getClient();
      const response = await client.get(`/calls/logs/${callLogId}`);
      return response.data?.transcript || '';
    } catch (error) {
      console.error('Error getting call transcript:', error);
      return '';
    }
  }
  
  /**
   * Get call analytics from call log
   */
  async getCallAnalyticsFromLog(callLogId) {
    try {
      const client = this.getClient();
      const response = await client.get(`/calls/logs/${callLogId}`);
      
      if (!response.data) {
        return null;
      }
      
      // Extract analytics data from call log
      return {
        transcript: response.data.transcript || '',
        duration: response.data.duration || 0,
        // Other fields as needed
      };
    } catch (error) {
      console.error('Error getting call analytics from log:', error);
      return null;
    }
  }
  
  /**
   * Search for call logs by phone number
   */
  async findCallsByPhone(phoneNumber, limit = 10) {
    try {
      const params = {
        phone_number: phoneNumber,
        limit: limit
      };
      
      const client = this.getClient();
      const response = await client.get('/calls/logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error finding calls by phone:', error);
      return [];
    }
  }

  /**
   * Get call status from Omnidimension
   */
  async getCallStatus(callId) {
    try {
      console.log(`📞 Fetching call status for callId: ${callId}`);
      
      const client = this.getClient();
      const response = await client.get(`/calls/${callId}`);
      console.log(`Call status response for ${callId}:`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching call status for ${callId}:`, 
        error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message);
      
      // If call not found, it might be completed
      if (error.response?.status === 404) {
        console.log(`Call ${callId} not found - might be completed`);
        return { status: 'completed', call_status: 'completed' };
      }
      
      return null;
    }
  }

  /**
   * Get call analytics/results from Omnidimension
   */
  async getCallAnalytics(callId) {
    try {
      console.log(`📊 Fetching call analytics for callId: ${callId}`);
      
      const client = this.getClient();
      const response = await client.get(`/calls/${callId}/analytics`);
      console.log('Call analytics response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching call analytics:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * List all recent calls
   */
  async getRecentCalls(limit = 10) {
    try {
      console.log(`📋 Fetching recent calls (limit: ${limit})`);
      
      const client = this.getClient();
      const response = await client.get(`/calls?limit=${limit}`);
      console.log('Recent calls response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching recent calls:', error.response?.data || error.message);
      return [];
    }
  }
}

module.exports = new OmnidimensionService();
