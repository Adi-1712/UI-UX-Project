import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Role Dashboards
import DonorDashboard from './pages/Donor/Dashboard';
import AddListing from './pages/Donor/AddListing';
import NearbyHelp from './pages/Recipient/NearbyHelp';
import OpenTasks from './pages/Volunteer/OpenTasks';
import LiveTracking from './pages/Volunteer/LiveTracking';
import TaskConfirmation from './pages/Volunteer/TaskConfirmation';

// Shared Pages
import Profile from './pages/Shared/Profile';
import Alerts from './pages/Shared/Alerts';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access wrong role page
    if (user.role === 'Donor') return <Navigate to="/donor/dashboard" />;
    if (user.role === 'Receiver') return <Navigate to="/recipient/nearby" />;
    if (user.role === 'Volunteer') return <Navigate to="/volunteer/tasks" />;
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/donor/dashboard" element={
            <ProtectedRoute allowedRoles={['Donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/donor/add-listing" element={
            <ProtectedRoute allowedRoles={['Donor']}>
              <AddListing />
            </ProtectedRoute>
          } />
          
          <Route path="/recipient/nearby" element={
            <ProtectedRoute allowedRoles={['Receiver']}>
              <NearbyHelp />
            </ProtectedRoute>
          } />
          
          <Route path="/volunteer/tasks" element={
            <ProtectedRoute allowedRoles={['Volunteer']}>
              <OpenTasks />
            </ProtectedRoute>
          } />
          <Route path="/volunteer/tracking/:taskId" element={
            <ProtectedRoute allowedRoles={['Volunteer']}>
              <LiveTracking />
            </ProtectedRoute>
          } />
          <Route path="/volunteer/confirmation" element={
            <ProtectedRoute allowedRoles={['Volunteer']}>
              <TaskConfirmation />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/alerts" element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
