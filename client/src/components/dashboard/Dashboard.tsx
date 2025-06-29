import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Header } from '../layout/header';
import { Main } from '../layout/main';
import { AuthenticatedLayout } from '../layout/authenticated-layout';
import { SidebarTrigger } from '../layout/sidebar';
import { 
  PlusCircle, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Clock,
  DollarSign,
  Download,
  Bell,
  User,  BarChart3,
  FileText,
  Calendar as CalendarIcon,
  LineChart,
  PieChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';

// API Services
const API_URL = 'http://localhost:5000/api';

// Interface definitions for type safety
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  status: string;
  applicantsCount: number;
  postedDate: string;
  description: string;
}

interface JobStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplicants: number;
}

interface Interview {
  id: string;
  candidate: string;
  position: string;
  date: string;
  status: string;
  score: number | null;
}

interface ChartData {
  monthlyData: Array<{name: string, applications: number, interviews: number}>;
  categoryData: Array<{name: string, count: number}>;
  statusData: Array<{name: string, value: number}>;
}

// API service functions
const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(`${API_URL}/jobs/recruiter/jobs`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.jobs || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

const fetchJobStats = async (): Promise<JobStats> => {
  try {
    const response = await fetch(`${API_URL}/jobs/recruiter/stats`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch job stats');
    }
    const data = await response.json();
    return data || { totalJobs: 0, activeJobs: 0, closedJobs: 0, totalApplicants: 0 };
  } catch (error) {
    console.error('Error fetching job stats:', error);
    return { totalJobs: 0, activeJobs: 0, closedJobs: 0, totalApplicants: 0 };
  }
};

const fetchAnalytics = async (): Promise<ChartData> => {
  try {
    const response = await fetch(`${API_URL}/jobs/recruiter/analytics`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    const data = await response.json();
    return data || {
      monthlyData: [],
      categoryData: [],
      statusData: []
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      monthlyData: [],
      categoryData: [],
      statusData: []
    };
  }
};

const createJob = async (jobData: any): Promise<Job | null> => {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    
    const data = await response.json();
    return data.job || null;
  } catch (error) {
    console.error('Error creating job:', error);
    return null;
  }
};

const updateJob = async (id: string, jobData: any): Promise<Job | null> => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update job');
    }
    
    const data = await response.json();
    return data.job || null;
  } catch (error) {
    console.error('Error updating job:', error);
    return null;
  }
};

const deleteJob = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    return false;
  }
};

// Mock data for demonstration
const jobPostings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    status: "Active",
    applicants: 45,
    postedDate: "2024-01-15",
    description: "Looking for an experienced frontend developer with React expertise."
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Contract",
    salary: "$60,000 - $80,000",
    status: "Active",
    applicants: 23,
    postedDate: "2024-01-10",
    description: "Creative designer needed for innovative web applications."
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    status: "Closed",
    applicants: 67,
    postedDate: "2023-12-20",
    description: "Node.js backend engineer for scalable microservices."
  }
];

// Sample chart data
const lineChartData = [
  { name: 'Jan', applications: 12, interviews: 8 },
  { name: 'Feb', applications: 19, interviews: 12 },
  { name: 'Mar', applications: 15, interviews: 10 },
  { name: 'Apr', applications: 27, interviews: 18 },
  { name: 'May', applications: 32, interviews: 24 },
  { name: 'Jun', applications: 25, interviews: 16 },
];

const barChartData = [
  { name: 'Development', count: 32 },
  { name: 'Design', count: 21 },
  { name: 'Marketing', count: 15 },
  { name: 'Management', count: 9 },
  { name: 'Support', count: 5 },
];

const pieChartData = [
  { name: 'Filled', value: 12 },
  { name: 'Open', value: 8 },
  { name: 'Interview', value: 5 },
];

const COLORS = ['#626F94', '#8394E0', '#A2B3F3'];

// Chart Components
const ApplicationsChart = ({ data = lineChartData }) => (
  <div className="h-[250px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="name" stroke="#888" />
        <YAxis stroke="#888" />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} 
          labelStyle={{ color: 'white' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="applications" 
          stroke="#626F94" 
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Applications"
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
        <Line 
          type="monotone" 
          dataKey="interviews" 
          stroke="#8394E0" 
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Interviews"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
);

const JobCategoryChart = ({ data = barChartData }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="name" stroke="#888" />
      <YAxis stroke="#888" />
      <RechartsTooltip 
        contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} 
        labelStyle={{ color: 'white' }}
      />
      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={['#626F94', '#8394E0', '#A2B3F3'][index % 3]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const JobStatusChart = ({ data = pieChartData }) => (
  <ResponsiveContainer width="100%" height={250}>
    <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={90}
        fill="#8884d8"
        paddingAngle={3}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        labelLine={false}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={['#626F94', '#8394E0', '#A2B3F3'][index % 3]} />
        ))}
      </Pie>
      <RechartsTooltip 
        contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} 
        labelStyle={{ color: 'white' }}
      />
      <Legend />
    </RechartsPieChart>
  </ResponsiveContainer>
);

