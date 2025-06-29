const axios = require('axios');

// Test data with different question formats
const testCases = [
  {
    name: 'Questions as JSON string',
    data: {
      interview_id: "test-call-123",
      candidate_name: "John Doe",
      job_title: "Software Engineer",
      company: "Test Company",
      duration: 1800,
      transcript: "Test transcript content...",
      technical_score: 85,
      communication_score: 78,
      confidence_score: 82,
      strengths: ["Strong problem-solving", "Good technical knowledge"],
      weaknesses: ["Could improve communication"],
      recommendation: "recommend",
      questions: JSON.stringify([
        "Tell me about yourself",
        "What's your experience with JavaScript?",
        "How do you handle debugging?"
      ])
    }
  },
  {
    name: 'Questions as plain string with separators',
    data: {
      interview_id: "test-call-456",
      candidate_name: "Jane Smith",
      job_title: "Full Stack Developer",
      company: "Test Company",
      duration: 1500,
      transcript: "Another test transcript...",
      technical_score: 90,
      communication_score: 85,
      confidence_score: 88,
      strengths: "Excellent coding skills",
      weaknesses: "Needs more system design experience",
      recommendation: "strongly_recommend",
      questions: "What is your favorite programming language?\nDescribe a challenging project you worked on;\nHow do you stay updated with technology trends?"
    }
  },
  {
    name: 'Questions as array of objects',
    data: {
      interview_id: "test-call-789",
      candidate_name: "Bob Johnson",
      job_title: "Backend Developer",
      company: "Test Company",
      duration: 2000,
      transcript: "Third test transcript...",
      technical_score: 88,
      communication_score: 80,
      confidence_score: 85,
      strengths: ["Strong backend knowledge", "Good API design"],
      weaknesses: ["Frontend skills need improvement"],
      recommendation: "recommend",
      questions: [
        {
          question: "Explain REST API principles",
          answer: "REST stands for...",
          timestamp: new Date()
        },
        {
          question: "How do you handle database optimization?",
          answer: "I use indexing and...",
          timestamp: new Date()
        }
      ]
    }
  }
];

async function testWebhook() {
  const baseUrl = 'http://localhost:5000';
  
  for (const testCase of testCases) {
    try {
      console.log(`\n--- Testing: ${testCase.name} ---`);
      console.log('Sending data:', JSON.stringify(testCase.data, null, 2));
      
      const response = await axios.post(
        `${baseUrl}/api/interviews/webhook/omnidimension`,
        testCase.data,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Omnidimension-Webhook/1.0'
          }
        }
      );
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
    } catch (error) {
      console.error(`Error in test case "${testCase.name}":`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

if (require.main === module) {
  testWebhook().then(() => {
    console.log('\nAll webhook tests completed');
    process.exit(0);
  }).catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { testWebhook };
