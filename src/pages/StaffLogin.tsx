import React from 'react';
import { motion } from 'motion/react';
import { User, Key, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firebaseService } from '../services/firebaseService';

export default function StaffLogin() {
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const staff = await firebaseService.loginStaff(userId, password);
      if (staff) {
        localStorage.setItem('staff_auth', 'true');
        localStorage.setItem('staff_id', staff.userId);
        localStorage.setItem('staff_name', staff.name);
        navigate('/staff-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-navy p-8 text-center text-white">
          <div className="inline-flex p-3 bg-ncc-light-blue/20 rounded-full mb-4">
            <UserCheck className="w-10 h-10 text-ncc-light-blue" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Staff Portal</h2>
          <p className="text-slate-400 text-sm">Cadet Management & Training Department</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-xs text-red-700 font-bold uppercase">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Staff User ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-navy transition-all"
                placeholder="CMTD-XXXX"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-navy transition-all"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 group shadow-xl"
          >
            {loading ? 'Authenticating...' : 'Secure Login'} 
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="px-8 pb-8 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Contact Admin if you have forgotten your credentials
          </p>
        </div>
      </div>
    </div>
  );
}
