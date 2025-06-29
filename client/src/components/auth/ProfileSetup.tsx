import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
  
const ProfileSetup = () => {
  const { user, isAuthenticated, loading, updateUserType } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  // Handle user type selection
  const handleUserTypeSelection = async (userType: 'recruiter' | 'candidate') => {
    await updateUserType(userType);
    navigate('/dashboard');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Choose how you want to use Vocra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Welcome {user?.name}! Please select your role to continue.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer border-2 hover:border-blue-400 transition-all"
              onClick={() => handleUserTypeSelection('recruiter')}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Recruiter</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-500">
                  I want to use AI to interview candidates and streamline my hiring process.
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer border-2 hover:border-blue-400 transition-all" 
              onClick={() => handleUserTypeSelection('candidate')}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Candidate</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-500">
                  I want to practice interviews and improve my interview skills with AI.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;
