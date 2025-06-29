const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const OMNIDIMENSION_API_KEY = process.env.OMNIDIMENSION_API_KEY;
const OMNIDIMENSION_BASE_URL = process.env.OMNIDIMENSION_BASE_URL;

const client = axios.create({
  baseURL: OMNIDIMENSION_BASE_URL,
  headers: {
    'Authorization': `Bearer ${OMNIDIMENSION_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

async function testOmnidimensionSetup() {
  console.log('🔍 Testing Omnidimension API setup...\n');
  
  try {
    // 1. Test API authentication
    console.log('1. Testing API authentication...');
    const authTest = await client.get('/agents');
    console.log('✅ API authentication successful');
    console.log('Existing agents:', authTest.data?.json?.length || 0, 'agents\n');
    
    // 2. Check account details/limits
    console.log('2. Checking account details...');
    try {
      const accountInfo = await client.get('/account');
      console.log('Account info:', JSON.stringify(accountInfo.data, null, 2));
    } catch (err) {
      console.log('ℹ️ Account endpoint not available or requires different auth\n');
    }
    
    // 3. Test call logs to see previous attempts
    console.log('3. Checking recent call logs...');
    try {
      const callLogs = await client.get('/calls/logs', {
        params: { pageno: 1, pagesize: 5 }
      });
      const logs = callLogs.data?.json || callLogs.data;
      if (logs && logs.length > 0) {
        console.log('Recent calls:');
        logs.forEach((call, index) => {
          console.log(`  ${index + 1}. ID: ${call.id}, Status: ${call.status}, Phone: ${call.to_number}, Date: ${call.created_at}`);
        });
      } else {
        console.log('⚠️ No recent calls found - this might indicate calls aren\'t being logged');
      }
    } catch (err) {
      console.log('❌ Error fetching call logs:', err.response?.data || err.message);
    }
    
    console.log('\n4. Testing agent creation with minimal data...');
    const testAgent = await client.post('/agents', {
      name: 'Test Agent - Phone Troubleshooting',
      instructions: 'This is a test agent to troubleshoot phone call delivery issues.',
      language: 'en',
      max_duration: 300
    });
    
    const agentData = testAgent.data?.json || testAgent.data;
    console.log('✅ Test agent created:', agentData.id);
    
    // 5. Test call dispatch with test phone number
    console.log('\n5. Testing call dispatch...');
    const testPhoneNumber = '+15551234567'; // Use a known test number
    
    const callDispatch = await client.post('/calls/dispatch', {
      agent_id: parseInt(agentData.id),
      to_number: testPhoneNumber
    });
    
    const callData = callDispatch.data?.json || callDispatch.data;
    console.log('Call dispatch response:', JSON.stringify(callData, null, 2));
    
    if (callData.success) {
      console.log('✅ Call dispatched successfully');
      console.log('Request ID:', callData.requestId);
      
      // Wait a moment and check call status
      console.log('\n6. Checking call status after 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      try {
        const callStatus = await client.get(`/calls/logs/${callData.requestId}`);
        const statusData = callStatus.data?.json || callStatus.data;
        console.log('Call status:', JSON.stringify(statusData, null, 2));
      } catch (err) {
        console.log('❌ Error checking call status:', err.response?.data || err.message);
      }
    } else {
      console.log('❌ Call dispatch failed:', callData);
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.response?.data || error.message);
  }
}

async function checkPhoneNumberValidation() {
  console.log('\n📞 Testing phone number formats...\n');
  
  const testNumbers = [
    '+15551234567',     // US format with +1
    '15551234567',      // US format without +
    '+14155552671',     // Another US number
    '+447700900123'     // UK format
  ];
  
  // Create a simple test agent first
  try {
    const testAgent = await client.post('/agents', {
      name: 'Phone Format Test Agent',
      instructions: 'Test agent for phone number validation.',
      language: 'en',
      max_duration: 60
    });
    
    const agentData = testAgent.data?.json || testAgent.data;
    console.log('Test agent created:', agentData.id);
    
    for (const phoneNumber of testNumbers) {
      console.log(`Testing phone number: ${phoneNumber}`);
      try {
        const callDispatch = await client.post('/calls/dispatch', {
          agent_id: parseInt(agentData.id),
          to_number: phoneNumber
        });
        
        const callData = callDispatch.data?.json || callDispatch.data;
        console.log(`  ✅ Accepted: ${callData.success ? 'Yes' : 'No'}`);
        if (callData.requestId) {
          console.log(`  Request ID: ${callData.requestId}`);
        }
      } catch (error) {
        console.log(`  ❌ Rejected: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('Error in phone number validation test:', error.response?.data || error.message);
  }
}

async function checkAPILimits() {
  console.log('\n📊 Checking for API rate limits or restrictions...\n');
  
  // Try to make multiple rapid calls to see if there are rate limits
  for (let i = 0; i < 3; i++) {
    try {
      console.log(`Request ${i + 1}:`);
      const start = Date.now();
      const response = await client.get('/agents');
      const duration = Date.now() - start;
      console.log(`  ✅ Success in ${duration}ms`);
    } catch (error) {
      console.log(`  ❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 429) {
        console.log('  ⚠️ Rate limit detected!');
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run all tests
async function runDiagnostics() {
  console.log('🚀 Starting Omnidimension diagnostics...\n');
  
  await testOmnidimensionSetup();
  await checkPhoneNumberValidation();
  await checkAPILimits();
  
  console.log('\n📋 POTENTIAL ISSUES TO CHECK:');
  console.log('1. Account verification - is your Omnidimension account fully verified?');
  console.log('2. Phone number verification - does your account have permission to call specific numbers?');
  console.log('3. Sandbox vs Production - are you using a test API key with limited functionality?');
  console.log('4. Geographic restrictions - are there country/region limitations?');
  console.log('5. Account credits/billing - is your account funded for outbound calls?');
  console.log('6. Phone carrier blocking - some carriers block automated calls');
  console.log('7. Time-based restrictions - some services have time windows for calls');
  console.log('\n💡 RECOMMENDED ACTIONS:');
  console.log('1. Check your Omnidimension dashboard for account status');
  console.log('2. Verify your phone number can receive calls from unknown numbers');
  console.log('3. Try calling during business hours');
  console.log('4. Contact Omnidimension support with your API key and request details');
  console.log('5. Test with multiple phone numbers to isolate the issue');
}

runDiagnostics();
