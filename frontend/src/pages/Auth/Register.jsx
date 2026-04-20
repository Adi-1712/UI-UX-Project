import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Utensils, HeartHandshake, Truck } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'Donor'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      if (user.role === 'Donor') navigate('/donor/dashboard');
      if (user.role === 'Receiver') navigate('/recipient/nearby');
      if (user.role === 'Volunteer') navigate('/volunteer/tasks');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="page-container bg-white min-h-[100vh]">
      <div className="header border-b-0 px-0 pb-2">
        <h1 className="text-xl"><Utensils size={24} className="text-primary"/> FoodBridge</h1>
        <Link to="/login" className="text-muted">✕</Link>
      </div>

      <div className="mt-4 mb-6">
        <h2 className="text-2xl font-bold mb-2">Create your impact account.</h2>
        <p className="text-sm text-muted">Join a community of 5,000+ neighbors fighting food waste together.</p>
      </div>

      {error && <div className="text-primary text-sm mb-4 bg-red-50 p-2 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" placeholder="+1 (555) 000-0000" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Create Password</label>
          <input type="password" name="password" placeholder="********" onChange={handleChange} required />
        </div>

        <div className="mt-6 mb-4">
          <label className="text-sm font-semibold mb-3 block">Choose your role</label>
          
          <div 
            className={`card p-3 mb-2 flex items-center gap-4 cursor-pointer transition-all ${formData.role === 'Donor' ? 'border-primary bg-red-50' : ''}`}
            onClick={() => handleRoleSelect('Donor')}
          >
            <div className="w-10 h-10 rounded-full bg-red-100 text-primary flex items-center justify-center shrink-0">
              <Utensils size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Donor</h3>
              <p className="text-xs text-muted">I have surplus food to share</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${formData.role === 'Donor' ? 'border-primary bg-primary' : 'border-gray-300'}`}></div>
          </div>

          <div 
            className={`card p-3 mb-2 flex items-center gap-4 cursor-pointer transition-all ${formData.role === 'Receiver' ? 'border-primary bg-blue-50' : ''}`}
            onClick={() => handleRoleSelect('Receiver')}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
              <HeartHandshake size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Receiver</h3>
              <p className="text-xs text-muted">I am looking for food support</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${formData.role === 'Receiver' ? 'border-primary bg-primary' : 'border-gray-300'}`}></div>
          </div>

          <div 
            className={`card p-3 mb-2 flex items-center gap-4 cursor-pointer transition-all ${formData.role === 'Volunteer' ? 'border-primary bg-green-50' : ''}`}
            onClick={() => handleRoleSelect('Volunteer')}
          >
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Volunteer</h3>
              <p className="text-xs text-muted">I want to help with delivery</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${formData.role === 'Volunteer' ? 'border-primary bg-primary' : 'border-gray-300'}`}></div>
          </div>
        </div>

        <button type="submit" className="btn-primary mt-2">Create Account</button>
      </form>
      
      <p className="text-xs text-center text-muted mt-4">
        By joining, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </p>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted mb-2 uppercase tracking-wide">Already have an account?</p>
        <Link to="/login" className="btn-secondary block text-center">Sign In</Link>
      </div>
    </div>
  );
}
