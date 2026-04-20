import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { user } = useAuth();
  
  if (!user) return null;

  let homePath = '/donor/dashboard';
  if (user.role === 'Receiver') homePath = '/recipient/nearby';
  if (user.role === 'Volunteer') homePath = '/volunteer/tasks';

  return (
    <div className="bottom-nav">
      <NavLink 
        to={homePath} 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Home size={24} />
        <span>HOME</span>
      </NavLink>
      
      <NavLink 
        to={user.role === 'Donor' ? '/donor/add-listing' : '#'} 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <List size={24} />
        <span>LISTINGS</span>
      </NavLink>
      
      <NavLink 
        to="/alerts" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Bell size={24} />
        <span>ALERTS</span>
      </NavLink>
    </div>
  );
}
