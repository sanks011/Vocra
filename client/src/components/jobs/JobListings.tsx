import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Search, 
  Filter, 
  Briefcase,
  Building,
  Users
} from 'lucide-react';

// Mock job data that would typically come from an API
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    postedDate: "2024-01-15",
    description: "We're looking for an experienced frontend developer with React expertise to join our dynamic team. You'll be working on cutting-edge web applications and collaborating with cross-functional teams.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Modern CSS frameworks"],
    benefits: ["Health insurance", "Remote work", "Flexible hours", "Learning budget"]
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Contract",
    salary: "$60,000 - $80,000",
    postedDate: "2024-01-10",
    description: "Creative designer needed for innovative web applications. You'll be responsible for creating user-centered designs that enhance user experience and drive engagement.",
    requirements: ["3+ years UI/UX experience", "Figma proficiency", "Portfolio required"],
    benefits: ["Flexible schedule", "Creative freedom", "Modern equipment"]
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    postedDate: "2023-12-20",
    description: "Node.js backend engineer for scalable microservices. Join our fast-growing startup and help build the infrastructure that powers our platform.",
    requirements: ["Node.js expertise", "Database experience", "API design skills"],
    benefits: ["Equity package", "Health insurance", "Gym membership", "Team events"]
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$95,000 - $140,000",
    postedDate: "2024-01-12",
    description: "Join our data science team to develop machine learning models and extract insights from large datasets. You'll work on exciting projects across various industries.",
    requirements: ["Python/R proficiency", "ML experience", "Statistics background"],
    benefits: ["Conference budget", "Research time", "Latest tools", "Mentorship"]
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateCorp",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$100,000 - $150,000",
    postedDate: "2024-01-08",
    description: "Lead product strategy and roadmap for our flagship products. Work closely with engineering, design, and business teams to deliver exceptional user experiences.",
    requirements: ["5+ years product management", "Agile experience", "Technical background"],
    benefits: ["Stock options", "Unlimited PTO", "Learning budget", "Team retreats"]
  },
];

const JobListings = () => {  const [jobs, setJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);

  // Filter jobs based on search criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || job.location.includes(locationFilter);
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleApply = (jobId: number) => {
    console.log(`Applying for job ${jobId}`);
    // Here you would typically redirect to application form or handle application logic
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Job Opportunities</h1>
          <p className="text-gray-400">Find your next career opportunity</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="Austin">Austin</SelectItem>
                <SelectItem value="Seattle">Seattle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {job.type}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>                <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                <div className="text-gray-400 flex items-center mt-1">
                  <Building className="w-4 h-4 mr-1" />
                  {job.company}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-3">
                  {job.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salary}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {job.requirements.slice(0, 2).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-700 text-gray-300">
                      {req}
                    </Badge>
                  ))}
                  {job.requirements.length > 2 && (
                    <Badge variant="outline" className="text-xs border-gray-700 text-gray-300">
                      +{job.requirements.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleApply(job.id)}
                  >
                    Apply Now
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Job Detail Modal/Sidebar could be added here */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                    <p className="text-gray-400 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {selectedJob.company}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedJob(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedJob.type}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {selectedJob.salary}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Job Description</h3>
                    <p className="text-gray-300">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleApply(selectedJob.id)}
                    >
                      Apply for this Position
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Save Job
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
