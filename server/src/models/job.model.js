const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance']
  },
  salary: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Closed'],
    default: 'Active'
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewing', 'Interview', 'Rejected', 'Hired'],
      default: 'Applied'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    coverLetter: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    resumeFileName: {
      type: String,
      default: ''
    },
    applicationDetails: {
      yearsOfExperience: {
        type: Number,
        default: 0
      },
      expectedSalary: {
        type: String,
        default: ''
      },
      availability: {
        type: String,
        default: ''
      },
      whyInterested: {
        type: String,
        default: ''
      }
    }
  }],
  postedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Adding a virtual property to get applicants count
jobSchema.virtual('applicantsCount').get(function() {
  return this.applicants ? this.applicants.length : 0;
});

// Set toJSON option to include virtuals
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
