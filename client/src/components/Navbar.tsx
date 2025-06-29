
import { useState, useEffect } from "react"
import { Menu, X, Sparkles, Home, Component as ComponentIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced styling */}
          <div className="flex items-center">            <a href="/" className="flex items-center space-x-2">
              <div className="relative p-2">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Vocra
              </span>
            </a>
          </div>
            {/* Desktop Navigation with Simple Breadcrumbs */}
          <div className="hidden md:flex items-center">
            <Breadcrumb>
              <BreadcrumbList>                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-blue-500/20 hover:text-blue-200 transition-colors">
                    <Home size={16} strokeWidth={2} aria-hidden="true" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/features" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors">
                    <ComponentIcon size={16} strokeWidth={2} aria-hidden="true" />
                    Features
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/features" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors">
                    <ComponentIcon size={16} strokeWidth={2} aria-hidden="true" />
                    Pricing
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="flex items-center space-x-3 ml-6">
              <Button variant="outline">Sign In</Button>
              <Button>Start Free Trial</Button>
            </div>
          </div>
          <div className="md:hidden">            <button
              onClick={toggleMenu}
              className="p-2 text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>        {/* Simple Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 bg-transparent">
              <Breadcrumb>
                <BreadcrumbList className="flex-col">                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="inline-flex items-center gap-1.5 py-2 px-3 rounded-md hover:bg-blue-500/20 hover:text-blue-200 transition-colors">
                      <Home size={16} strokeWidth={2} aria-hidden="true" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/features" className="inline-flex items-center gap-1.5 py-2 px-3 rounded-md hover:bg-purple-500/20 hover:text-purple-200 transition-colors">
                      <ComponentIcon size={16} strokeWidth={2} aria-hidden="true" />
                      Features
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="py-2">Pricing</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-gray-800">
                <Button variant="outline">Sign In</Button>
                <Button>Start Free Trial</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
