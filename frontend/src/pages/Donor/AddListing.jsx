import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Camera, MapPin, Clock, Calendar } from 'lucide-react';

export default function AddListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    food_name: '',
    quantity: '',
    pickup_time: '',
    expiry_time: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, donor_id: user.id })
      });
      if (response.ok) {
        navigate('/donor/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container bg-white min-h-[100vh]">
      <div className="header px-0 py-4 border-b-0">
        <button onClick={() => navigate(-1)} className="text-main">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl mx-auto">Share Abundance</h1>
        <div className="w-6 h-6 rounded-full bg-gray-200"></div> {/* Avatar placeholder */}
      </div>

      <div className="mb-6 text-center">
        <p className="text-sm text-muted">Help reduce waste by listing surplus food for your community.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Food name</label>
          <input type="text" name="food_name" placeholder="e.g. Fresh Artisan Sourdough" onChange={handleChange} required />
        </div>

        <div className="flex gap-4 mb-4">
          <div className="input-group flex-1 !mb-0">
            <label>Quantity</label>
            <input type="text" name="quantity" placeholder="5 loaves" onChange={handleChange} required />
          </div>
          <div className="input-group flex-1 !mb-0">
            <label>Pickup time</label>
            <input type="text" name="pickup_time" placeholder="Before 6 PM" onChange={handleChange} required />
          </div>
        </div>

        <div className="input-group">
          <label>Expiry time</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 text-muted" size={18} />
            <input type="datetime-local" name="expiry_time" className="w-full pl-10" onChange={handleChange} required />
          </div>
        </div>

        <div className="input-group">
          <label>Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-muted" size={18} />
            <input type="text" name="location" placeholder="Street Address, City" className="w-full pl-10" onChange={handleChange} required />
          </div>
        </div>

        <div className="mt-6 mb-8 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-muted">
          <Camera size={32} className="mb-2 text-primary" />
          <p className="text-sm font-medium">Add a photo of the food</p>
        </div>

        <button type="submit" className="btn-primary">Post Food Listing →</button>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg flex gap-3 text-blue-800 text-xs items-start">
        <div className="w-4 h-4 shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">i</div>
        <p>By posting, you confirm that the food is safe for consumption and follows our community health guidelines. Thank you for making a difference.</p>
      </div>
    </div>
  );
}
