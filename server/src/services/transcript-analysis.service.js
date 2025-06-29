const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY 
});

/**
 * Analyze interview transcript using Groq AI
 * @param {string} transcript - The interview transcript
 * @param {Object} jobContext - Job details for context
 * @param {string} candidateName - Candidate's name
 * @returns {Object} Analysis results
 */
async function analyzeTranscript(transcript, jobContext, candidateName = '') {
  try {
    console.log('🤖 Starting AI transcript analysis with Groq...');
    
    const prompt = `
You are an expert technical recruiter analyzing an interview transcript. Please provide a comprehensive analysis of the candidate's performance.

**Job Context:**
- Position: ${jobContext.title || 'Not specified'}
- Company: ${jobContext.company || 'Not specified'}
- Job Description: ${jobContext.description || 'Not specified'}
- Requirements: ${jobContext.requirements ? jobContext.requirements.join(', ') : 'Not specified'}

**Candidate:** ${candidateName || 'Candidate'}

**Interview Transcript:**
${transcript}

Please provide a detailed analysis in the following JSON format:

{
  "technicalScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "keyQuestions": [
    {
      "question": "question text",
      "answer": "candidate's answer",
      "quality": "excellent|good|average|poor"
    }
  ],
  "technicalSkillsAssessed": ["skill1", "skill2", "skill3"],
  "recommendation": "strongly_recommend|recommend|neutral|not_recommend|strongly_not_recommend",
  "detailedFeedback": "Comprehensive feedback paragraph",
  "improvementAreas": ["area1", "area2", "area3"],
  "standoutMoments": ["moment1", "moment2"],
  "redFlags": ["flag1", "flag2"] // if any
}

**Scoring Guidelines:**
- Technical Score: Assess technical knowledge, problem-solving ability, and job-specific skills
- Communication Score: Clarity, articulation, listening skills, and professional communication
- Confidence Score: Self-assurance, ability to handle pressure, and professional demeanor
- Overall Score: Weighted average considering all factors

**Analysis Instructions:**
1. Be objective and fair in your assessment
2. Look for specific examples from the transcript
3. Consider the job requirements when evaluating responses
4. Identify both strengths and areas for improvement
5. Provide actionable feedback
6. Flag any concerning responses or behaviors

Respond ONLY with valid JSON, no additional text or formatting.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert technical recruiter who analyzes interview transcripts. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const analysisText = completion.choices[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis received from Groq API');
    }

    console.log('📝 Raw AI analysis received:', analysisText);

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('❌ Failed to parse AI analysis JSON:', parseError);
      console.log('Raw response:', analysisText);
      throw new Error('Invalid JSON response from AI analysis');
    }

    // Validate and sanitize the analysis
    const sanitizedAnalysis = {
      technicalScore: Math.min(100, Math.max(0, analysis.technicalScore || 0)),
      communicationScore: Math.min(100, Math.max(0, analysis.communicationScore || 0)),
      confidenceScore: Math.min(100, Math.max(0, analysis.confidenceScore || 0)),
      overallScore: Math.min(100, Math.max(0, analysis.overallScore || 0)),
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths.slice(0, 10) : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses.slice(0, 10) : [],
      keyQuestions: Array.isArray(analysis.keyQuestions) ? analysis.keyQuestions.slice(0, 20) : [],
      technicalSkillsAssessed: Array.isArray(analysis.technicalSkillsAssessed) ? analysis.technicalSkillsAssessed.slice(0, 15) : [],
      recommendation: ['strongly_recommend', 'recommend', 'neutral', 'not_recommend', 'strongly_not_recommend'].includes(analysis.recommendation) 
        ? analysis.recommendation : 'neutral',
      detailedFeedback: analysis.detailedFeedback || 'Analysis completed',
      improvementAreas: Array.isArray(analysis.improvementAreas) ? analysis.improvementAreas.slice(0, 10) : [],
      standoutMoments: Array.isArray(analysis.standoutMoments) ? analysis.standoutMoments.slice(0, 10) : [],
      redFlags: Array.isArray(analysis.redFlags) ? analysis.redFlags.slice(0, 5) : []
    };

    console.log('✅ AI transcript analysis completed successfully');
    return sanitizedAnalysis;

  } catch (error) {
    console.error('❌ Error in AI transcript analysis:', error);
    
    // Return a fallback analysis if AI fails
    return {
      technicalScore: 50,
      communicationScore: 50,
      confidenceScore: 50,
      overallScore: 50,
      strengths: ['Participated in interview'],
      weaknesses: ['Analysis could not be completed'],
      keyQuestions: [],
      technicalSkillsAssessed: [],
      recommendation: 'neutral',
      detailedFeedback: 'Automatic analysis failed. Manual review required.',
      improvementAreas: ['Manual review needed'],
      standoutMoments: [],
      redFlags: ['Analysis failed - requires manual review']
    };
  }
}

/**
 * Extract key questions and answers from transcript
 * @param {string} transcript - The interview transcript
 * @returns {Array} Array of question-answer pairs
 */
function extractQuestionsFromTranscript(transcript) {
  if (!transcript || typeof transcript !== 'string') {
    return [];
  }

  const questions = [];
  const lines = transcript.split('\n').filter(line => line.trim());
  
  let currentQuestion = null;
  let currentAnswer = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Look for interviewer questions (usually start with "Interviewer:" or end with "?")
    if (trimmedLine.toLowerCase().includes('interviewer:') || 
        trimmedLine.toLowerCase().includes('ai:') ||
        trimmedLine.toLowerCase().includes('bot:')) {
      
      // Save previous question-answer pair
      if (currentQuestion) {
        questions.push({
          question: currentQuestion,
          answer: currentAnswer.trim(),
          timestamp: new Date()
        });
      }
      
      // Start new question
      currentQuestion = trimmedLine.replace(/^(interviewer|ai|bot):\s*/i, '');
      currentAnswer = '';
      
    } else if (trimmedLine.toLowerCase().includes('candidate:') || 
               trimmedLine.toLowerCase().includes('user:')) {
      
      // Candidate's response
      currentAnswer += ' ' + trimmedLine.replace(/^(candidate|user):\s*/i, '');
    }
  }

  // Add the last question-answer pair
  if (currentQuestion) {
    questions.push({
      question: currentQuestion,
      answer: currentAnswer.trim(),
      timestamp: new Date()
    });
  }

  return questions.slice(0, 20); // Limit to 20 questions
}

module.exports = {
  analyzeTranscript,
  extractQuestionsFromTranscript
};
