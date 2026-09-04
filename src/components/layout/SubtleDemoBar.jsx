import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { UserCheck, ShieldCheck, Cpu, UserPlus, RotateCcw, Play, AlertTriangle, CheckCircle2, Clapperboard, ChevronDown, ChevronUp, Settings } from 'lucide-react';

export const SubtleDemoBar = () => {
  const {
    activeRole,
    setActiveRole,
    callNextFarmer,
    completeProcurement,
    disbursePayment,
    resetDemoState,
    activeBooking,
    demoCondition,
    setDemoCondition
  } = useDemo();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="bg-[#102a1a] text-agri-ivory text-xs py-1.5 px-3 sm:px-6 border-b border-agri-green-dark/80 shadow-inner select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        
        {/* Mobile Header Bar (< md) */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px] font-mono">
            <Clapperboard className="w-3.5 h-3.5" />
            <span className="capitalize">{activeRole === 'walkin' ? 'Walk-In Desk' : `${activeRole} View`}</span>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="px-2.5 py-1 bg-white/10 text-amber-300 rounded-lg text-[11px] font-bold flex items-center space-x-1 border border-white/20 touch-target min-h-[36px]"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>⚙ Demo Controls</span>
            {isMobileOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Role Selector (Always on md+, Collapsible on mobile) */}
        <div className={`${isMobileOpen ? 'flex' : 'hidden md:flex'} flex-col md:flex-row items-stretch md:items-center gap-2 pt-2 md:pt-0`}>
          <div className="flex items-center space-x-1.5">
            <div className="hidden md:inline-flex items-center space-x-1 text-amber-400 font-extrabold uppercase text-[10px] tracking-wider pr-2.5 border-r border-agri-green/40 shrink-0 font-mono">
              <Clapperboard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>DEMO CONTROLS</span>
            </div>

            <div className="flex items-center space-x-1 w-full md:w-auto">
              <button
                onClick={() => { setActiveRole('farmer'); setIsMobileOpen(false); }}
                className={`flex-1 md:flex-none px-2.5 py-1 rounded-lg text-xs transition-all flex items-center justify-center space-x-1 touch-target min-h-[36px] ${
                  activeRole === 'farmer'
                    ? 'bg-agri-gold text-agri-green-dark font-extrabold shadow-sm'
                    : 'text-agri-ivory/70 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Farmer</span>
              </button>

              <button
                onClick={() => { setActiveRole('operator'); setIsMobileOpen(false); }}
                className={`flex-1 md:flex-none px-2.5 py-1 rounded-lg text-xs transition-all flex items-center justify-center space-x-1 touch-target min-h-[36px] ${
                  activeRole === 'operator'
                    ? 'bg-agri-gold text-agri-green-dark font-extrabold shadow-sm'
                    : 'text-agri-ivory/70 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Operator</span>
              </button>

              <button
                onClick={() => { setActiveRole('walkin'); setIsMobileOpen(false); }}
                className={`flex-1 md:flex-none px-2.5 py-1 rounded-lg text-xs transition-all flex items-center justify-center space-x-1 touch-target min-h-[36px] ${
                  activeRole === 'walkin'
                    ? 'bg-agri-gold text-agri-green-dark font-extrabold shadow-sm'
                    : 'text-agri-ivory/70 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Walk-In Desk</span>
              </button>
            </div>
          </div>
        </div>

        {/* Demo Scenario Triggers (Always visible on md+, Collapsible on mobile) */}
        <div className={`${isMobileOpen ? 'flex' : 'hidden md:flex'} flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10`}>
          <div className="flex items-center space-x-1.5 shrink-0 justify-between sm:justify-start">
            {demoCondition === 'NORMAL' ? (
              <button
                onClick={() => setDemoCondition('CONGESTED_SONIPAT')}
                className="w-full sm:w-auto bg-rose-950/90 hover:bg-rose-900 text-amber-300 px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center justify-center space-x-1.5 border border-rose-700/60 shadow-sm transition-all touch-target min-h-[38px]"
                title="Simulate sudden heavy truck backlog at Sonipat Mandi (wait 24m -> 67m)"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Simulate Sonipat Congestion</span>
              </button>
            ) : (
              <button
                onClick={() => setDemoCondition('NORMAL')}
                className="w-full sm:w-auto bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center justify-center space-x-1.5 border border-emerald-600/50 shadow-sm transition-all touch-target min-h-[38px]"
                title="Restore normal Mandi queue loads"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Restore Normal Load</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 justify-end">
            {activeBooking?.status === 'WAITING' && (
              <button
                onClick={() => callNextFarmer(activeBooking?.token || 'SNP-014')}
                className="bg-amber-400 hover:bg-amber-300 text-agri-green-dark px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center space-x-1 transition-all shadow-sm touch-target min-h-[38px]"
                title={`Simulate operator calling token ${activeBooking?.token || 'SNP-014'} to Counter 2`}
              >
                <Play className="w-3 h-3 fill-agri-green-dark" />
                <span>Call {activeBooking?.token || 'SNP-014'}</span>
              </button>
            )}

            {activeBooking?.status === 'PROCESSING' && (
              <button
                onClick={() => completeProcurement({ 
                  tokenStr: activeBooking?.token || 'SNP-014', 
                  actualQty: activeBooking?.actualQty || 38.5, 
                  moisturePercent: 12.4, 
                  qualityGrade: 'Grade A',
                  ratePerQuintal: activeBooking?.ratePerQuintal || 2200
                })}
                className="bg-amber-400 hover:bg-amber-300 text-agri-green-dark px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center space-x-1 transition-all shadow-sm touch-target min-h-[38px]"
                title="Simulate operator weighing & completing procurement"
              >
                <Play className="w-3 h-3 fill-agri-green-dark" />
                <span>Complete ({activeBooking?.actualQty || 38.5} Qtl)</span>
              </button>
            )}

            {activeBooking?.paymentStatus === 'PENDING_DISBURSAL' && (
              <button
                onClick={() => disbursePayment(activeBooking?.token || 'SNP-014')}
                className="bg-emerald-500 hover:bg-emerald-400 text-agri-green-dark px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center space-x-1 transition-all shadow-sm touch-target min-h-[38px]"
                title="Simulate Admin disbursing MSP payment"
              >
                <Play className="w-3 h-3 fill-agri-green-dark" />
                <span>Disburse ₹{(activeBooking?.totalAmount || 84700).toLocaleString()}</span>
              </button>
            )}

            <button
              onClick={resetDemoState}
              className="text-agri-ivory/60 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg flex items-center space-x-1 text-[11px] transition-colors border border-white/10 touch-target min-h-[38px]"
              title="Reset to default demo data baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

