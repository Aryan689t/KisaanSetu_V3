import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { UserPlus, Mail, Key, Lock, ArrowRight, ArrowLeft, Building2, Ticket } from 'lucide-react';

export const WalkInDeskAuth = ({ onBack }) => {
  const { loginWithRole, lang } = useDemo();
  const isHindi = lang === 'hi';

  const [operatorEmail, setOperatorEmail] = useState('desk.operator@kisansetu.gov.in');
  const [deskStaffId, setDeskStaffId] = useState('APMC-DESK-01');
  const [gatePin, setGatePin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithRole('walkin', operatorEmail, {
      fullName: 'Suresh Patel',
      district: 'Sonipat Main Yard • Gate 1 Desk'
    });
  };

  const handleQuickDemo = () => {
    loginWithRole('walkin', 'desk.operator@kisansetu.gov.in', {
      fullName: 'Suresh Patel',
      district: 'Sonipat Main Yard • Gate 1 Desk'
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col justify-between font-sans selection:bg-agri-gold/30">
      
      {/* Header */}
      <header className="bg-[#1b432a] text-white py-4 px-4 sm:px-8 border-b border-agri-green-dark shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors mr-1 cursor-pointer"
                title="Back to Landing Page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold shadow-sm">
              <UserPlus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                KisanSetu • Walk-In & Assisted Desk Portal
              </span>
              <span className="text-[10px] text-agri-gold">
                APMC Mandi Gate Entry & Spot Token Registration Desk
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-8 flex-1 w-full flex flex-col justify-center space-y-6 animate-in fade-in duration-300">
        
        {/* Portal Title Banner */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm border border-amber-200">
            <Ticket className="w-8 h-8 text-amber-800" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-agri-text">
            {isHindi ? 'वॉक-इन डेस्क ऑपरेटर लॉगिन' : 'Walk-In Desk Operator Login'}
          </h1>
          <p className="text-xs text-agri-text-muted">
            {isHindi
              ? 'गेट पर बिना स्मार्टफोन वाले किसानों का ऑन-स्पॉट टोकन व कतार पंजीकरण'
              : 'Assisted gate check-in & on-spot token generation for farmers without smartphones'}
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-agri-gold/50 shadow-xl space-y-5">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Operator Email */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Desk Operator Email / Staff ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="email"
                  required
                  value={operatorEmail}
                  onChange={(e) => setOperatorEmail(e.target.value)}
                  placeholder="desk.sonipat@kisansetu.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green outline-none font-medium"
                />
              </div>
            </div>

            {/* Desk Staff Code */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Assisted Desk Station Code
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="text"
                  required
                  value={deskStaffId}
                  onChange={(e) => setDeskStaffId(e.target.value)}
                  placeholder="APMC-DESK-01"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green outline-none font-mono font-bold uppercase"
                />
              </div>
            </div>

            {/* Passcode */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Gate Security PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="password"
                  required
                  value={gatePin}
                  onChange={(e) => setGatePin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-agri-green outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target cursor-pointer"
            >
              <span>{isHindi ? 'वॉक-इन डेस्क खोलें' : 'Open Walk-In Desk Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Notice */}
          <div className="pt-2 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs font-bold text-agri-green hover:underline inline-flex items-center space-x-1 cursor-pointer"
            >
              <span>⚡ {isHindi ? 'त्वरित डेमो वॉक-इन डेस्क प्रवेश' : 'Quick Demo Walk-In Desk (Suresh Patel, Gate 1)'}</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-agri-text-muted py-4">
        © 2026 Department of Consumer Affairs • APMC Assisted Desk Portal
      </footer>

    </div>
  );
};

export default WalkInDeskAuth;
