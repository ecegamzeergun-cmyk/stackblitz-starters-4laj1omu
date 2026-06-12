export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          Contra<span className="text-[#e63946]">rian</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Stop trusting your gut. Start trusting your data.
        </p>
        <p className="text-gray-500 mb-10 text-base leading-relaxed">
          Log your investment decisions. Let AI find your patterns. 
          See what the crowd is doing — and what it&apos;s costing them.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="your@email.com"
            className="px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e63946] w-72"
          />
          <button className="px-6 py-3 bg-[#e63946] text-white font-semibold rounded-lg hover:bg-[#c1121f] transition-colors">
            Join Waitlist
          </button>
        </form>
        <p className="text-gray-600 text-sm mt-4">Early access. No spam.</p>
      </div>
    </main>
  );
}