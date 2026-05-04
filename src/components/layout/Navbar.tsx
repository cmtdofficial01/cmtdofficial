import React from 'react';
import { motion } from 'motion/react';
import { Shield, Menu, X, Phone, Mail, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../constants';
import { useConfig } from '../../hooks/useConfig';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useConfig();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setClickCount(0);
      navigate('/admin-login');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'Work Plan', path: '/work-plan' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 shadow-xl border-b-4 border-ncc-red">
      <div className="bg-navy-dark border-b border-white/5 py-2 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
          <div className="flex items-center space-x-6">
            <a href={`tel:${config.phoneNumber}`} className="flex items-center space-x-2 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-ncc-light-blue" />
              <span>{config.phoneNumber}</span>
            </a>
            <a href={`mailto:${config.email}`} className="flex items-center space-x-2 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-ncc-light-blue" />
              <span>{config.email}</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-ncc-red animate-pulse">Official Node Alpha-01</span>
             <span className="text-white/20">|</span>
             <span>HQ SEC-07</span>
          </div>
        </div>
      </div>
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 group cursor-pointer select-none"
          >
            <div className="p-2 bg-white rounded-full transition-transform group-hover:scale-110">
              <Shield className="w-8 h-8 text-navy" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter leading-none">CMTD</h1>
              <p className="text-[10px] uppercase font-semibold text-ncc-light-blue tracking-widest">{APP_CONFIG.name}</p>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors hover:text-ncc-light-blue ${
                    location.pathname === link.path ? 'text-ncc-light-blue underline underline-offset-8 decoration-2' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a href={APP_CONFIG.social.whatsapp} target="_blank" rel="noreferrer" className="bg-ncc-red hover:bg-red-700 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 animate-pulse">
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-ncc-light-blue focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-navy-dark"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-navy"
            >
              {link.name}
            </Link>
          ))}
          <a href={APP_CONFIG.social.whatsapp} className="block px-3 py-2 rounded-md text-base font-bold bg-ncc-red">
            WhatsApp Contact
          </a>
        </div>
      </motion.div>
      </div>
    </nav>
  );
}
