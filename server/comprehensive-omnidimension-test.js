const axios = require('axios');
require('dotenv').config();

class OmnidimensionDiagnostic {
  constructor() {
    this.apiKey = process.env.OMNIDIMENSION_API_KEY;
    this.baseUrl = 'https://backend.omnidim.io/api/v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  async testApiConnection() {
    console.log('🔍 Testing Omnidimension API connection...\n');
    
    try {
      // Test 1: List existing agents
      console.log('1. Testing agent listing...');
      const agentsResponse = await this.client.get('/agents', {
        params: { pageno: 1, pagesize: 5 }
      });
      console.log('✅ Agent listing successful');
      console.log('Response:', JSON.stringify(agentsResponse.data, null, 2));
      
      return agentsResponse.data;
    } catch (error) {
      console.error('❌ Agent listing failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return null;
    }
  }

  async testAgentCreation() {
    console.log('\n2. Testing agent creation...');
    
    try {
      const testAgentData = {
        name: "Test Interview Agent",
        context_breakdown: [
          {
            title: "Test Purpose",
            body: "This is a test agent for diagnosing API connectivity"
          }
        ],
        welcome_message: "Hello! This is a test interview agent.",
        transcriber: {
          provider: "deepgram_stream",
          silence_timeout_ms: 400
        },
        model: {
          model: "gpt-4o-mini",
          temperature: 0.7
        },
        voice: {
          provider: "eleven_labs",
          voice_id: "JBFqnCBsd6RMkjVDRZzb"
        },
        call_type: "Outgoing",
        post_call_actions: {
          webhook: {
            enabled: true,
            url: "http://localhost:5000/api/interviews/webhook/omnidimension",
            include: ["summary", "fullConversation"],
            extracted_variables: [
              {
                key: "test_score",
                prompt: "Rate this test from 0-100"
              }
            ]
          }
        }
      };

      const response = await this.client.post('/agents/create', testAgentData);
      console.log('✅ Agent creation successful');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
      const responseData = response.data.json || response.data;
      return responseData;
    } catch (error) {
      console.error('❌ Agent creation failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return null;
    }
  }

  async testCallDispatch(agentId, phoneNumber = '+911234567890') {
    console.log('\n3. Testing call dispatch...');
    
    try {
      const callData = {
        agent_id: parseInt(agentId),
        to_number: phoneNumber,
        call_context: {
          test: true,
          purpose: "API connectivity test"
        }
      };

      const response = await this.client.post('/calls/dispatch', callData);
      console.log('✅ Call dispatch successful');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ Call dispatch failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return null;
    }
  }

  async testCallLogs() {
    console.log('\n4. Testing call logs...');
    
    try {
      const response = await this.client.get('/calls/logs', {
        params: { pageno: 1, pagesize: 5 }
      });
      console.log('✅ Call logs retrieval successful');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ Call logs failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return null;
    }
  }

  async cleanupTestAgent(agentId) {
    console.log('\n5. Cleaning up test agent...');
    
    try {
      const response = await this.client.delete(`/agents/${agentId}`);
      console.log('✅ Test agent deleted successfully');
      return true;
    } catch (error) {
      console.error('⚠️ Failed to delete test agent (this is okay):', error.message);
      return false;
    }
  }

  async runFullDiagnostic() {
    console.log('🚀 Starting Omnidimension API Diagnostic...\n');
    console.log(`API Key: ${this.apiKey?.substring(0, 10)}...`);
    console.log(`Base URL: ${this.baseUrl}\n`);

    // Test 1: API Connection
    const agentsData = await this.testApiConnection();
    if (!agentsData) {
      console.log('\n❌ Basic API connection failed. Check your API key and network.');
      return;
    }

    // Test 2: Agent Creation
    const newAgent = await this.testAgentCreation();
    if (!newAgent) {
      console.log('\n❌ Agent creation failed. This could indicate API limits or configuration issues.');
      return;
    }

    const agentId = newAgent.id || newAgent.agent_id;
    if (!agentId) {
      console.log('\n❌ Could not extract agent ID from response');
      return;
    }

    console.log(`\n✅ Test agent created with ID: ${agentId}`);

    // Test 3: Call Dispatch
    const callResult = await this.testCallDispatch(agentId, '+911234567890');
    
    // Test 4: Call Logs
    await this.testCallLogs();

    // Test 5: Cleanup
    await this.cleanupTestAgent(agentId);

    console.log('\n🎉 Diagnostic complete!');
    
    if (callResult && callResult.success) {
      console.log('\n✅ ALL TESTS PASSED - Your Omnidimension integration should work!');
      console.log('\n📞 To receive actual calls:');
      console.log('1. Make sure your phone number is correct and can receive calls');
      console.log('2. Check that your account has calling credits');
      console.log('3. Verify your account is not in sandbox mode');
      console.log('4. Contact Omnidimension support if calls still don\'t come through');
    } else {
      console.log('\n⚠️ Some tests failed - check the errors above');
    }
  }
}

// Run the diagnostic
if (require.main === module) {
  const diagnostic = new OmnidimensionDiagnostic();
  diagnostic.runFullDiagnostic().catch(console.error);
}

module.exports = OmnidimensionDiagnostic;
