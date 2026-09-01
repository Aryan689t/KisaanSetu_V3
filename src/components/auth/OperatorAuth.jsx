import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Wrench, Building, Shield, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const OperatorAuth = ({ onBack }) => {
  const { loginWithRole, centres } = useDemo();

  const [operatorId, setOperatorId] = useState('OP-7821');
  const [selectedCentre, setSelectedCentre] = useState(centres[0]?.id || 'cnt-sonipat');
  const [gatePin, setGatePin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithRole('operator', `${operatorId.toLowerCase()}@kisansetu.gov.in`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col justify-between font-sans selection:bg-agri-gold/30">
      
      {/* Header */}
      <header className="bg-[#122b40] text-white py-4 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white transition-colors mr-1"
                title="Back to Portal Selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Wrench className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                KisanSetu • Mandi Operator Staff Portal
              </span>
              <span className="text-[10px] text-blue-200">
                Gate Inspection & Weighment Management System
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-8 flex-1 w-full flex flex-col justify-center space-y-6 animate-in fade-in duration-300">
        
        {/* Portal Title Banner */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-sm border border-blue-200">
            <Wrench className="w-8 h-8 text-blue-700" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-agri-text">
            Mandi Operator Login
          </h1>
          <p className="text-xs text-agri-text-muted">
            Authorize gate check-ins, call tokens to counters, & log crop weighments
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-500/30 shadow-xl space-y-5">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Operator Staff ID */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Operator Staff ID / Badge Number
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="text"
                  required
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="OP-7821"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none uppercase font-mono font-bold"
                />
              </div>
            </div>

            {/* Assigned Mandi Centre Dropdown */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Assigned Procurement Yard / Mandi
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <select
                  value={selectedCentre}
                  onChange={(e) => setSelectedCentre(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-agri-text"
                >
                  {centres.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district || 'Haryana'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Security Gate PIN */}
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Operator Security Passcode / Gate PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-agri-text-muted" />
                <input
                  type="password"
                  required
                  value={gatePin}
                  onChange={(e) => setGatePin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 touch-target"
            >
              <span>Access Operator Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Notice */}
          <div className="pt-2 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={() => loginWithRole('operator')}
              className="text-xs font-bold text-blue-800 hover:underline inline-flex items-center space-x-1"
            >
              <span>⚡ Quick Demo Operator Login (Sonipat Gate #2)</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-agri-text-muted py-4">
        © 2026 Department of Consumer Affairs • Mandi Staff Operational Access
      </footer>

    </div>
  );
};

export default OperatorAuth;
