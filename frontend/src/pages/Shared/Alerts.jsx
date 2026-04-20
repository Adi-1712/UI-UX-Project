import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Bell, Utensils, CheckCircle2, Truck } from 'lucide-react';

export default function Alerts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="page-container bg-gray-50 min-h-[100vh]">
      <div className="header bg-transparent px-0 mb-4 border-none flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
          <ArrowLeft size={24} />
          <h1 className="text-xl font-bold text-gray-800 m-0">Alerts</h1>
        </button>
        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center relative overflow-hidden border border-gray-200 cursor-pointer" onClick={() => navigate('/profile')}>
           <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted">Stay updated with real-time redistribution status and local tasks.</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Updates</p>
        <button className="text-[10px] font-bold text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {/* Mock Alerts based on role */}
        {user.role === 'Receiver' || user.role === 'Volunteer' ? (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-primary flex items-center justify-center shrink-0">
              <Utensils size={18} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-gray-800">New food available</h4>
                <span className="text-[10px] text-gray-400 font-medium">10m ago</span>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-3">
                Artisan Bakery has listed 12 surplus sourdough loaves for pickup at Sector 4.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full">View Details</button>
              </div>
            </div>
          </div>
        ) : null}

        {user.role === 'Volunteer' ? (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Truck size={18} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-gray-800">Task Assigned</h4>
                <span className="text-[10px] text-gray-400 font-medium">20m ago</span>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-2">
                You have been assigned to collect surplus from "Green Grocer Market".
              </p>
              <p className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 3.2 miles away
              </p>
            </div>
          </div>
        ) : null}

        {user.role === 'Donor' ? (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-gray-800">Donation Accepted</h4>
                <span className="text-[10px] text-gray-400 font-medium">1h ago</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Volunteer Alex M. has accepted to deliver your "Fresh Artisan Breads" listing.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earlier Today</p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 opacity-75">
          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0">
            <Truck size={18} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-sm text-gray-800">Delivery Updates</h4>
              <span className="text-[10px] text-gray-400 font-medium">4h ago</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Success! 40kg of surplus produce successfully delivered to Sunshine Community Center.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
