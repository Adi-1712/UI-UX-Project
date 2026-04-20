import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  let themeColor = 'text-primary';
  let bgColor = 'bg-red-50';
  if (user.role === 'Receiver') {
    themeColor = 'text-blue-500';
    bgColor = 'bg-blue-50';
  } else if (user.role === 'Volunteer') {
    themeColor = 'text-green-500';
    bgColor = 'bg-green-50';
  }

  return (
    <div className="page-container bg-gray-50 min-h-[100vh]">
      <div className="header bg-transparent px-0 mb-4 border-none">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-white shadow-md border-4 border-white overflow-hidden mb-4 relative">
          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=150`} alt="profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
        <span className={`mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bgColor} ${themeColor}`}>
          {user.role}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full ${bgColor} ${themeColor} flex items-center justify-center shrink-0`}>
            <Mail size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</p>
            <p className="font-medium text-gray-800 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full ${bgColor} ${themeColor} flex items-center justify-center shrink-0`}>
            <Phone size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</p>
            <p className="font-medium text-gray-800 text-sm">{user.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full ${bgColor} ${themeColor} flex items-center justify-center shrink-0`}>
            <ShieldCheck size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Account Status</p>
            <p className="font-medium text-gray-800 text-sm flex items-center gap-2">
              Verified <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left border-b border-gray-50">
          <span className="font-medium text-gray-700 text-sm">Account Settings</span>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
          <span className="font-medium text-gray-700 text-sm">Privacy & Security</span>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} /> Log Out
      </button>

      <BottomNav />
    </div>
  );
}
