import React from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../constants';

export default function AdminLogin() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === APP_CONFIG.admin.password) {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin-dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-ncc-red">
          <div className="bg-navy p-8 text-center text-white">
            <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
              <ShieldAlert className="w-10 h-10 text-ncc-red" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-widest leading-tight italic">Mission Admin</h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-tighter">Command Authentication Required</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Master Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-navy transition-all`}
                    placeholder="••••••••••••"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-2 font-bold animate-pulse uppercase">Invalid Command Code</p>}
              </div>

              <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 group italic font-bold">
                INITIATE COMMAND <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-[10px] mt-8 uppercase tracking-[0.3em] font-bold">
          Controlled Access • CMTD Official Node
        </p>
      </motion.div>
    </div>
  );
}
