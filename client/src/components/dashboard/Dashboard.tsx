import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
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
  DollarSign
} from 'lucide-react';

// Mock data for demonstration
const mockJobPostings = [
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

const mockInterviews = [
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
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the job
    console.log('Creating job:', formData);
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Job Posting</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
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
            <Label htmlFor="salary" className="text-white">Salary Range</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="e.g., $60,000 - $80,000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dashboard for recruiters
const RecruiterDashboard = () => {
  const [jobPostings, setJobPostings] = useState(mockJobPostings);
  const [searchTerm, setSearchTerm] = useState('');

  const handleJobCreated = () => {
    // Refresh job listings
    console.log('Job created successfully');
  };

  const filteredJobs = jobPostings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Recruiter Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your job postings and track interviews</p>
        </div>
        <CreateJobDialog onJobCreated={handleJobCreated} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{jobPostings.length}</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-500">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {jobPostings.reduce((sum, job) => sum + job.applicants, 0)}
            </div>
            <p className="text-xs text-gray-400">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {jobPostings.filter(job => job.status === 'Active').length}
            </div>
            <p className="text-xs text-gray-400">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockInterviews.length}</div>
            <p className="text-xs text-gray-400">
              <span className="text-blue-500">1</span> scheduled today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
          <TabsTrigger value="jobs" className="data-[state=active]:bg-gray-800 text-gray-300">Job Postings</TabsTrigger>
          <TabsTrigger value="interviews" className="data-[state=active]:bg-gray-800 text-gray-300">Interviews</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-800 text-gray-300">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Job Postings Table */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Job Postings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your active and closed job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Job Title</TableHead>
                    <TableHead className="text-gray-300">Company</TableHead>
                    <TableHead className="text-gray-300">Location</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Salary</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Applicants</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id} className="border-gray-800">
                      <TableCell className="font-medium text-white">{job.title}</TableCell>
                      <TableCell className="text-gray-300">{job.company}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{job.type}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{job.applicants}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400">
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
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Interviews</CardTitle>
              <CardDescription className="text-gray-400">
                Track and manage your interview sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Candidate</TableHead>
                    <TableHead className="text-gray-300">Position</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Score</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInterviews.map((interview) => (
                    <TableRow key={interview.id} className="border-gray-800">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarFallback className="bg-gray-700 text-white">
                              {interview.candidate.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {interview.candidate}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{interview.position}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {interview.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={interview.status === 'Completed' ? 'default' : 'secondary'}>
                          {interview.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {interview.score ? (
                          <div className="flex items-center">
                            <span className="mr-2">{interview.score}/10</span>
                            <Progress value={interview.score * 10} className="w-16" />
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Application Trends</CardTitle>
                <CardDescription className="text-gray-400">
                  Weekly application statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center text-gray-500">
                  Chart placeholder - Integration with charting library needed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Interview Success Rate</CardTitle>
                <CardDescription className="text-gray-400">
                  Average performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Score</span>
                    <span className="text-white font-bold">7.8/10</span>
                  </div>
                  <Progress value={78} className="w-full" />
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Completion Rate: 92%</span>
                    <span>Total Interviews: 156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Dashboard for candidates
const CandidateDashboard = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Candidate Dashboard</h1>
        <p className="text-gray-400 mt-1">Practice interviews and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Practice Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-500">+3</span> this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8.2</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-500">+0.5</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Skills Improved</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7</div>
            <p className="text-xs text-gray-400">
              Communication, Problem Solving
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-gray-400">
              <span className="text-blue-500">2</span> interviews scheduled
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Practice Interviews</CardTitle>
            <CardDescription className="text-gray-400">Start a practice interview with AI</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/practice">Start Practice</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">My Results</CardTitle>
            <CardDescription className="text-gray-400">View your past interview results and feedback</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link to="/my-results">View Results</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Improve Skills</CardTitle>
            <CardDescription className="text-gray-400">Resources to improve your interview skills</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link to="/resources">View Resources</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Your Progress</h3>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Communication Skills</span>
                <span className="text-white font-bold">85%</span>
              </div>
              <Progress value={85} className="w-full" />
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Technical Knowledge</span>
                <span className="text-white font-bold">78%</span>
              </div>
              <Progress value={78} className="w-full" />
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Problem Solving</span>
                <span className="text-white font-bold">92%</span>
              </div>
              <Progress value={92} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Dashboard component that renders the appropriate dashboard based on user type
const Dashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-950 min-h-screen">
      {user?.userType === 'recruiter' ? (
        <RecruiterDashboard />
      ) : user?.userType === 'candidate' ? (
        <CandidateDashboard />
      ) : (
        <div className="text-center p-8 bg-gray-950 min-h-screen flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-white">Please complete your profile setup</h2>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/profile-setup">Complete Setup</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
