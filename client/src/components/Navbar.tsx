
import { useState } from "react"
import { Menu, X, Home, Component } from "lucide-react"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-white">
              AI Interview
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="/features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              Start Free Trial
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 border-t border-gray-800">
              <a href="/" className="block px-3 py-2 text-gray-300 hover:text-white">
                Home
              </a>
              <a href="/features" className="block px-3 py-2 text-gray-300 hover:text-white">
                Features
              </a>
              <a href="/pricing" className="block px-3 py-2 text-gray-300 hover:text-white">
                Pricing
              </a>
              <a href="/about" className="block px-3 py-2 text-gray-300 hover:text-white">
                About
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                  Sign In
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