const interviews = [
  {
    id: 1,
    candidate: "John Doe",
    position: "Senior Frontend Developer",
    date: "2024-01-20",
    status: "Scheduled",
    score: null
  },
  {
    id: 2,
    candidate: "Jane Smith",
    position: "UI/UX Designer",
    date: "2024-01-18",
    status: "Completed",
    score: 8.5
  }
];

// Job Creation Dialog Component
const CreateJobDialog = ({ onJobCreated }: { onJobCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createJob(formData);
      if (result) {
        onJobCreated();
        setOpen(false);
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          salary: '',
          description: ''
        });
      } else {
        setError('Failed to create job. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-black/80 border border-gray-800 text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </DialogTrigger>      <DialogContent className="sm:max-w-[500px] bg-black border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Job Posting</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 px-4 py-2 rounded-md text-sm mt-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">            <Label htmlFor="title" className="text-white">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-black/60 border-gray-800 text-white"
              required
            />
          </div>
          <div className="space-y-2">            <Label htmlFor="company" className="text-white">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="bg-black/60 border-gray-800 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location</Label>
              <Input                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="bg-black/60 border-gray-800 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">Job Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-white">Salary Range</Label>            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="bg-black/60 border-gray-800 text-white"
              placeholder="e.g., $60,000 - $80,000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Job Description</Label>            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-black/60 border-gray-800 text-white"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent border-gray-800 text-gray-300 hover:bg-black/80" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-black/80 border border-gray-800 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Creating...
                </>
              ) : (
                'Create Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Stats cards component
const StatsCards = ({ 
  userType, 
  jobStats, 
  interviewsCount 
}: { 
  userType: string;
  jobStats?: JobStats;
  interviewsCount?: number;
}) => {
  if (userType === 'recruiter') {
    return (      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/60 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{jobStats?.totalJobs || 0}</div>
            <p className="text-xs text-gray-400">
              <span className="text-gray-300">All time</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {jobStats?.totalApplicants || 0}
            </div>
            <p className="text-xs text-gray-400">
              <span className="text-gray-300">Across all jobs</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {jobStats?.activeJobs || 0}
            </div>
            <p className="text-xs text-gray-400">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{interviewsCount || 0}</div>
            <p className="text-xs text-gray-400">
              <span className="text-gray-300">Scheduled interviews</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Candidate stats
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-black/60 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">Practice Sessions</CardTitle>
          <CardDescription className="text-gray-400">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">12</span>
              <span className="text-xs text-gray-400 ml-2">
                <TrendingUp className="inline-block w-4 h-4 mr-1" />
                <span className="text-gray-300">+3</span> this week
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={75} className="h-2 bg-gray-800 rounded-full" />
        </CardContent>
      </Card>

      <Card className="bg-black/60 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">Average Score</CardTitle>
          <CardDescription className="text-gray-400">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">8.2</span>
              <span className="text-xs text-gray-400 ml-2">
                <TrendingUp className="inline-block w-4 h-4 mr-1" />
                <span className="text-gray-300">+0.5</span> from last month
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={82} className="h-2 bg-gray-800 rounded-full" />
        </CardContent>
      </Card>

      <Card className="bg-black/60 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">Skills Improved</CardTitle>
          <CardDescription className="text-gray-400">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">7</span>
              <span className="text-xs text-gray-400 ml-2">
                Communication, Problem Solving
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={70} className="h-2 bg-gray-800 rounded-full" />
        </CardContent>
      </Card>

      <Card className="bg-black/60 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">Applications</CardTitle>
          <CardDescription className="text-gray-400">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">5</span>
              <span className="text-xs text-gray-400 ml-2">
                <span className="text-gray-300">2</span> interviews scheduled
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={50} className="h-2 bg-gray-800 rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard content component
const DashboardContent = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobStats, setJobStats] = useState<JobStats>({ totalJobs: 0, activeJobs: 0, closedJobs: 0, totalApplicants: 0 });
  const [analyticsData, setAnalyticsData] = useState<ChartData>({
    monthlyData: [],
    categoryData: [],
    statusData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const jobData = await fetchJobs();
        setJobs(jobData);

        const statsData = await fetchJobStats();
        setJobStats(statsData);        const analyticsResponse = await fetchAnalytics();
        setAnalyticsData(analyticsResponse);
        
        // Set mock interviews data for now (would be from API in production)
        setInterviews([
          {
            id: '1',
            candidate: "John Doe",
            position: "Senior Frontend Developer",
            date: "2024-01-20",
            status: "Scheduled",
            score: null
          },
          {
            id: '2',
            candidate: "Jane Smith",
            position: "UI/UX Designer",
            date: "2024-01-18",
            status: "Completed",
            score: 8.5
          }
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === 'recruiter') {
      fetchData();
    }
  }, [user?.userType]);

  const handleJobCreated = async () => {
    // Refresh job data after creating a new job
    try {
      setLoading(true);
      const jobData = await fetchJobs();
      setJobs(jobData);
      
      const statsData = await fetchJobStats();
      setJobStats(statsData);
      
      const analyticsResponse = await fetchAnalytics();
      setAnalyticsData(analyticsResponse);
    } catch (err) {
      console.error('Error refreshing job data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const success = await deleteJob(jobId);
      if (success) {
        // Remove job from local state
        setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        
        // Refresh job stats
        const statsData = await fetchJobStats();
        setJobStats(statsData);
        
        // Refresh analytics
        const analyticsResponse = await fetchAnalytics();
        setAnalyticsData(analyticsResponse);
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleUpdateJobStatus = async (jobId: string, status: 'Active' | 'Closed') => {
    try {
      const updatedJob = await updateJob(jobId, { status });
      if (updatedJob) {
        // Update job in local state
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job._id === jobId ? { ...job, status: updatedJob.status } : job
          )
        );
        
        // Refresh job stats
        const statsData = await fetchJobStats();
        setJobStats(statsData);
      }
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>      {/* Header */}
      <Header className="bg-black/60 border-b border-gray-900">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">          {user?.userType === 'recruiter' && (
            <CreateJobDialog onJobCreated={handleJobCreated} />
          )}
          <Button variant="outline" size="sm" className="bg-black/80 border-gray-800 text-gray-300 hover:bg-black">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </Header>

      {/* Main Content */}      <Main>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/40 border border-red-800 text-red-300 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <StatsCards 
              userType={user?.userType || 'candidate'} 
              jobStats={jobStats}
              interviewsCount={interviews.length}
            />
          </>
        )}{/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-black border-b border-gray-900 rounded-none p-0 h-10">
            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none h-10 text-gray-300">
              Overview
            </TabsTrigger>
            {user?.userType === 'recruiter' && (
              <>
                <TabsTrigger value="jobs" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none h-10 text-gray-300">
                  Job Postings
                </TabsTrigger>
                <TabsTrigger value="interviews" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none h-10 text-gray-300">
                  Interviews
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="analytics" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent rounded-none h-10 text-gray-300">
              Analytics
            </TabsTrigger>
          </TabsList>          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.userType === 'recruiter' ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">New application for Frontend Developer</span>
                        <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">Interview completed: UI/UX Designer</span>
                        <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">Job posting published: Backend Engineer</span>
                        <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">Applied to Frontend Developer role</span>
                        <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">Completed practice interview</span>
                        <span className="text-xs text-gray-500 ml-auto">3 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">Profile view from TechCorp</span>
                        <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Most common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user?.userType === 'recruiter' ? (
                    <>
                      <Button className="w-full justify-start bg-black hover:bg-black/80 border border-gray-800 text-white">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Post New Job
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-gray-800 text-gray-300 hover:bg-gray-900">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Interview
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-gray-800 text-gray-300 hover:bg-gray-900">
                        <Users className="w-4 h-4 mr-2" />
                        Review Applications
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full justify-start bg-black hover:bg-black/80 border border-gray-800 text-white">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Jobs
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-gray-800 text-gray-300 hover:bg-gray-900">
                        <Calendar className="w-4 h-4 mr-2" />
                        Practice Interview
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-gray-800 text-gray-300 hover:bg-gray-900">
                        <User className="w-4 h-4 mr-2" />
                        Update Profile
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Applications</CardTitle>
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                  </div>
                  <CardDescription className="text-gray-400">
                    Monthly application trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationsChart data={analyticsData.monthlyData} />
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Job Categories</CardTitle>
                    <PieChart className="w-4 h-4 text-gray-400" />
                  </div>
                  <CardDescription className="text-gray-400">
                    Distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobCategoryChart data={analyticsData.categoryData} />
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Job Status</CardTitle>
                    <LineChart className="w-4 h-4 text-gray-400" />
                  </div>
                  <CardDescription className="text-gray-400">
                    Status of job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobStatusChart data={analyticsData.statusData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {user?.userType === 'recruiter' && (
            <>              <TabsContent value="jobs" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/60 border-gray-800 text-white"
                    />
                  </div>
                  <Button variant="outline" className="bg-black/60 border-gray-800 text-gray-300 hover:bg-black">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Card className="bg-black/60 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-white">Job Postings</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your active and closed job postings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-900">
                          <TableHead className="text-gray-300">Job Title</TableHead>
                          <TableHead className="text-gray-300">Location</TableHead>
                          <TableHead className="text-gray-300">Type</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Applicants</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs.map((job) => (                          <TableRow key={job._id} className="border-gray-900">
                            <TableCell className="font-medium text-white">{job.title}</TableCell>
                            <TableCell className="text-gray-300">
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                {job.location}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">{job.type}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-black border-gray-700 text-gray-300">
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">{job.applicantsCount}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-gray-400 hover:text-white"
                                  onClick={() => handleUpdateJobStatus(job._id, job.status === 'Active' ? 'Closed' : 'Active')}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-gray-400 hover:text-white"
                                  onClick={() => handleDeleteJob(job._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>              <TabsContent value="interviews" className="space-y-4">
                <Card className="bg-black/60 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Interviews</CardTitle>
                    <CardDescription className="text-gray-400">
                      Track and manage your interview sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-900">
                          <TableHead className="text-gray-300">Candidate</TableHead>
                          <TableHead className="text-gray-300">Position</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Score</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {interviews.map((interview) => (
                          <TableRow key={interview.id} className="border-gray-900">
                            <TableCell className="font-medium text-white">
                              <div className="flex items-center">
                                <Avatar className="w-8 h-8 mr-2 bg-gray-900 border border-gray-800">
                                  <AvatarFallback className="bg-black text-white">
                                    {interview.candidate.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                {interview.candidate}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">{interview.position}</TableCell>
                            <TableCell className="text-gray-300">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1 text-gray-400" />
                                {interview.date}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-black border-gray-700 text-gray-300">
                                {interview.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {interview.score ? (
                                <div className="flex items-center">
                                  <span className="mr-2">{interview.score}/10</span>
                                  <Progress value={interview.score * 10} className="w-16 bg-gray-800" />
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                  <CardDescription className="text-gray-400">
                    {user?.userType === 'recruiter' ? 'Hiring performance' : 'Interview performance'}
                  </CardDescription>
                </CardHeader>                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} 
                          labelStyle={{ color: 'white' }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="applications" 
                          stroke="#626F94" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          name="Applications"
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="interviews" 
                          stroke="#8394E0" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          name="Interviews"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-white">Success Rate</CardTitle>
                  <CardDescription className="text-gray-400">
                    {user?.userType === 'recruiter' ? 'Application to hire ratio' : 'Interview success rate'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="text-white font-bold">
                        {user?.userType === 'recruiter' ? '24%' : '78%'}
                      </span>
                    </div>
                    <Progress value={user?.userType === 'recruiter' ? 24 : 78} className="w-full bg-gray-800" />
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>
                        {user?.userType === 'recruiter' ? 'Hires: 12' : 'Interviews: 156'}
                      </span>
                      <span>
                        {user?.userType === 'recruiter' ? 'Applications: 50' : 'Applications: 200'}
                      </span>                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-white">Applications & Interviews</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly trend of applications and interviews
                  </CardDescription>
                </CardHeader>                <CardContent>
                  <ApplicationsChart data={analyticsData.monthlyData} />
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-white">Job Categories</CardTitle>
                  <CardDescription className="text-gray-400">
                    Distribution of jobs across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobCategoryChart data={analyticsData.categoryData} />
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-white">Job Status</CardTitle>
                  <CardDescription className="text-gray-400">
                    Current status of your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobStatusChart data={analyticsData.statusData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!user?.userType) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-white">Please complete your profile setup</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <a href="/profile-setup">Complete Setup</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <AuthenticatedLayout>
      <DashboardContent />
    </AuthenticatedLayout>
  );
};

export default Dashboard;
