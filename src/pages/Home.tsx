import React from 'react';
import { motion } from 'motion/react';
import { School, UserCog, ShieldCheck, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';
import { 
  Facebook, 
  Users, 
  MessageCircle, 
  Mail, 
  Instagram, 
  Twitter 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../constants';

export default function Home() {
  const cards = [
    {
      title: "School & Cadet",
      desc: "Registrations, trainer requests, and department info for students and institutions.",
      icon: School,
      link: "/school-cadet",
      color: "bg-navy",
      accent: "border-ncc-light-blue"
    },
    {
      title: "CMTD Staff Login",
      desc: "Secure portal for CMTD staff to manage schedules, notices, and school lists.",
      icon: UserCog,
      link: "/staff-login",
      color: "bg-ncc-red",
      accent: "border-white"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-navy">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-ncc-red text-white text-xs font-bold rounded-full mb-6 tracking-widest uppercase shadow-lg">
              Official Department Portal
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tighter">
              WELCOME TO <span className="text-ncc-light-blue">CMTD</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-slate-300 mb-2">
              {APP_CONFIG.fullName}
            </p>
            <p className="text-lg text-ncc-light-blue font-mono tracking-widest uppercase">
              "{APP_CONFIG.tagline}"
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Zap className="w-4 h-4 text-ncc-red" /> Elite Training
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Zap className="w-4 h-4 text-ncc-red" /> Strategic Growth
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Zap className="w-4 h-4 text-ncc-red" /> Leadership Excellence
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Options Grid */}
      <section className="py-20 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1) }}
              >
                <Link to={card.link} className="group block h-full">
                  <div className={`h-full ${card.color} text-white p-8 rounded-2xl shadow-xl border-b-8 ${card.accent} transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col`}>
                    <div className="bg-white/10 p-4 rounded-xl w-fit mb-6">
                      <card.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                    <p className="text-slate-300 mb-8 flex-grow">{card.desc}</p>
                    <div className="flex items-center text-sm font-bold group-hover:gap-4 transition-all gap-2">
                      Enter Portal <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rank Hierarchy Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-navy mb-4 uppercase tracking-tighter">CMTD RANK STRUCTURE</h2>
            <div className="w-20 h-1 bg-ncc-red mx-auto mb-6"></div>
            <p className="text-slate-500 max-w-2xl mx-auto italic font-mono text-sm">Professional tier system for Cadet Management & Training Department</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cadet Level */}
            <div className="space-y-4">
              <div className="bg-navy text-white p-3 rounded-t-lg font-bold text-center text-xs uppercase tracking-widest border-b-4 border-ncc-light-blue shadow-lg">Cadet Level</div>
              <div className="bg-slate-50 border border-slate-200 rounded-b-lg divide-y divide-slate-200 overflow-hidden shadow-sm">
                {["CMTD Staff", "Drill Incharge", "Education Incharge", "Field Staff"].map(rank => (
                  <div key={rank} className="p-4 text-center font-bold text-slate-700 hover:bg-white transition-colors cursor-default text-sm">{rank}</div>
                ))}
              </div>
            </div>

            {/* Officer Level */}
            <div className="space-y-4">
              <div className="bg-navy text-white p-3 rounded-t-lg font-bold text-center text-xs uppercase tracking-widest border-b-4 border-ncc-red shadow-lg">Officer Level</div>
              <div className="bg-slate-50 border border-slate-200 rounded-b-lg divide-y divide-slate-200 overflow-hidden shadow-sm">
                {["Training Coordinator", "Assistant Training Officer", "Training Officer", "Team Leader"].map(rank => (
                  <div key={rank} className="p-4 text-center font-bold text-slate-700 hover:bg-white transition-colors cursor-default text-sm">{rank}</div>
                ))}
              </div>
            </div>

            {/* Senior Level */}
            <div className="space-y-4">
              <div className="bg-ncc-red text-white p-3 rounded-t-lg font-bold text-center text-xs uppercase tracking-widest border-b-4 border-navy shadow-lg">Senior Level</div>
              <div className="bg-slate-50 border border-slate-200 rounded-b-lg divide-y divide-slate-200 overflow-hidden shadow-sm">
                {["Group Leader", "Training Incharge", "Captain Trainer", "Director", "Senior Trainer"].map(rank => (
                  <div key={rank} className="p-4 text-center font-bold text-slate-700 hover:bg-white transition-colors cursor-default text-sm">{rank}</div>
                ))}
              </div>
            </div>

            {/* Top Command */}
            <div className="space-y-4">
              <div className="bg-navy-dark text-white p-3 rounded-t-lg font-bold text-center text-xs uppercase tracking-widest border-b-4 border-ncc-red shadow-lg">Top Command</div>
              <div className="bg-slate-50 border border-slate-200 rounded-b-lg divide-y divide-slate-200 overflow-hidden h-full shadow-sm">
                <div className="p-12 flex flex-col items-center justify-center h-full space-y-4">
                  <ShieldCheck className="w-12 h-12 text-ncc-red" />
                  <div className="px-6 py-3 bg-navy text-white rounded font-black tracking-tighter text-lg shadow-xl border border-white/20">MASTER TRAINER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Connection Section */}
      <section id="contact" className="py-20 bg-navy-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-ncc-red/5 skew-y-3 transform origin-right"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Connect With Our Network</h2>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Direct access to CMTD official communities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Facebook Group */}
            <a 
              href={APP_CONFIG.social.facebookGroup} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group flex items-center gap-6"
            >
              <div className="bg-navy p-4 rounded-xl group-hover:bg-ncc-light-blue transition-colors">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">Official Group</h4>
                <p className="text-ncc-light-blue text-xs font-bold uppercase tracking-widest mt-1">Join Community</p>
              </div>
            </a>

            {/* Facebook Page */}
            <a 
              href={APP_CONFIG.social.facebookPage} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group flex items-center gap-6"
            >
              <div className="bg-navy p-4 rounded-xl group-hover:bg-ncc-red transition-colors">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">Official Page</h4>
                <p className="text-ncc-red text-xs font-bold uppercase tracking-widest mt-1">Follow Updates</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a 
              href={APP_CONFIG.social.whatsapp} 
              target="_blank" 
              rel="noreferrer"
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group flex items-center gap-6"
            >
              <div className="bg-navy p-4 rounded-xl group-hover:bg-green-500 transition-colors">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">Direct Support</h4>
                <p className="text-green-500 text-xs font-bold uppercase tracking-widest mt-1">Message Now</p>
              </div>
            </a>
          </div>

          <div className="mt-12 flex justify-center gap-8 border-t border-white/5 pt-12">
            {[
              { icon: Mail, link: `mailto:${APP_CONFIG.social.gmail}`, color: "hover:text-ncc-red" },
              { icon: Instagram, link: "#", color: "hover:text-pink-500" },
              { icon: Twitter, link: "#", color: "hover:text-blue-400" }
            ].map((social, i) => (
              <a key={i} href={social.link} className={`text-slate-500 ${social.color} transition-colors`}>
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
