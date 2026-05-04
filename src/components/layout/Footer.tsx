import React from 'react';
import { Mail, Phone, Facebook, Instagram, Twitter, MessageCircle, Users } from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import { useConfig } from '../../hooks/useConfig';

export default function Footer() {
  const { config } = useConfig();

  return (
    <footer className="bg-navy-dark text-white border-t-8 border-ncc-red">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">CMTD</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {APP_CONFIG.fullName}. Dedicated to building discipline, leadership, and character in the youth of our nation.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 border-b-2 border-ncc-light-blue inline-block">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="/profile" className="hover:text-ncc-light-blue transition-colors">Department Profile</a></li>
              <li><a href="/work-plan" className="hover:text-ncc-light-blue transition-colors">Work Plan</a></li>
              <li><a href="/forms/registration" className="hover:text-ncc-light-blue transition-colors">School Registration</a></li>
              <li><a href="/staff-login" className="hover:text-ncc-light-blue transition-colors">Staff Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b-2 border-ncc-light-blue inline-block">Contact Us</h4>
            <div className="space-y-4">
              <a href={`mailto:${config.email}`} className="flex items-center gap-3 text-slate-300 hover:text-white group">
                <div className="p-2 bg-navy rounded-full group-hover:bg-ncc-red transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">{config.email}</span>
              </a>
              <a href={APP_CONFIG.social.whatsapp} className="flex items-center gap-3 text-slate-300 hover:text-white group">
                <div className="p-2 bg-navy rounded-full group-hover:bg-ncc-red transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-sm">{config.phoneNumber}</span>
              </a>
              <div className="flex gap-4 pt-4">
                <a href={APP_CONFIG.social.facebookPage} title="Facebook Page" className="p-2 bg-navy rounded-full hover:bg-ncc-red transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={APP_CONFIG.social.facebookGroup} title="Facebook Group" className="p-2 bg-navy rounded-full hover:bg-ncc-red transition-colors text-white">
                  <Users className="w-5 h-5" />
                </a>
                <a href={config.instagramUrl} className="p-2 bg-navy rounded-full hover:bg-ncc-red transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={config.twitterUrl} className="p-2 bg-navy rounded-full hover:bg-ncc-red transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CMTD - Cadet Management & Training Department. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
