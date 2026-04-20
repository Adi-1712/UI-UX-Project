import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { Menu, LogOut, MapPin, Package, Clock } from 'lucide-react';
import { apiUrl } from '../../lib/api';

export default function OpenTasks() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch(apiUrl('/api/listings/claimed'))
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const acceptTask = async (listingId) => {
    try {
      const response = await fetch(apiUrl('/api/tasks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_id: user.id, listing_id: listingId })
      });
      if (response.ok) {
        const data = await response.json();
        navigate(`/volunteer/confirmation`);
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
          <span className="text-green-600">FoodBridge</span>
          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Volunteer</span>
        </h1>
        <div className="w-6"></div>
      </div>

      <div className="mt-2 mb-6">
        <p className="text-xs text-green-600 font-bold uppercase tracking-wide">VOLUNTEER HUB</p>
        <h2 className="text-3xl font-bold mb-2">Open Tasks</h2>
        <p className="text-sm text-muted">Help bridge the gap. Select a delivery task near you and start making an impact today.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
          <div className="text-primary mb-1"><MapPin size={24} /></div>
          <h3 className="text-2xl font-bold text-gray-800">12.4</h3>
          <p className="text-[10px] text-muted uppercase font-bold text-center">MILES LOGGED</p>
        </div>
        <div className="flex-1 bg-green-500 text-white p-4 rounded-xl shadow-md flex flex-col justify-center items-center">
          <div className="mb-1"><Package size={24} /></div>
          <h3 className="text-2xl font-bold">08</h3>
          <p className="text-[10px] text-green-100 uppercase font-bold text-center">DELIVERIES DONE</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Nearby Deliveries</h3>
        <button className="text-xs text-green-600 font-bold">Filter ≡</button>
      </div>

      <div className="flex flex-col gap-4">
        {listings.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm">
            <p className="text-muted font-medium">No pending tasks nearby.</p>
          </div>
        ) : (
          listings.map(listing => (
            <div key={listing.id} className="card p-4 !mb-0 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide">Perishable</span>
                  <h4 className="font-bold text-lg mt-2 leading-tight">{listing.donor_name}</h4>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-gray-800">1.2</span>
                  <p className="text-[10px] text-muted font-bold uppercase">MILES</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex gap-3 text-sm">
                  <div className="w-5 flex justify-center text-green-500 mt-0.5"><MapPin size={16}/></div>
                  <div>
                    <p className="text-muted text-[10px] font-bold uppercase">PICKUP FROM</p>
                    <p className="font-bold text-gray-800">{listing.donor_name}</p>
                    <p className="text-xs text-gray-500">{listing.location || 'Donor Registered Location'}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="w-5 flex justify-center text-green-500 mt-0.5"><MapPin size={16}/></div>
                  <div>
                    <p className="text-muted text-[10px] font-bold uppercase">DELIVER TO</p>
                    <p className="font-bold text-gray-800">{listing.recipient_name}</p>
                    <p className="text-xs text-gray-500">Recipient Registered Location</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm mt-1 bg-green-50 p-2 rounded border border-green-100">
                  <div className="w-5 flex justify-center text-green-600 mt-0.5"><Package size={14}/></div>
                  <div>
                    <p className="font-semibold text-green-800 text-xs">Payload: {listing.food_name}</p>
                    <p className="text-[10px] text-green-600 uppercase font-bold">{listing.quantity}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <Clock size={14} className="text-muted"/>
                  EST. TIME: <span className="text-gray-800 text-sm">25 Mins</span>
                </div>
                <button onClick={() => acceptTask(listing.id)} className="bg-green-500 text-white font-bold py-2 px-6 rounded-full text-sm shadow-md hover:bg-green-600 transition-colors">
                  Accept Task
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 flex justify-center pb-6">
        <button className="bg-white border border-gray-200 text-muted font-semibold py-2 px-6 rounded-full text-sm shadow-sm">
          Load more tasks
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
