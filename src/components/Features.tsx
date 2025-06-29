
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Features = () => {
  const features = [
    {
      title: "AI-Powered Assessment",
      description: "Advanced algorithms analyze responses, body language, and speech patterns to provide comprehensive candidate evaluation.",
      icon: "🤖"
    },
    {
      title: "Real-time Feedback",
      description: "Get instant insights and scoring during interviews to make informed decisions quickly and efficiently.",
      icon: "⚡"
    },
    {
      title: "Bias-Free Evaluation",
      description: "Eliminate unconscious bias with objective AI analysis that focuses purely on skills and qualifications.",
      icon: "⚖️"
    },
    {
      title: "Smart Question Generation",
      description: "Automatically generate relevant questions based on job requirements and candidate background.",
      icon: "💡"
    },
    {
      title: "Interview Recording & Analysis",
      description: "Record sessions and get detailed post-interview reports with actionable insights and recommendations.",
      icon: "📹"
    },
    {
      title: "Integration Ready",
      description: "Seamlessly integrate with your existing HR tools and applicant tracking systems.",
      icon: "🔗"
    }
  ]

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powerful AI Features
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Transform your hiring process with cutting-edge AI technology that delivers accurate, fair, and efficient candidate assessments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="text-3xl mb-2">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
