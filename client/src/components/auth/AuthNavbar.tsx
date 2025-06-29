import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Menu, X, Sparkles } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AuthNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced styling */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative p-2">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Vocra
              </span>
            </Link>
          </div>          {/* Desktop Navigation with Breadcrumbs */}
          <div className="hidden md:flex items-center">
            <Breadcrumb>
              <BreadcrumbList>                <BreadcrumbItem>
                  <BreadcrumbLink href="/jobs" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors text-white">
                    Jobs
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-500" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard-new" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors text-white">
                    New Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-500" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/features" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors text-white">
                    Features
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-500" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/pricing" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors text-white">
                    Pricing
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-500" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/about" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors text-white">
                    About
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="flex items-center space-x-3 ml-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Button variant="default" asChild>
                    <Link to="/dashboard">Get Started</Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Avatar>
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link to="/profile" className="w-full">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/settings" className="w-full">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (              <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild className="text-white hover:bg-white/20 hover:text-white">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="default" asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
                    <Link to="/login">Start Free Trial</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 bg-black/80 backdrop-blur-sm">
              <div className="space-y-3">
                <Link to="/features" className="block py-2 text-white hover:text-purple-300">
                  Features
                </Link>
                <Link to="/pricing" className="block py-2 text-white hover:text-purple-300">
                  Pricing
                </Link>
                <Link to="/about" className="block py-2 text-white hover:text-purple-300">
                  About
                </Link>
              </div>
              
              <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-gray-800">
                {isAuthenticated ? (
                  <>
                    <Button variant="default" asChild>
                      <Link to="/dashboard">Get Started</Link>
                    </Button>
                    <Button variant="outline" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>                    <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button variant="default" asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
                      <Link to="/login">Start Free Trial</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthNavbar;
