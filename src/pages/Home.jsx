import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center text-center px-6">
      
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        🧠 Digital Twin of Your Productivity
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 max-w-2xl mb-6 text-lg">
        Track your daily activities, understand where your time goes, 
        and simulate a better version of your future.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl font-semibold transition">
          Get Started
        </button>

        <button className="border border-gray-700 hover:bg-gray-800 px-6 py-3 rounded-xl transition">
          Learn More
        </button>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl">
        
        <FeatureCard 
          title="📊 Track Activity"
          desc="Monitor coding, browsing, and idle time in one place"
        />

        <FeatureCard 
          title="🤖 AI Insights"
          desc="Get smart suggestions to improve your productivity"
        />

        <FeatureCard 
          title="🔮 Future Simulation"
          desc="See what happens if you change your habits"
        />
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, desc }) {
  return (
    <div className="bg-gray-900 p-5 rounded-2xl shadow hover:scale-105 transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}