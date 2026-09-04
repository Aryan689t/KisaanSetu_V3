import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Cpu, Users, Scale, Clock, CheckCircle2, PhoneCall, ShieldCheck, UserCheck, AlertCircle, Calculator, UserPlus } from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { LiveQueueTable } from './LiveQueueTable';
import { ActiveProcurementModal } from './ActiveProcurementModal';
import { AssistedBookingModal } from './AssistedBookingModal';

export const OperatorDashboard = () => {
  const { queueItems, checkInFarmer, callNextFarmer } = useDemo();
  const [selectedInspectionToken, setSelectedInspectionToken] = useState(null);
  const [isAssistedModalOpen, setIsAssistedModalOpen] = useState(false);

  // Metrics summary
  const totalBookings = queueItems.length;
  const waitingCount = queueItems.filter(q => q.status === 'WAITING').length;
  const checkedInCount = queueItems.filter(q => q.status === 'CHECKED_IN').length;
  const processingCount = queueItems.filter(q => q.status === 'PROCESSING').length;
  const completedCount = queueItems.filter(q => q.status === 'COMPLETED').length;

  // Multi-counter assignments
  const countersList = ['Counter 1', 'Counter 2', 'Counter 3', 'Counter 4'];
  const getActiveItemForCounter = (counterName) => {
    return queueItems.find(q => q.status === 'PROCESSING' && (q.counter === counterName || q.counter?.includes(counterName.slice(-1))));
  };

  const nextCheckedInItem = queueItems.find(q => q.status === 'CHECKED_IN');
  const nextWaitingItem = queueItems.find(q => q.status === 'WAITING');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Operations Control Centre Header */}
      <div className="bg-agri-green-dark text-white rounded-2xl p-6 sm:p-8 shadow-agri-md relative overflow-hidden border border-agri-green/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-agri-gold/20 text-agri-gold px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-agri-gold/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>SONIPAT MAIN PROCUREMENT YARD • OPERATOR CONTROL DESK</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Procurement Desk & Live Queue Operations
            </h1>
            <p className="text-xs sm:text-sm text-agri-ivory/80 mt-1 font-sans">
              Manage gate check-ins, assisted walk-in tokens, multi-counter call routing, and electronic weighbridge QA.
            </p>
          </div>

          {/* Operator Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Assisted Walk-In Token Button */}
            <button
              onClick={() => setIsAssistedModalOpen(true)}
              className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Issue Spot Token (Walk-In)</span>
            </button>

            {/* Quick Demo Workflow Trigger */}
            {nextCheckedInItem ? (
              <button
                onClick={() => callNextFarmer(nextCheckedInItem.token, 'Counter 2')}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 border border-white/30 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-agri-gold" />
                <span>Call Next ({nextCheckedInItem.token})</span>
              </button>
            ) : nextWaitingItem ? (
              <button
                onClick={() => checkInFarmer(nextWaitingItem.token)}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 border border-white/30 transition-all"
              >
                <UserCheck className="w-4 h-4 text-agri-gold" />
                <span>Check In ({nextWaitingItem.token})</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Yard Queue Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <MetricCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="Scheduled today"
          icon={Users}
        />
        <MetricCard
          title="Waiting"
          value={waitingCount}
          subtitle="In yard arrival queue"
          icon={Clock}
          highlight={waitingCount > 0}
        />
        <MetricCard
          title="Checked-In"
          value={checkedInCount}
          subtitle="Verified at entry gate"
          icon={ShieldCheck}
          highlight={checkedInCount > 0}
        />
        <MetricCard
          title="Processing"
          value={processingCount}
          subtitle="At inspection counters"
          icon={Scale}
          highlight={processingCount > 0}
        />
        <MetricCard
          title="Completed"
          value={completedCount}
          subtitle="Weighed & logged"
          icon={CheckCircle2}
          badgeText="Today"
        />
      </div>

      {/* MULTI-COUNTER STATUS BAR (Counters 1 to 4) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-agri-ivory-muted shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-agri-green" />
            <h3 className="font-heading font-bold text-sm text-agri-text">
              Live Weighbridge Stations Status (4 Active Counters)
            </h3>
          </div>
          <span className="text-[11px] text-agri-text-muted font-mono">
            DoCA APMC Certified Scales
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {countersList.map((counterName) => {
            const activeItem = getActiveItemForCounter(counterName);
            const isCounterActive = !!activeItem;

            return (
              <div
                key={counterName}
                className={`p-3 rounded-xl border transition-all ${
                  isCounterActive 
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm' 
                    : 'bg-agri-ivory/50 border-agri-ivory-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-agri-text font-mono">
                    {counterName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                    isCounterActive 
                      ? 'bg-amber-200 text-amber-900 border border-amber-400' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {isCounterActive ? 'Active' : 'Available'}
                  </span>
                </div>

                <div className="mt-2 min-h-[38px] flex flex-col justify-center">
                  {isCounterActive ? (
                    <div className="text-[11px] space-y-0.5">
                      <div className="font-bold text-agri-green-dark flex items-center justify-between">
                        <span>Token #{activeItem.token}</span>
                        <span className="font-normal text-agri-text-muted">{activeItem.expectedQty} Qtl</span>
                      </div>
                      <p className="text-agri-text truncate text-[10px]">{activeItem.farmerName}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-agri-text-muted italic">
                      Ready for next tractor weighment
                    </p>
                  )}
                </div>

                {/* Quick Action */}
                <div className="mt-2 pt-2 border-t border-agri-ivory-muted flex items-center justify-end">
                  {isCounterActive ? (
                    <button
                      onClick={() => setSelectedInspectionToken(activeItem)}
                      className="text-[11px] font-bold text-agri-green hover:text-agri-green-dark flex items-center space-x-1"
                    >
                      <Scale className="w-3 h-3" />
                      <span>Log Weighment</span>
                    </button>
                  ) : nextCheckedInItem ? (
                    <button
                      onClick={() => callNextFarmer(nextCheckedInItem.token, counterName)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Assign ({nextCheckedInItem.token})</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400">Idle</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Queue Management Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-agri-text">
            Live Mandi Queue Operational Management
          </h2>
          <span className="text-xs text-agri-text-muted">
            {waitingCount + checkedInCount + processingCount} active farmers in yard
          </span>
        </div>
        <LiveQueueTable />
      </div>

      {/* Active Inspection Modal */}
      {selectedInspectionToken && (
        <ActiveProcurementModal
          tokenItem={selectedInspectionToken}
          onClose={() => setSelectedInspectionToken(null)}
        />
      )}

      {/* Assisted / Walk-In Spot Booking Modal */}
      {isAssistedModalOpen && (
        <AssistedBookingModal
          onClose={() => setIsAssistedModalOpen(false)}
        />
      )}

    </div>
  );
};
