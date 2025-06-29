
import { HeroSection } from "@/components/ui/hero-section-dark"
import { Features } from "@/components/ui/features-8"
import Testimonials from "@/components/ui/testimonials-columns-1"
import Navbar from "@/components/Navbar"
import { CpuArchitecture } from "@/components/ui/cpu-architecture"
import { Button } from "@/components/ui/button"

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection
        title="AI-Powered Interviewing Platform"
        subtitle={{
          regular: "Revolutionize hiring with ",
          gradient: "intelligent AI interviews",
        }}
        description="Transform your recruitment process with our advanced AI technology that conducts fair, efficient, and insightful candidate interviews. Get deeper insights, reduce bias, and hire the best talent faster than ever before."
        ctaText="Start Free Trial"
        ctaHref="/signup"
        bottomImage={{
          light: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
          dark: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: "#4c1d95",
          darkLineColor: "#4c1d95",
        }}
      />      <Features />
      <Testimonials />      <section className="py-32 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:w-2/5 flex justify-center items-center">
              <div className="w-72 h-72 relative">
                <div className="absolute inset-0 bg-purple-900/10 rounded-full blur-3xl"></div>
                <CpuArchitecture 
                  width="100%" 
                  height="100%" 
                  text="AI" 
                  showCpuConnections={true} 
                  animateText={true} 
                  animateLines={true} 
                  animateMarkers={true} 
                />
              </div>
            </div>
            <div className="w-full lg:w-3/5">
              <h3 className="mb-4 text-3xl font-bold text-white md:mb-6 md:text-4xl lg:text-5xl">
                Ready to Transform Your Hiring Process?
              </h3>
              <p className="text-gray-300 lg:text-xl mb-8 max-w-2xl">
                Join the AI revolution in recruitment. Start conducting smarter, fairer, and more efficient interviews today with our advanced AI-powered platform.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-lg">
                  <a href="/signup">Start Free Trial</a>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-lg">
                  <a href="/demo">Schedule Demo</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
