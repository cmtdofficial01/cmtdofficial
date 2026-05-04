import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { WORK_PLAN } from '../constants';

export default function WorkPlan() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <section className="bg-navy py-16 text-white text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight uppercase">CMTD Work Plan</h1>
        <p className="text-ncc-light-blue font-medium">Strategic Roadmap for Cadet Training</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="space-y-6">
          {WORK_PLAN.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md border-l-8 border-ncc-red flex items-start gap-6 group hover:shadow-lg transition-shadow"
            >
              <div className="bg-slate-100 p-3 rounded-md text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-slate-600 italic mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-ncc-red uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Priority Training Module
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-navy rounded-xl text-white">
          <h4 className="text-2xl font-bold mb-4 border-b border-white/20 pb-4">Training Objectives</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ncc-red rounded-full"></div>
              Develop Character and Discipline
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ncc-red rounded-full"></div>
              Create a Force of Skilled Citizens
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ncc-red rounded-full"></div>
              Leadership Excellence
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ncc-red rounded-full"></div>
              National Integration
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
