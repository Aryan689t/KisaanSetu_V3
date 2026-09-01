import React from 'react';
import { Wheat, ShieldAlert, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-agri-green-dark text-agri-ivory/80 text-xs border-t border-agri-green-dark/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-agri-green/30">
          
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center space-x-2 text-white font-heading font-bold text-base">
              <Wheat className="w-5 h-5 text-agri-gold" />
              <span>KisanSetu Platform</span>
            </div>
            <p className="text-agri-ivory/70 leading-relaxed max-w-md text-xs">
              Smart Crop Procurement & Queue Management System. Developed for the Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
            </p>
            <p className="text-[11px] text-agri-gold/90 font-medium">
              Tagline: &quot;From harvest to payment, without the waiting.&quot;
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2 uppercase text-[11px] tracking-wider text-agri-gold">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#centres" className="hover:text-white transition-colors">Sonipat Procurement Mandi</a></li>
              <li><a href="#centres" className="hover:text-white transition-colors">Karnal Grain Hub</a></li>
              <li><a href="#centres" className="hover:text-white transition-colors">Panipat Mandi Yard</a></li>
              <li><a href="#centres" className="hover:text-white transition-colors">Rohtak Procurement Hub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2 uppercase text-[11px] tracking-wider text-agri-gold">
              Helpdesk & Assistance
            </h4>
            <p className="text-xs text-white font-bold">Kisan Helpline: 1800-180-1551</p>
            <p className="text-[11px] text-agri-ivory/60 mt-1">Free 24x7 Queue & Procurement Support in Hindi & English</p>
            <div className="mt-3 flex items-center space-x-1 text-[11px] text-agri-gold hover:underline cursor-pointer">
              <ExternalLink className="w-3 h-3" />
              <span>Consumer Affairs Portal (doca.gov.in)</span>
            </div>
          </div>

        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-agri-ivory/50">
          <p>© 2026 KisanSetu Platform | Problem Statement 26032 | Hackathon Prototype</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-agri-gold" />
            <span>Built for Smart Automation in Public Food Procurement</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
