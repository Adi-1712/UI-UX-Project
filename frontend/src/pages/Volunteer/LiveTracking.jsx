import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { Menu, ArrowLeft, CheckCircle2, Truck, Phone, Navigation } from 'lucide-react';
import { apiUrl } from '../../lib/api';

export default function LiveTracking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    // In a real app we'd fetch the specific task by taskId
    // Here we fetch volunteer's tasks and find this one
    fetch(apiUrl(`/api/tasks/volunteer/${user.id}`))
      .then(res => res.json())
      .then(data => {
        const currentTask = data.find(t => t.task_id.toString() === taskId);
        setTask(currentTask || data[0]); // fallback to first if not found
      })
      .catch(err => console.error(err));
  }, [user.id, taskId]);

  const updateStatus = async (newStatus) => {
    if (!task) return;
    try {
      await fetch(apiUrl(`/api/tasks/${task.task_id}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setTask({ ...task, task_status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="page-container bg-gray-50 min-h-[100vh]">
      <div className="header px-0 bg-transparent flex justify-between items-center mb-2">
        <button onClick={() => navigate('/volunteer/tasks')} className="text-main">
          <Menu size={24} className="text-muted" />
        </button>
        <h1 className="text-xl text-primary font-bold">FoodBridge</h1>
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="avatar" />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Live Tracking</h2>
        <div className="flex items-center gap-2">
          <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">ORDER #{task.task_id}</span>
          <span className="text-sm text-muted">Delivery to Shelter Haven</span>
        </div>
      </div>

      <div className="card p-0 overflow-hidden mb-6 relative shadow-md border-0">
        <div className="h-48 bg-gray-200 relative">
          {/* Static Map Mock */}
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop" alt="map" className="w-full h-full object-cover opacity-80" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mock Route Path */}
            <svg className="absolute w-full h-full" style={{zIndex: 1}}>
               <path d="M 100,100 Q 200,50 300,150 T 400,100" stroke="#EF4444" strokeWidth="4" fill="transparent" strokeDasharray="5,5" />
            </svg>
            <div className="absolute bg-white p-2 rounded-lg shadow-lg font-bold text-primary flex items-center gap-1 z-10 top-4 right-4">
              <Navigation size={14} /> 12 mins
            </div>
            
            <div className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white z-10" style={{top: '100px', left: '100px'}}></div>
            <div className="absolute w-5 h-5 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center text-white z-10 shadow-lg" style={{top: '100px', left: '400px'}}>
              <MapPin size={12}/>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="donor" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{task.donor_name}</h4>
              <p className="text-[10px] text-muted font-bold tracking-wide uppercase flex items-center gap-1">
                ⭐ 4.9 <span className="w-1 h-1 bg-gray-300 rounded-full"></span> Volunteer
              </p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-primary shadow-sm hover:bg-red-50">
            <Phone size={18} />
          </button>
        </div>
      </div>

      <div className="card p-5 mb-6 shadow-sm border border-gray-100">
        <div className="flex justify-between relative mb-6">
          <div className="absolute top-4 left-6 right-6 h-1 bg-gray-100 z-0"></div>
          <div className={`absolute top-4 left-6 h-1 bg-teal-500 z-0 transition-all duration-500`} style={{width: task.task_status === 'assigned' ? '0%' : task.task_status === 'picked_up' ? '50%' : '100%'}}></div>
          
          <div className="flex flex-col items-center z-10 relative">
            <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-md border-2 border-white mb-2">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Confirmed</span>
          </div>
          
          <div className="flex flex-col items-center z-10 relative">
            <div className={`w-8 h-8 rounded-full ${task.task_status === 'picked_up' || task.task_status === 'delivered' ? 'bg-teal-500 text-white' : 'bg-white text-gray-400'} flex items-center justify-center shadow-sm border-2 ${task.task_status === 'picked_up' || task.task_status === 'delivered' ? 'border-white' : 'border-gray-200'} mb-2 transition-colors duration-500`}>
              <Truck size={16} />
            </div>
            <span className={`text-[10px] font-bold ${task.task_status === 'picked_up' || task.task_status === 'delivered' ? 'text-gray-800' : 'text-gray-400'} uppercase tracking-wide`}>Picked Up</span>
          </div>
          
          <div className="flex flex-col items-center z-10 relative">
            <div className={`w-8 h-8 rounded-full ${task.task_status === 'delivered' ? 'bg-teal-500 text-white' : 'bg-white text-gray-400'} flex items-center justify-center shadow-sm border-2 ${task.task_status === 'delivered' ? 'border-white' : 'border-gray-200'} mb-2 transition-colors duration-500`}>
              <MapPin size={16} />
            </div>
            <span className={`text-[10px] font-bold ${task.task_status === 'delivered' ? 'text-gray-800' : 'text-gray-400'} uppercase tracking-wide`}>Delivered</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
          <div className="flex gap-3 mb-3 relative">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 z-10"></div>
            <div className="absolute top-3 left-1 bottom-0 w-[1px] bg-gray-300"></div>
            <div>
              <p className="font-bold text-gray-800">On the way to destination</p>
              <p className="text-xs text-muted">2:45 PM • Mission District</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0 z-10"></div>
            <div>
              <p className="font-semibold text-gray-500">Package picked up</p>
              <p className="text-xs text-muted">2:30 PM • Bakery Hub</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => updateStatus('picked_up')} 
          disabled={task.task_status !== 'assigned'}
          className="flex-1 bg-white border border-gray-200 text-gray-800 font-bold py-3 rounded-full text-sm shadow-sm disabled:opacity-50"
        >
          Mark as Picked Up
        </button>
        <button 
          onClick={() => updateStatus('delivered')}
          disabled={task.task_status !== 'picked_up'}
          className="flex-1 bg-primary text-white font-bold py-3 rounded-full text-sm shadow-md shadow-red-200 disabled:opacity-50"
        >
          Confirm Delivery
        </button>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-3">Package Contents</h3>
        <div className="card p-3 flex gap-4 items-center !mb-0 shadow-sm border-gray-100">
          <div className="w-16 h-16 bg-orange-50 rounded-lg shrink-0 flex items-center justify-center text-3xl">
            🍞
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-sm leading-tight">{task.food_name}</h4>
              <span className="bg-teal-50 text-teal-600 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Fresh</span>
            </div>
            <p className="text-xs text-muted font-medium">{task.quantity} • High Perishability</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
