const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Interview Scheduling
  scheduledAt: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'expired', 'cancelled'],
    default: 'scheduled'
  },
  
  // CV Processing
  cvText: {
    type: String,
    default: ''
  },
  cvProcessed: {
    type: Boolean,
    default: false
  },
  
  // Omnidimension Integration
  agentId: {
    type: String,
    default: ''
  },
  callId: {
    type: String,
    default: ''
  },
  callUrl: {
    type: String,
    default: ''
  },
  
  // Interview Context
  jobContext: {
    title: String,
    description: String,
    requirements: [String],
    company: String
  },
  
  // Interview Results
  interviewData: {
    duration: {
      type: Number,
      default: 0 // in seconds
    },
    transcript: {
      type: String,
      default: ''
    },
    questions: [{
      question: String,
      answer: String,
      timestamp: Date
    }],
    
    // AI Analysis
    analysis: {
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      technicalScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      communicationScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      strengths: [String],
      weaknesses: [String],
      recommendation: {
        type: String,
        enum: ['strongly_recommend', 'recommend', 'neutral', 'not_recommend', 'strongly_not_recommend'],
        default: 'neutral'
      },
      summary: String
    }
  },
  
  // Notifications
  candidateNotified: {
    type: Boolean,
    default: false
  },
  recruiterNotified: {
    type: Boolean,
    default: false
  },
  
  // Attempts
  startedAt: Date,
  completedAt: Date,
  attemptCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
interviewSchema.index({ candidateId: 1, status: 1 });
interviewSchema.index({ recruiterId: 1, status: 1 });
interviewSchema.index({ jobId: 1, status: 1 });
interviewSchema.index({ expiresAt: 1 });

// Virtual for time remaining
interviewSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'scheduled') return 0;
  const now = new Date();
  const remaining = this.expiresAt - now;
  return Math.max(0, remaining);
});

// Set toJSON option to include virtuals
interviewSchema.set('toJSON', { virtuals: true });
interviewSchema.set('toObject', { virtuals: true });

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
