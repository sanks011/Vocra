// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

// Check if user is a recruiter
exports.isRecruiter = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'recruiter') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Recruiter role required.' });
};

// Check if user is a candidate
exports.isCandidate = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'candidate') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Candidate role required.' });
};
