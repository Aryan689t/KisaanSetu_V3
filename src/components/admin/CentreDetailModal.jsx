import React from 'react';
import { X, Building2, Users, Clock, Scale, AlertTriangle, ShieldCheck, MapPin, Activity, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const CentreDetailModal = ({ centre, onClose }) => {
  if (!centre) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#FFFDF7] rounded-2xl max-w-2xl w-full border border-agri-ivory-muted shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-agri-green-dark text-white p-5 flex items-start justify-between border-b border-agri-green/30">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold text-agri-gold bg-agri-gold/20 px-2.5 py-0.5 rounded border border-agri-gold/30">
                Supervisory Telemetry Mode • Read-Only
              </span>
              <StatusBadge status={centre.status} type="centre" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-agri-gold" />
              {centre.name}
            </h3>
            <p className="text-xs text-agri-ivory/80 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-agri-gold/80" />
              {centre.address} ({centre.district}, {centre.state})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-agri-ivory/70 hover:text-white bg-agri-green/50 hover:bg-agri-green p-1.5 rounded-lg transition-colors"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Alert Banner if Congested or Moderate */}
          {centre.status === 'CONGESTED' && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-4 flex items-start space-x-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-rose-800">High Yard Congestion Detected</strong>
                <p className="mt-0.5 text-rose-700">
                  Yard capacity load has reached <span className="font-bold">{centre.capacityPercent}%</span> with an estimated farmer waiting time of <span className="font-bold">~{centre.estWaitMinutes} minutes</span>. Recommended action: Direct incoming token allocations to neighbor yards.
                </p>
              </div>
            </div>
          )}

          {centre.status === 'MODERATE' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex items-start space-x-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-800">Moderate Queue Volume</strong>
                <p className="mt-0.5 text-amber-700">
                  Yard capacity load is at <span className="font-bold">{centre.capacityPercent}%</span> with <span className="font-bold">{centre.queueCount} farmers</span> in queue (~{centre.estWaitMinutes} min wait). Monitoring counter throughput.
                </p>
              </div>
            </div>
          )}

          {/* Key Operational Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
              <span className="text-[10px] uppercase font-bold text-agri-text-muted flex items-center gap-1">
                <Users className="w-3 h-3 text-agri-green" /> Queue Size
              </span>
              <div className="text-xl font-bold text-agri-text font-heading mt-1">
                {centre.queueCount} <span className="text-xs font-normal text-agri-text-muted">Farmers</span>
              </div>
            </div>

            <div className="bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
              <span className="text-[10px] uppercase font-bold text-agri-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3 text-agri-gold-dark" /> Est. Waiting Time
              </span>
              <div className="text-xl font-bold text-agri-text font-heading mt-1">
                ~{centre.estWaitMinutes} <span className="text-xs font-normal text-agri-text-muted">min</span>
              </div>
            </div>

            <div className="bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
              <span className="text-[10px] uppercase font-bold text-agri-text-muted flex items-center gap-1">
                <Activity className="w-3 h-3 text-agri-green" /> Yard Capacity Load
              </span>
              <div className="text-xl font-bold text-agri-text font-heading mt-1">
                {centre.capacityPercent}%
              </div>
            </div>

            <div className="bg-agri-ivory/60 p-3 rounded-xl border border-agri-ivory-muted">
              <span className="text-[10px] uppercase font-bold text-agri-text-muted flex items-center gap-1">
                <Scale className="w-3 h-3 text-agri-green" /> Available Slots
              </span>
              <div className="text-xl font-bold text-agri-text font-heading mt-1">
                {centre.availableSlots} <span className="text-xs font-normal text-agri-text-muted">/ {centre.totalSlots}</span>
              </div>
            </div>
          </div>

          {/* Infrastructure & Operating Parameters */}
          <div className="bg-agri-ivory/40 p-4 rounded-xl border border-agri-ivory-muted space-y-3 text-xs">
            <h4 className="font-heading font-bold text-agri-text flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-agri-green" /> Infrastructure Telemetry & Operational Status
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-agri-text">
              <div className="flex justify-between py-1 border-b border-agri-ivory-muted">
                <span className="text-agri-text-muted">Active Weighing Counters:</span>
                <span className="font-bold">{centre.activeCounters} Counters Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-ivory-muted">
                <span className="text-agri-text-muted">Yard Operating Hours:</span>
                <span className="font-bold">{centre.operatingHours || '08:00 AM - 06:00 PM'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-ivory-muted">
                <span className="text-agri-text-muted">System Recommendation:</span>
                <span className="font-medium text-agri-green-dark">{centre.recommendationReason}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-ivory-muted">
                <span className="text-agri-text-muted">Telemetry Status:</span>
                <span className="font-bold text-agri-green flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sensor Grid Online
                </span>
              </div>
            </div>
          </div>

          {/* Simulated Counter Queue Telemetry Breakdown */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-xs text-agri-text">
              Inspection Counters Real-Time Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {Array.from({ length: centre.activeCounters || 3 }).map((_, idx) => (
                <div key={idx} className="p-2.5 bg-agri-ivory/50 rounded-lg border border-agri-ivory-muted flex items-center justify-between">
                  <div>
                    <span className="font-bold text-agri-text block">Counter {idx + 1}</span>
                    <span className="text-[10px] text-agri-text-muted">Moisture & Weighbridge</span>
                  </div>
                  <span className="text-[10px] font-bold text-agri-green bg-agri-green-soft px-2 py-0.5 rounded border border-agri-green-border">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-agri-ivory p-4 border-t border-agri-ivory-muted flex items-center justify-between text-xs">
          <span className="text-agri-text-muted italic">
            * Note: DoCA Admin view is supervisory and read-only. Physical queue check-ins and weighments are managed by local procurement operators.
          </span>
          <button
            onClick={onClose}
            className="bg-agri-green hover:bg-agri-green-dark text-white font-bold px-4 py-2 rounded-xl transition-all shadow-agri-sm"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
