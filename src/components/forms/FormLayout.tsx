import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FormLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isSuccess: boolean;
}

export default function FormLayout({ title, subtitle, children, onSubmit, isLoading, isSuccess }: FormLayoutProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/school-cadet" className="inline-flex items-center gap-2 text-navy hover:text-ncc-red font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-navy p-8 text-white">
            <h1 className="text-3xl font-bold uppercase tracking-tight">{title}</h1>
            <p className="text-ncc-light-blue font-medium mt-2">{subtitle}</p>
          </div>
          
          <div className="p-8">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-6">
                  <CheckCircle className="w-16 h-16" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful</h2>
                <p className="text-gray-500 mb-8">Your information has been securely transmitted to CMTD. We will contact you soon.</p>
                <Link to="/school-cadet" className="btn-primary inline-block">Return to Panel</Link>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  {children}
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InputField({ label, name, type = "text", required = true, placeholder = "", options = [] }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-bold text-slate-700 uppercase tracking-wide">
        {label} {required && <span className="text-ncc-red">*</span>}
      </label>
      {type === "select" ? (
        <select 
          id={name} 
          name={name}
          required={required}
          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-navy focus:border-navy block w-full p-2.5 transition-all"
        >
          <option value="">Select Option</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          required={required}
          placeholder={placeholder}
          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-navy focus:border-navy block w-full p-2.5 transition-all"
        />
      )}
    </div>
  );
}
