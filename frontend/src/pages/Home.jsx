import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-blue-50 to-white">
      {/* 🚀 Hero Section */}
      <section className="text-center py-16 px-4 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyber-blue-700 mb-4">
            <span className="inline-block animate-bounce">🚀</span> TaskFlow
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
            Organize your tasks, track progress, and boost productivity — all with military-grade security and intuitive design.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-cyber-blue-600 hover:bg-cyber-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border-2 border-cyber-blue-600 text-cyber-blue-600 hover:bg-cyber-blue-50 px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        <h2 className="text-3xl font-bold text-center text-cyber-blue-700 mb-12">
          Supercharge Your Productivity
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '✅',
              title: 'Smart Task Management',
              description: 'Create, organize, and prioritize tasks with our intuitive interface'
            },
            {
              icon: '📊',
              title: 'Visual Analytics',
              description: 'Track progress with beautiful charts and completion metrics'
            },
            {
              icon: '🔒',
              title: 'Bank-Level Security',
              description: 'Your data is protected with industry-standard encryption'
            },
            {
              icon: '🔄',
              title: 'Real-Time Sync',
              description: 'Access your tasks from any device, anywhere'
            },
            {
              icon: '🎯',
              title: 'Goal Tracking',
              description: 'Set and achieve milestones with progress tracking'
            },
            {
              icon: '🤖',
              title: 'AI Suggestions',
              description: 'Get smart recommendations to optimize your workflow'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎯 Call-to-Action */}
      <section className="bg-cyber-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your productivity?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who trust TaskFlow to manage their daily workflow.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-cyber-blue-600 hover:bg-gray-100 px-10 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Sign Up Free
          </button>
        </div>
      </section>

      {/* 👋 Footer */}
      <footer className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-cyber-blue-700">TaskFlow</span>
              <p className="text-gray-500 text-sm mt-1">
                The ultimate productivity companion
              </p>
            </div>
            <div className="flex gap-6">
              <button className="text-gray-600 hover:text-cyber-blue-600">Privacy</button>
              <button className="text-gray-600 hover:text-cyber-blue-600">Terms</button>
              <button className="text-gray-600 hover:text-cyber-blue-600">Contact</button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;