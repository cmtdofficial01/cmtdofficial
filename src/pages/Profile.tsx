import React from 'react';
import { motion } from 'motion/react';
import { Shield, Medal, Star, Users } from 'lucide-react';
import { DEPARTMENT_PROFILE } from '../constants';

export default function Profile() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <section className="bg-navy py-16 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Department Profile</h1>
        <div className="w-24 h-1 bg-ncc-red mx-auto"></div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-2xl p-8 md:p-12 border-t-8 border-ncc-red"
        >
          <div className="flex justify-center mb-10">
            <div className="p-4 bg-navy text-white rounded-full">
              <Shield className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
            {DEPARTMENT_PROFILE.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-slate-100">
            <div className="text-center">
              <div className="inline-flex p-3 bg-ncc-light-blue/20 rounded-lg text-navy mb-4">
                <Medal className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Excellence</h4>
              <p className="text-sm text-slate-500">Highest standards of physical and mental training.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-ncc-red/10 rounded-lg text-ncc-red mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Discipline</h4>
              <p className="text-sm text-slate-500">Punctuality, order and professional ethics.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-navy/10 rounded-lg text-navy mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Leadership</h4>
              <p className="text-sm text-slate-500">Empowering youth to lead with vision and courage.</p>
            </div>
          </div>
        </motion.div>

        {/* Rank Hierarchy List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
        >
          <div className="bg-navy p-4 text-white text-center font-bold uppercase tracking-widest text-sm">
            Official CMTD Rank Hierarchy
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h5 className="font-bold text-ncc-red border-b border-ncc-red/30 mb-4 pb-2 text-xs uppercase tracking-widest">Cadet Level</h5>
                <ul className="space-y-2 text-sm text-slate-600 font-medium italic">
                  {["CMTD Staff", "Drill Incharge", "Education Incharge", "Field Staff"].map(r => <li key={r}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-navy border-b border-navy/30 mb-4 pb-2 text-xs uppercase tracking-widest">Officer Level</h5>
                <ul className="space-y-2 text-sm text-slate-600 font-medium italic">
                  {["Training Coordinator", "Assistant Training Officer", "Training Officer", "Team Leader"].map(r => <li key={r}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-ncc-red border-b border-ncc-red/30 mb-4 pb-2 text-xs uppercase tracking-widest">Senior Level</h5>
                <ul className="space-y-2 text-sm text-slate-600 font-medium italic">
                  {["Group Leader", "Training Incharge", "Captain Trainer", "Director", "Senior Trainer"].map(r => <li key={r}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-navy border-b border-navy/30 mb-4 pb-2 text-xs uppercase tracking-widest">Command Level</h5>
                <ul className="space-y-2 text-sm text-navy font-bold italic">
                  <li>Master Trainer</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
