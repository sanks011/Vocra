import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

// Dashboard for recruiters
const RecruiterDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recruiter Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Interview</CardTitle>
            <CardDescription>Set up a new AI-powered interview session</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link to="/interviews/create">Create New</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Candidates</CardTitle>
            <CardDescription>View and manage your candidate pool</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link to="/candidates">View Candidates</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Interview Results</CardTitle>
            <CardDescription>View completed interview reports and analytics</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link to="/results">View Results</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">No recent activities</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard for candidates
const CandidateDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Candidate Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Practice Interviews</CardTitle>
            <CardDescription>Start a practice interview with AI</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link to="/practice">Start Practice</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Results</CardTitle>
            <CardDescription>View your past interview results and feedback</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link to="/my-results">View Results</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Improve Skills</CardTitle>
            <CardDescription>Resources to improve your interview skills</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild>
              <Link to="/resources">View Resources</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">No interview practice sessions yet</p>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard component that renders the appropriate dashboard based on user type
const Dashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {user?.userType === 'recruiter' ? (
        <RecruiterDashboard />
      ) : user?.userType === 'candidate' ? (
        <CandidateDashboard />
      ) : (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Please complete your profile setup</h2>
          <Button asChild>
            <Link to="/profile-setup">Complete Setup</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
