import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/auth/login`, formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      window.dispatchEvent(new Event("userChanged"));
      toast.success('Welcome back! Redirecting...', {
        duration: 2000,
        icon: '👋'
      });
      
      // Redirect after a short delay
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         (err.response?.status === 401 ? 
                          'Invalid credentials' : 'Login failed');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyber-blue-50 to-cyber-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-cyber-blue-600 py-6 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-cyber-blue-100 mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyber-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyber-blue-500 focus:border-transparent"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyber-blue-600 hover:bg-cyber-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-blue-500 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-cyber-blue-600 hover:text-cyber-blue-700"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;