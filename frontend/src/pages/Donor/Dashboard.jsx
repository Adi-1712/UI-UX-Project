import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { Menu, LogOut, PlusCircle, ArrowRight } from 'lucide-react';

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/listings/donor/${user.id}`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error(err));
  }, [user.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-container bg-gradient-top min-h-[100vh]">
      <div className="header bg-transparent px-0 border-none">
        <button onClick={() => navigate('/profile')} className="text-gray-600 hover:text-gray-900 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">FoodBridge</span>
          <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Donor</span>
        </h1>
        <div className="w-6"></div> {/* Spacer to center the title */}
      </div>

      <div className="mt-4 mb-6">
        <p className="text-xs text-muted font-semibold uppercase tracking-wide">Welcome Back</p>
        <h2 className="text-3xl font-bold mb-2">Hello, {user.name.split(' ')[0]}!</h2>
        <p className="text-sm text-muted">Your contributions have helped feed 142 people this month. Ready to share more?</p>
      </div>

      <Link to="/donor/add-listing" className="btn-primary mb-8">
        <PlusCircle size={20} /> Add Food Listing
      </Link>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-primary">24</h3>
          <p className="text-xs text-muted uppercase font-semibold">Total Donations</p>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-primary">12kg</h3>
          <p className="text-xs text-muted uppercase font-semibold">Waste Saved</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Active Donations</h3>
        <Link to="#" className="text-xs text-primary font-semibold">View All</Link>
      </div>

      <div className="flex flex-col gap-3">
        {listings.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-sm text-muted mb-2">No active donations.</p>
            <Link to="/donor/add-listing" className="text-primary text-sm font-semibold">Create your first listing</Link>
          </div>
        ) : (
          listings.map(listing => (
            <div key={listing.id} className="card p-3 flex gap-4 items-center !mb-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1498837167922-41c46b66432b?w=150&h=150&fit=crop" alt="food" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm">{listing.food_name}</h4>
                  <span className={`status-badge status-${listing.status}`}>{listing.status}</span>
                </div>
                <p className="text-xs text-muted">{listing.quantity} • Expires in 24h</p>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
