import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { Menu, LogOut, MapPin, Clock } from 'lucide-react';
import { apiUrl } from '../../lib/api';

export default function NearbyHelp() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch(apiUrl('/api/listings'))
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClaim = async (listingId) => {
    try {
      const response = await fetch(apiUrl(`/api/listings/${listingId}/claim`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_id: user.id })
      });
      if (response.ok) {
        // Remove the claimed listing from the feed
        setListings(listings.filter(l => l.id !== listingId));
        alert('Delivery accepted! A volunteer will be assigned shortly.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container bg-gray-50 min-h-[100vh]">
      <div className="header px-0 bg-transparent border-none">
        <button onClick={() => navigate('/profile')} className="text-gray-600 hover:text-gray-900 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-500">FoodBridge</span>
          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Receiver</span>
        </h1>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="mt-2 mb-4">
        <h2 className="text-3xl font-bold mb-1">Nearby Help</h2>
        <p className="text-sm text-muted">Fresh surplus available for collection in your neighborhood.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setFilter('All')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-muted'}`}
        >
          All Listings
        </button>
        <button 
          onClick={() => setFilter('Produce')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${filter === 'Produce' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-muted'}`}
        >
          Produce
        </button>
        <button 
          onClick={() => setFilter('Bakery')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${filter === 'Bakery' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-muted'}`}
        >
          Bakery
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {listings.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm">
            <p className="text-muted font-medium">No fresh surplus available right now.</p>
            <p className="text-xs text-muted mt-2">Check back later or change your filters.</p>
          </div>
        ) : (
          listings.map(listing => (
            <div key={listing.id} className="card p-0 overflow-hidden flex flex-col !mb-0 border-none">
              <div className="h-40 bg-gray-200 relative">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=200&fit=crop" alt="food" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  AVAILABLE NOW
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{listing.food_name}</h3>
                  <div className="text-right">
                    <span className="text-blue-500 font-bold text-sm">{listing.quantity}</span>
                  </div>
                </div>
                <p className="text-xs text-muted mb-4">{listing.donor_name}</p>
                <div className="flex justify-between items-center text-xs font-semibold text-muted border-t border-gray-100 pt-3 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-blue-500"/> 1.2 miles
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-blue-500"/> Ends {listing.expiry_time ? new Date(listing.expiry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'soon'}
                  </div>
                </div>
                <button onClick={() => handleClaim(listing.id)} className="w-full bg-blue-500 text-white font-bold py-2.5 rounded-full text-sm shadow-md hover:bg-blue-600 transition-colors">
                  Accept Delivery
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
