import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, Phone, MapPin, Calendar, FileText, ChevronDown, ChevronUp, Download, DollarSign, Clock, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Candidates = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [expandedApplications, setExpandedApplications] = useState(new Set());

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/recruiter/applications`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/recruiter/jobs`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const updateApplicationStatus = async (jobId, applicantId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}/applicants/${applicantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // Refresh applications
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'Interview': return 'bg-purple-100 text-purple-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesJob = jobFilter === 'all' || app.job?._id === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const toggleApplicationExpansion = (applicationId) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId);
    } else {
      newExpanded.add(applicationId);
    }
    setExpandedApplications(newExpanded);
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
        <h1 className="text-3xl font-bold">Candidates</h1>
        <p className="text-gray-600">Review and manage job applications</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobs.map(job => (
              <SelectItem key={job._id} value={job._id}>{job.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-gray-500">No applications found.</p>
            </CardContent>
          </Card>
        ) : (          filteredApplications.map((application) => {
            const applicationId = `${application.job?._id}-${application.candidate?._id}`;
            const isExpanded = expandedApplications.has(applicationId);
            
            return (
            <Card key={applicationId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.candidate?.avatar} />
                      <AvatarFallback>
                        {application.candidate?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{application.candidate?.name}</CardTitle>
                      <CardDescription className="text-base">
                        Applied for: {application.job?.title}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {application.candidate?.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>Job: {application.job?.title} at {application.job?.company}</p>
                      <p>Location: {application.job?.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApplicationExpansion(applicationId)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View Details
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Collapsible open={isExpanded}>
                    <CollapsibleContent className="space-y-4">
                      {/* Application Details */}
                      {application.applicationDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">Application Details</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span>{application.applicationDetails.yearsOfExperience} years experience</span>
                              </div>
                              {application.applicationDetails.expectedSalary && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span>Expected: {application.applicationDetails.expectedSalary}</span>
                                </div>
                              )}
                              {application.applicationDetails.availability && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span>Available: {application.applicationDetails.availability}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {application.resumeUrl && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-700">Resume</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${application.resumeUrl}`, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {application.resumeFileName || 'Download Resume'}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cover Letter */}
                      {application.coverLetter && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Cover Letter</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                        </div>
                      )}

                      {/* Why Interested */}
                      {application.applicationDetails?.whyInterested && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Why Interested in this Role</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.applicationDetails.whyInterested}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {application.status !== 'Hired' && application.status !== 'Rejected' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateApplicationStatus(application.job._id, application.candidate._id, 'Reviewing')}
                            >
                              Review
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateApplicationStatus(application.job._id, application.candidate._id, 'Interview')}
                            >
                              Interview
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => updateApplicationStatus(application.job._id, application.candidate._id, 'Hired')}
                            >
                              Hire
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updateApplicationStatus(application.job._id, application.candidate._id, 'Rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          )})
        )}
      </div>
    </div>
  );
};

export default Candidates;
