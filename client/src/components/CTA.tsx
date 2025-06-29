
const CTA = () => {
  return (
    <section className="py-20 px-4 bg-gray-900 dark:bg-black">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Hiring Process?
          </span>
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Join the AI revolution in recruitment. Start conducting smarter, fairer, and more efficient interviews today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 text-xs font-medium backdrop-blur-3xl">
              <button className="inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent text-white border-input border-[1px] hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent transition-all py-4 px-8 text-lg font-semibold">
                Start Free Trial
              </button>
            </div>
          </span>
          <button className="text-gray-300 hover:text-white transition-colors py-4 px-8 text-lg font-medium">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  )
}

export default CTA
