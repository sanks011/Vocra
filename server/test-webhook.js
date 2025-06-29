// Test script to simulate Omnidimension webhook
const axios = require('axios');

async function testWebhook() {
  const webhookData = {
    interview_id: '5974', // Use the call ID from your last dispatch
    candidate_name: 'Chablamo Unlimited',
    job_title: 'C++ Developer',
    company: 'ISRO',
    duration: 300,
    transcript: `
Interviewer: Hello! Thank you for joining this interview for the C++ Developer position at ISRO. Let's get started with a few questions.

Candidate: Thank you for the opportunity. I'm excited to discuss this role.

Interviewer: Can you tell me about your experience with C++ and data structures?

Candidate: I have worked extensively with C++ for the past 3 years, focusing on algorithm implementation and data structure optimization. I've worked on projects involving trees, graphs, and hash tables.

Interviewer: How would you approach optimizing a slow algorithm in a production system?

Candidate: I would start by profiling to identify bottlenecks, then consider algorithmic improvements like changing data structures or using more efficient algorithms. I also look at memory usage patterns and consider parallel processing where applicable.

Interviewer: What interests you most about working at ISRO?

Candidate: I'm passionate about space technology and the cutting-edge work ISRO does. The opportunity to contribute to India's space missions using my technical skills would be incredibly fulfilling.

Interviewer: Great answers! Thank you for your time. We'll be in touch soon regarding next steps.
    `.trim(),
    technical_score: 85,
    communication_score: 90,
    confidence_score: 80,
    strengths: 'Strong C++ knowledge, Good problem-solving approach, Clear communication, Genuine interest in space technology',
    weaknesses: 'Could provide more specific project examples, Opportunity to demonstrate advanced algorithms',
    recommendation: 'recommend',
    questions: 'Experience with C++, Algorithm optimization approach, Interest in ISRO work'
  };

  try {
    console.log('Sending test webhook data...');
    const response = await axios.post('http://localhost:5000/api/interviews/webhook/omnidimension', webhookData);
    console.log('Webhook response:', response.data);
  } catch (error) {
    console.error('Webhook error:', error.response?.data || error.message);
  }
}

testWebhook();
