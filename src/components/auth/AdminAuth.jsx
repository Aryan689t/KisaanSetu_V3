import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ShieldCheck, Mail, Key, Lock, ArrowRight, ArrowLeft, Building2 } from 'lucide-react';

export const AdminAuth = ({ onBack }) => {
  const { loginWithRole } = useDemo();

  const [adminEmail, setAdminEmail] = useState('admin@kisansetu.gov.in');
  const [officerId, setOfficerId] = useState('DOCA-ADM-2026');
  const [passcode, setPasscode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithRole('admin', adminEmail);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col justify-between font-sans selection:bg-agri-gold/30">
      
      {/* Header */}
      <header className="bg-[#3d2708] text-white py-4 px-4 sm:px-8 border-b border-amber-900 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-white transition-colors mr-1"
                title="Back to Portal Selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                KisanSetu • Executive Admin Portal
              </span>
              <span className="text-[10px] text-amber-200">
                Department of Consumer Affairs • State Procurement Control
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
            <Building2 className="w-8 h-8 text-amber-800" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-agri-text">
            DoCA Admin Login
          </h1>
          <p className="text-xs text-agri-text-muted">
            State-wide Mandi capacity monitoring & MSP payout disbursal authorization
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-xl space-y-5">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Official Email */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Official Department Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@kisansetu.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none font-medium"
                />
              </div>
            </div>

            {/* Officer ID */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                DoCA Officer ID / Employee Code
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="text"
                  required
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="DOCA-ADM-2026"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none font-mono font-bold uppercase"
                />
              </div>
            </div>

            {/* Security Passcode */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Executive Admin Passcode / MFA Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
            >
              <span>Access DoCA Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Notice */}
          <div className="pt-2 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={() => loginWithRole('admin')}
              className="text-xs font-bold text-amber-900 hover:underline inline-flex items-center space-x-1"
            >
              <span>⚡ Quick Demo Admin Access (S. K. Sharma, HQ)</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-agri-text-muted py-4">
        © 2026 Department of Consumer Affairs • State Executive Portal
      </footer>

    </div>
  );
};

export default AdminAuth;
