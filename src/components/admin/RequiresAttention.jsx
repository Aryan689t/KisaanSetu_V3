import React from 'react';
import { AlertOctagon, AlertTriangle, Eye, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const RequiresAttention = ({ onSelectCentre }) => {
  const { centres } = useDemo();

  // Filter centres with HIGH or MODERATE congestion
  const attentionCentres = centres
    .filter(c => c.capacityPercent > 70 || c.status === 'CONGESTED' || c.status === 'MODERATE')
    .sort((a, b) => b.capacityPercent - a.capacityPercent);

  if (attentionCentres.length === 0) return null;

  return (
    <div className="paper-surface rounded-2xl p-6 border border-rose-200/60 shadow-agri-sm space-y-4 bg-gradient-to-r from-rose-50/30 via-[#FFFDF7] to-amber-50/20">
      <div className="flex items-center justify-between pb-3 border-b border-agri-ivory-muted">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
            <AlertOctagon className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-agri-text flex items-center gap-2">
              Requires Operational Attention
            </h3>
            <p className="text-xs text-agri-text-muted">
              Centres exceeding target yard capacity threshold (&gt;70% load) requiring DoCA supervisory review
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-md border border-rose-300 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
          {attentionCentres.length} Centres Flagged
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attentionCentres.map((centre) => {
          const isCongested = centre.capacityPercent > 85 || centre.status === 'CONGESTED';
          
          return (
            <div
              key={centre.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                isCongested
                  ? 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                  : 'bg-amber-50/30 border-amber-200/80 hover:border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isCongested ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'}`}></span>
                    <h4 className="font-bold text-sm text-agri-text font-heading">
                      {centre.name}
                    </h4>
                  </div>
                  <p className="text-xs text-agri-text-muted mt-0.5 ml-4">
                    {centre.district}, {centre.state} • {centre.activeCounters} Counters Active
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${
                    isCongested
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {isCongested ? '🔴 HIGH CONGESTION' : '🟡 MODERATE LOAD'}
                </span>
              </div>

              {/* Stat callouts */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#FFFDF7] rounded-lg border border-agri-ivory-muted text-xs">
                <div>
                  <span className="text-[10px] text-agri-text-muted block font-medium">Capacity</span>
                  <span className={`font-extrabold font-mono text-sm ${isCongested ? 'text-rose-700' : 'text-amber-700'}`}>
                    {centre.capacityPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-agri-text-muted block font-medium font-sans">Queue</span>
                  <span className="font-extrabold text-agri-text text-sm font-mono">
                    {centre.queueCount} <span className="text-[10px] font-normal text-agri-text-muted">farmers</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-agri-text-muted block font-medium font-sans">Est. Wait</span>
                  <span className="font-extrabold text-agri-text text-sm font-mono">
                    ~{centre.estWaitMinutes} <span className="text-[10px] font-normal text-agri-text-muted">min</span>
                  </span>
                </div>
              </div>

              {/* Supervisory Read-Only Action */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-agri-text-muted flex items-center gap-1 font-sans">
                  <ShieldAlert className="w-3.5 h-3.5 text-agri-gold-dark shrink-0" />
                  {isCongested ? 'Supervisory Intervention Suggested' : 'Queue Load Monitoring Active'}
                </span>
                
                <button
                  onClick={() => onSelectCentre && onSelectCentre(centre)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-agri-sm ${
                    isCongested
                      ? 'bg-rose-700 hover:bg-rose-800 text-white'
                      : 'bg-agri-green hover:bg-agri-green-dark text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isCongested ? 'Review Centre' : 'Monitor Queue'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
