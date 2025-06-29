# Vocra - AI-Powered Interview Platform

## Overview

Vocra is a cutting-edge AI-powered interview platform designed for both recruiters and candidates. It streamlines the interview process by leveraging artificial intelligence for fair, efficient, and insightful candidate evaluation.

## Features

- **For Recruiters**: Create AI-powered interviews, manage candidates, and review interview results and analytics
- **For Candidates**: Practice interviews with AI, receive feedback, and improve interview skills
- **Authentication**: Secure Google OAuth 2.0 authentication
- **User Profiles**: Custom profiles for both recruiters and candidates

## Tech Stack

### Frontend:
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Router

### Backend:
- Node.js
- Express
- MongoDB
- Passport.js for Google OAuth

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB account
- Google OAuth credentials

### Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Install server dependencies:
```
cd server
npm install
```

3. Install client dependencies:
```
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=<your-mongodb-uri>
PORT=5000
NODE_ENV=development
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=<your-session-secret>
```

5. Start the server:
```
cd ../server
npm run dev
```

6. Start the client:
```
cd ../client
npm run dev
```

## Authentication Flow

1. User clicks "Sign In" or "Start Free Trial" button
2. User is redirected to Google OAuth consent screen
3. After authentication, user is redirected back to the application
4. New users are prompted to select their user type (recruiter or candidate)
5. User is redirected to their respective dashboard

## License

[MIT](LICENSE)
