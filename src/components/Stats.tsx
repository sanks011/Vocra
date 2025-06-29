
const Stats = () => {
  const stats = [
    {
      number: "95%",
      label: "Accuracy Rate",
      description: "AI-powered candidate assessment"
    },
    {
      number: "75%",
      label: "Time Saved",
      description: "Reduced hiring process duration"
    },
    {
      number: "50K+",
      label: "Interviews Conducted",
      description: "Successfully processed candidates"
    },
    {
      number: "500+",
      label: "Companies Trust Us",
      description: "From startups to enterprises"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-800 to-pink-700">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Join thousands of companies who have revolutionized their hiring process with our AI-powered platform.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-purple-200 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-purple-300">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
