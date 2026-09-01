import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { StatusBadge } from '../ui/StatusBadge';
import { Users, Clock, Scale, Eye, Activity, Building2 } from 'lucide-react';

export const CentreLoadBar = ({ onSelectCentre }) => {
  const { centres } = useDemo();

  return (
    <div className="paper-surface rounded-2xl p-6 border border-agri-ivory-muted shadow-agri-sm space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-agri-ivory-muted">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-agri-green" />
            <h3 className="font-heading text-lg font-bold text-agri-text">
              Mandi Load & Queue Congestion Telemetry
            </h3>
          </div>
          <p className="text-xs text-agri-text-muted mt-0.5">
            Real-time yard capacity utilization, queue sizes, and estimated waiting times across state procurement hubs
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-agri-green bg-agri-green-soft px-2.5 py-1 rounded border border-agri-green-border flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse"></span>
            State Telemetry Active
          </span>
        </div>
      </div>

      {/* Grid of Centre Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {centres.map((centre) => {
          let barBg = 'bg-agri-green';
          let borderAccent = 'border-agri-ivory-muted hover:border-agri-green-border';
          
          if (centre.capacityPercent > 85 || centre.status === 'CONGESTED') {
            barBg = 'bg-rose-600';
            borderAccent = 'border-rose-200 bg-rose-50/20 hover:border-rose-300';
          } else if (centre.capacityPercent > 70 || centre.status === 'MODERATE') {
            barBg = 'bg-amber-500';
            borderAccent = 'border-amber-200 bg-amber-50/20 hover:border-amber-300';
          }

          return (
            <div 
              key={centre.id} 
              className={`p-4 rounded-xl border transition-all space-y-3 bg-[#FFFDF7] ${borderAccent}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-agri-text font-heading flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-agri-green shrink-0" />
                    {centre.name}
                  </h4>
                  <p className="text-xs text-agri-text-muted mt-0.5">
                    District: <strong className="text-agri-text font-medium">{centre.district}</strong> • {centre.activeCounters || 4} Counters Operating
                  </p>
                </div>
                <StatusBadge status={centre.status} type="centre" />
              </div>

              {/* Stat Pills Grid */}
              <div className="grid grid-cols-3 gap-2 bg-agri-ivory/60 p-2.5 rounded-lg border border-agri-ivory-muted text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] text-agri-text-muted flex items-center gap-1">
                    <Users className="w-3 h-3 text-agri-green" /> Queue Size
                  </span>
                  <span className="font-extrabold text-agri-text mt-0.5 font-mono">
                    {centre.queueCount} <span className="font-normal text-[10px] text-agri-text-muted">farmers</span>
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-agri-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3 text-agri-gold-dark" /> Est. Wait
                  </span>
                  <span className="font-extrabold text-agri-text mt-0.5 font-mono">
                    ~{centre.estWaitMinutes} <span className="font-normal text-[10px] text-agri-text-muted">min</span>
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-agri-text-muted flex items-center gap-1">
                    <Scale className="w-3 h-3 text-agri-green" /> Open Slots
                  </span>
                  <span className="font-extrabold text-agri-text mt-0.5 font-mono">
                    {centre.availableSlots} <span className="font-normal text-[10px] text-agri-text-muted">free</span>
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-medium text-agri-text-muted">
                  <span>Yard Capacity Load</span>
                  <span className="font-bold text-agri-text font-mono">{centre.capacityPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-agri-ivory-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                    style={{ width: `${centre.capacityPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer action: Read-Only Supervisory Telemetry */}
              <div className="flex items-center justify-between pt-1 border-t border-agri-ivory-muted text-xs">
                <span className="text-[10px] text-agri-text-muted">
                  Operating Hours: {centre.operatingHours || '08:00 AM - 06:00 PM'}
                </span>
                <button
                  onClick={() => onSelectCentre && onSelectCentre(centre)}
                  className="text-agri-green hover:text-agri-green-dark font-bold text-xs inline-flex items-center gap-1 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Telemetry</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
