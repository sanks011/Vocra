import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MessageSquare, 
  Award,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const InterviewResults = () => {
  const { interviewId } = useParams();
  const { user } = useAuth();
  const [interview, setInterview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewResults();
  }, [interviewId]);

  const fetchInterviewResults = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}/analytics`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setInterview(data.interview);
        setAnalytics(data.analytics);
      } else {
        console.error('Failed to fetch interview results');
      }
    } catch (error) {
      console.error('Error fetching interview results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'strongly_recommend': return 'bg-green-100 text-green-800';
      case 'recommend': return 'bg-blue-100 text-blue-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'not_recommend': return 'bg-orange-100 text-orange-800';
      case 'strongly_not_recommend': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'strongly_recommend':
      case 'recommend':
        return <CheckCircle className="h-4 w-4" />;
      case 'not_recommend':
      case 'strongly_not_recommend':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const formatRecommendation = (recommendation) => {
    return recommendation.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!interview || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Interview Results Not Found</h2>
          <p className="text-gray-600 mt-2">The interview results are not available.</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Interview Results</h1>
          <p className="text-gray-600 mt-1">
            {interview.job.title} at {interview.job.company}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Candidate: {interview.candidate.name} • 
            Completed: {new Date(interview.completedAt).toLocaleString()}
          </p>
        </div>
        <Button onClick={() => window.history.back()} variant="outline">
          Back to Interviews
        </Button>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Overall Assessment</CardTitle>
              <CardDescription>AI-powered interview analysis</CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(analytics.overallScore)}`}>
                {analytics.overallScore}%
              </div>
              <Badge className={getRecommendationColor(analytics.recommendation)}>
                {getRecommendationIcon(analytics.recommendation)}
                <span className="ml-1">{formatRecommendation(analytics.recommendation)}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(analytics.technicalScore)} mb-2`}>
              {analytics.technicalScore}%
            </div>
            <Progress value={analytics.technicalScore} className="mb-2" />
            <p className="text-sm text-gray-600">
              Assessment of technical competency and knowledge
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(analytics.communicationScore)} mb-2`}>
              {analytics.communicationScore}%
            </div>
            <Progress value={analytics.communicationScore} className="mb-2" />
            <p className="text-sm text-gray-600">
              Clarity, articulation, and communication effectiveness
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(analytics.confidenceScore)} mb-2`}>
              {analytics.confidenceScore}%
            </div>
            <Progress value={analytics.confidenceScore} className="mb-2" />
            <p className="text-sm text-gray-600">
              Confidence level and presentation skills
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="areas">Areas to Improve</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Summary</CardTitle>
              <CardDescription>
                Duration: {formatDuration(interview.duration)} • 
                Questions Asked: {interview.questions?.length || 0}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {analytics.summary || 'No summary available.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.strengths?.length > 0 ? (
                <ul className="space-y-2">
                  {analytics.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No specific strengths identified.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.weaknesses?.length > 0 ? (
                <ul className="space-y-2">
                  {analytics.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No specific areas for improvement identified.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Interview Transcript
              </CardTitle>
              <CardDescription>
                Complete conversation transcript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {interview.transcript ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {interview.transcript}
                  </pre>
                ) : (
                  <p className="text-gray-500">Transcript not available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewResults;
