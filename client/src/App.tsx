import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthProvider from "./context/AuthContext";
import LoginComponent from "./components/auth/LoginComponent";
import ProfileSetup from "./components/auth/ProfileSetup";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardNew from "./components/dashboard/DashboardNew";
import JobListings from "./components/jobs/JobListings";
import { AuthenticatedLayout } from "./components/layout/authenticated-layout";
import AuthNavbar from "./components/auth/AuthNavbar";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected Route Component with role-based redirects
const ProtectedRoute = ({ children, requireRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is authenticated but doesn't have a userType, redirect to profile setup
  if (user && (!user.userType || user.userType === null)) {
    return <Navigate to="/profile-setup" replace />;
  }
  
  // If a specific role is required and user doesn't have it, redirect to dashboard
  if (requireRole && user?.userType !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Role-based route component
const RoleBasedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If user doesn't have a role set, redirect to profile setup
  if (!user?.userType || user.userType === null) {
    return <Navigate to="/profile-setup" replace />;
  }
  
  return children;
};

// ConditionalNavbar Component
const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/dashboard', '/dashboard-new'];
  
  // Don't show the navbar on dashboard routes
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }
  
  return <AuthNavbar />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ConditionalNavbar />        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/profile-setup" element={
            <ProtectedRoute>
              <div className="pt-16"><ProfileSetup /></div>
            </ProtectedRoute>
          } />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <RoleBasedRoute>
              <TooltipProvider>
                <Dashboard />
              </TooltipProvider>
            </RoleBasedRoute>
          } />
          <Route path="/dashboard-new" element={
            <RoleBasedRoute>
              <TooltipProvider>
                <AuthenticatedLayout>
                  <DashboardNew />
                </AuthenticatedLayout>
              </TooltipProvider>
            </RoleBasedRoute>
          } />
          
          {/* Analytics Routes */}
          <Route path="/analytics" element={
            <RoleBasedRoute>
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                    <p>Analytics dashboard will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </RoleBasedRoute>
          } />
          
          {/* Job Management Routes */}
          <Route path="/jobs/manage" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Manage Jobs</h1>
                    <p>Job management interface will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/jobs/create" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Create Job</h1>
                    <p>Job creation form will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/jobs/analytics" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Job Analytics</h1>
                    <p>Job analytics dashboard will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          
          {/* Candidate Management Routes */}
          <Route path="/candidates" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">All Candidates</h1>
                    <p>Candidate management interface will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/candidates/shortlisted" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Shortlisted Candidates</h1>
                    <p>Shortlisted candidates will be shown here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/candidates/interviews" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Interview Pool</h1>
                    <p>Candidates in interview process will be shown here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          
          {/* Interview Routes */}
          <Route path="/interviews/schedule" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Schedule Interview</h1>
                    <p>Interview scheduling interface will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/interviews/ai" element={
            <RoleBasedRoute>
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">AI Interviews</h1>
                    <p>AI interview interface will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </RoleBasedRoute>
          } />
          <Route path="/interviews/reports" element={
            <ProtectedRoute requireRole="recruiter">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Interview Reports</h1>
                    <p>Interview reports will be shown here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          
          {/* Candidate-specific Routes */}
          <Route path="/profile" element={
            <ProtectedRoute requireRole="candidate">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                    <p>Candidate profile management will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute requireRole="candidate">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">My Applications</h1>
                    <p>Job applications tracking will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/jobs/saved" element={
            <ProtectedRoute requireRole="candidate">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
                    <p>Saved jobs will be shown here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/practice" element={
            <ProtectedRoute requireRole="candidate">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Practice Interviews</h1>
                    <p>Interview practice interface will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/interviews" element={
            <ProtectedRoute requireRole="candidate">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">My Interviews</h1>
                    <p>Scheduled interviews will be shown here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute requireRole="candidate">
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Interview Results</h1>
                    <p>Interview results and feedback will be shown here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          
          {/* Common Routes */}
          <Route path="/jobs" element={<div className="pt-16"><JobListings /></div>} />
          <Route path="/settings/account" element={
            <RoleBasedRoute>
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
                    <p>Account settings will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </RoleBasedRoute>
          } />
          <Route path="/settings/notifications" element={
            <RoleBasedRoute>
              <TooltipProvider>
                <AuthenticatedLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                    <p>Notification settings will be implemented here.</p>
                  </div>
                </AuthenticatedLayout>
              </TooltipProvider>
            </RoleBasedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<div className="pt-16"><NotFound /></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
