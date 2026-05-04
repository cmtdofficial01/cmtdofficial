import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, FileText, ClipboardList, Briefcase, GraduationCap, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SchoolCadet() {
  const actions = [
    {
      title: "School Registration",
      subtitle: "For schools without NCC units",
      icon: ClipboardList,
      link: "/forms/school-reg",
      color: "border-navy",
      iconColor: "text-navy"
    },
    {
      title: "Trainer Request",
      subtitle: "Request professional trainers",
      icon: Shield,
      link: "/forms/trainer-req",
      color: "border-ncc-red",
      iconColor: "text-ncc-red"
    },
    {
      title: "Staff Job Application",
      subtitle: "Join our training department",
      icon: Briefcase,
      link: "/forms/staff-app",
      color: "border-navy",
      iconColor: "text-navy"
    },
    {
      title: "Defence Training",
      subtitle: "Join military prep courses",
      icon: GraduationCap,
      link: "/forms/defence-reg",
      color: "border-ncc-red",
      iconColor: "text-ncc-red"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-navy py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">School & Cadet Panel</h1>
            <p className="text-ncc-light-blue font-medium">Resources and Registrations for Educational Institutions and Cadets</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profile" className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-md flex items-center gap-2 transition-colors">
              <BookOpen className="w-4 h-4" /> Profile
            </Link>
            <Link to="/work-plan" className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-md flex items-center gap-2 transition-colors">
              <FileText className="w-4 h-4" /> Work Plan
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {actions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={action.link} className={`group block h-full bg-white p-8 rounded-xl shadow-lg border-b-8 ${action.color} transition-all hover:-translate-y-2`}>
                <div className={`mb-6 ${action.iconColor}`}>
                  <action.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-500 text-sm mb-8">{action.subtitle}</p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-navy group-hover:gap-3 transition-all gap-1">
                  Open Form <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-navy rounded-2xl p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">Need Assistance?</h3>
              <p className="text-slate-300 mb-8 max-w-md">Our department staff are ready to help with any registration or training inquiries.</p>
              <div className="flex flex-wrap gap-4">
                <a href="tel:+919242486642" className="px-8 py-3 bg-ncc-red hover:bg-red-700 rounded-lg font-bold transition-colors">Call Help Desk</a>
                <a href="/profile" className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-bold transition-colors">Learn More</a>
              </div>
            </div>
            <Shield className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 text-white/5" />
          </div>
          
          <div className="bg-white rounded-2xl p-10 border border-slate-200 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-navy mb-4">Latest Notices</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border-l-4 border-ncc-red rounded-r-lg">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">New Update • May 2026</p>
                <p className="text-slate-700 font-medium">Summer camp registrations are now open for all NCC wings.</p>
              </div>
              <div className="p-4 bg-slate-50 border-l-4 border-navy rounded-r-lg">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Alert • May 2026</p>
                <p className="text-slate-700 font-medium">Trainer request processing time reduced to 48 hours for university institutions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
