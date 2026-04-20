import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Utensils, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'Donor') navigate('/donor/dashboard');
      if (user.role === 'Receiver') navigate('/recipient/nearby');
      if (user.role === 'Volunteer') navigate('/volunteer/tasks');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="page-container bg-gradient-top flex flex-col items-center justify-center min-h-[100vh] px-4 py-8">
      
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        
        <div className="text-center mb-12 w-full">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4 shadow-sm text-primary">
            <Utensils size={36} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight mb-2">FoodBridge</h1>
          <p className="text-sm text-muted">Bridging the gap between surplus and need.</p>
        </div>

        <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>

          {error && <div className="text-primary text-xs mb-6 text-center bg-red-50 p-3 rounded-lg font-medium border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className={`w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-red-50 transition-all text-sm outline-none`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:text-primary-hover">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className={`w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-red-50 transition-all text-sm outline-none`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-4 py-3.5 text-lg shadow-md hover:shadow-lg transition-all rounded-xl">
              Login
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="font-bold text-primary hover:text-primary-hover ml-1 underline decoration-2 underline-offset-4">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
