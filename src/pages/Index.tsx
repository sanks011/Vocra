
import { HeroSection } from "@/components/ui/hero-section-dark"
import { Features } from "@/components/ui/features-8"
import Testimonials from "@/components/ui/testimonials-columns-1"
import { Cta10 } from "@/components/ui/cta10"
import Navbar from "@/components/Navbar"

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
          opacity: 0.2,
          cellSize: 50,
          lightLineColor: "#4c1d95",
          darkLineColor: "#4c1d95",
        }}
      />
      <Features />
      <Testimonials />
      <Cta10 
        heading="Ready to Transform Your Hiring Process?"
        description="Join the AI revolution in recruitment. Start conducting smarter, fairer, and more efficient interviews today with our advanced AI-powered platform."
        buttons={{
          primary: {
            text: "Start Free Trial",
            url: "/signup"
          },
          secondary: {
            text: "Schedule Demo",
            url: "/demo"
          }
        }}
      />
    </div>
  );
};

export default Index;
