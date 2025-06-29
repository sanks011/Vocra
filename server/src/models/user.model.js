const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    userType: {
      type: String,
      enum: ['recruiter', 'candidate'],
      required: true,
    },
    profile: {
      // For candidate
      resume: String,
      skills: [String],
      experience: [
        {
          title: String,
          company: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      // For recruiter
      company: {
        name: String,
        position: String,
        website: String,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
