
const CTA = () => {
  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="border border-blue-400/30 py-2 px-6 rounded-full bg-blue-500/10 text-blue-200 backdrop-blur-sm shadow-lg shadow-blue-500/20">
            🚀 Get Started
          </div>
        </div>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
          Ready to Transform Your{" "}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
            Hiring Process?
          </span>
        </h2>
        <p className="text-gray-200 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the AI revolution in recruitment. Start conducting smarter, fairer, and more efficient interviews today with our cutting-edge platform.
        </p>        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Primary CTA Button with enhanced glow effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <button className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 border border-white/10">
              <span className="flex items-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Secondary CTA Button */}
          <button className="text-gray-200 hover:text-white transition-all duration-300 py-4 px-8 text-lg font-semibold border border-gray-600/50 rounded-full hover:border-gray-400/50 hover:bg-gray-900/30 backdrop-blur-sm group">
            <span className="flex items-center gap-2">
              Schedule Demo
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-gray-800/50">
          <p className="text-gray-400 text-sm mb-4">Trusted by leading companies worldwide</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-gray-500 font-semibold">TechCorp</div>
            <div className="text-gray-500 font-semibold">InnovateLab</div>
            <div className="text-gray-500 font-semibold">FutureWorks</div>
            <div className="text-gray-500 font-semibold">NextGen</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
