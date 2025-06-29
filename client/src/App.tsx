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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
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
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/profile-setup" element={
            <ProtectedRoute>
              <div className="pt-16"><ProfileSetup /></div>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <TooltipProvider>
                <Dashboard />
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/dashboard-new" element={
            <ProtectedRoute>
              <TooltipProvider>
                <AuthenticatedLayout>
                  <DashboardNew />
                </AuthenticatedLayout>
              </TooltipProvider>
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={<div className="pt-16"><JobListings /></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<div className="pt-16"><NotFound /></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
