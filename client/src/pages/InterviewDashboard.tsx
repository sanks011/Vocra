import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Play, CheckCircle, XCircle, AlertCircle, VideoIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const InterviewDashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const endpoint = user.userType === 'recruiter' 
        ? '/api/interviews/recruiter/interviews'
        : '/api/interviews/candidate/interviews';
        
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async (interviewId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}/start`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Open interview call in new window
        window.open(data.callUrl, '_blank', 'width=800,height=600');
        
        // Refresh interviews to update status
        fetchInterviews();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const remaining = expires - now;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getTimeRemainingPercent = (scheduledAt, expiresAt) => {
    const scheduled = new Date(scheduledAt);
    const expires = new Date(expiresAt);
    const now = new Date();
    
    const total = expires - scheduled;
    const elapsed = now - scheduled;
    
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return 100 - percent;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          {user.userType === 'recruiter' ? 'Interview Management' : 'My Interviews'}
        </h1>
        <p className="text-gray-600">
          {user.userType === 'recruiter' 
            ? 'Monitor and manage candidate interviews' 
            : 'Take your scheduled AI interviews'}
        </p>
      </div>

      <div className="grid gap-4">
        {interviews.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-gray-500">No interviews scheduled.</p>
            </CardContent>
          </Card>
        ) : (
          interviews.map((interview) => (
            <Card key={interview._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <VideoIcon className="h-5 w-5" />
                      {user.userType === 'recruiter' 
                        ? `${interview.candidateId?.name} - ${interview.jobId?.title}`
                        : interview.jobId?.title
                      }
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {user.userType === 'recruiter' 
                        ? `Candidate: ${interview.candidateId?.email}`
                        : `Company: ${interview.jobId?.company}`
                      }
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(interview.status)}>
                    {getStatusIcon(interview.status)}
                    <span className="ml-1 capitalize">{interview.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Scheduled: {new Date(interview.scheduledAt).toLocaleString()}
                    </span>
                    {interview.status === 'scheduled' && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeRemaining(interview.expiresAt)}
                      </span>
                    )}
                  </div>

                  {interview.status === 'scheduled' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Time Remaining</span>
                        <span>{getTimeRemaining(interview.expiresAt)}</span>
                      </div>
                      <Progress value={getTimeRemainingPercent(interview.scheduledAt, interview.expiresAt)} />
                    </div>
                  )}

                  {interview.status === 'completed' && interview.interviewData?.analysis && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {interview.interviewData.analysis.overallScore}%
                        </div>
                        <div className="text-xs text-gray-600">Overall</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {interview.interviewData.analysis.technicalScore}%
                        </div>
                        <div className="text-xs text-gray-600">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {interview.interviewData.analysis.communicationScore}%
                        </div>
                        <div className="text-xs text-gray-600">Communication</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {interview.interviewData.analysis.confidenceScore}%
                        </div>
                        <div className="text-xs text-gray-600">Confidence</div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">
                      {interview.attemptCount > 0 && (
                        <span>Attempts: {interview.attemptCount}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {interview.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          onClick={() => window.location.href = `/interview/${interview._id}/results`}
                        >
                          View Results
                        </Button>
                      )}
                      {interview.status === 'scheduled' && user.userType === 'candidate' && (
                        <Button onClick={() => startInterview(interview._id)}>
                          <Play className="mr-2 h-4 w-4" />
                          Start Interview
                        </Button>
                      )}
                      {interview.status === 'in_progress' && (
                        <Button variant="outline" disabled>
                          Interview in Progress...
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewDashboard;
