import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building, Clock, DollarSign, Bookmark, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import JobApplicationModal from '@/components/jobs/JobApplicationModal';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [applicationStatuses, setApplicationStatuses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [applicationModal, setApplicationModal] = useState({ 
    isOpen: false, 
    jobId: '', 
    jobTitle: '',
    company: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (locationFilter) params.append('location', locationFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      
      const response = await fetch(`http://localhost:5000/api/jobs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        
        // Check application status for each job if user is logged in
        if (user) {
          checkApplicationStatuses(data);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatuses = async (jobsList) => {
    const statuses = {};
    for (const job of jobsList) {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${job._id}/application-status`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          statuses[job._id] = data.hasApplied;
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    }
    setApplicationStatuses(statuses);
  };

  const handleApplyClick = (job) => {
    setApplicationModal({
      isOpen: true,
      jobId: job._id,
      jobTitle: job.title,
      company: job.company
    });
  };

  const handleApplicationSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${applicationModal.jobId}/apply`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        // Update application status immediately
        setApplicationStatuses(prev => ({
          ...prev,
          [applicationModal.jobId]: true
        }));
        
        setApplicationModal({ isOpen: false, jobId: '', jobTitle: '', company: '' });
        
        // Show success message
        alert('Application submitted successfully!');
        
        // Refresh jobs to update applicant count
        fetchJobs();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to apply for job');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const applyForJob = async (jobId) => {
    // This function is now replaced by the modal flow
    // Keeping for backward compatibility but not used
    console.log('Legacy apply function called');
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, locationFilter, typeFilter]);

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
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <p className="text-gray-600">Find your next career opportunity</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{job.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                    <DollarSign className="h-5 w-5" />
                    {job.salary}
                  </div>
                  
                  <p className="text-gray-700 line-clamp-3">{job.description}</p>
                  
                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li>And {job.requirements.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  )}                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                      <span>{job.applicantsCount || 0} applicants</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">View Details</Button>
                      {applicationStatuses[job._id] ? (
                        <Button disabled className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Applied
                        </Button>
                      ) : (
                        <Button onClick={() => handleApplyClick(job)}>
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))        )}
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={applicationModal.isOpen}
        onClose={() => setApplicationModal({ isOpen: false, jobId: '', jobTitle: '', company: '' })}
        onSubmit={handleApplicationSubmit}
        jobTitle={applicationModal.jobTitle}
        company={applicationModal.company}
        loading={submitting}
      />
    </div>
  );
};

export default Jobs;
