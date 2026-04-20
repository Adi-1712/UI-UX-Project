import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function TaskConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="page-container bg-white min-h-[100vh] flex flex-col items-center justify-center text-center">
      <div className="header px-0 py-4 border-b-0 absolute top-0 w-full flex items-center justify-start px-4">
        <button onClick={() => navigate('/volunteer/tasks')} className="text-main">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm mt-16">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle size={48} />
        </div>
        
        <h2 className="text-3xl font-bold mb-3 text-gray-800">Task Completed!</h2>
        <p className="text-muted mb-8">
          Thank you for stepping up. Your contribution makes a real difference in fighting food waste and helping the community.
        </p>

        <button 
          onClick={() => navigate('/volunteer/tasks')} 
          className="btn-primary w-full"
        >
          Find More Tasks
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
