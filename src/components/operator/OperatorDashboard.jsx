import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Cpu, Users, Scale, Clock, CheckCircle2, PhoneCall, ShieldCheck, UserCheck, AlertCircle, Calculator } from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { LiveQueueTable } from './LiveQueueTable';
import { ActiveProcurementModal } from './ActiveProcurementModal';

export const OperatorDashboard = () => {
  const { queueItems, checkInFarmer, callNextFarmer } = useDemo();
  const [selectedInspectionToken, setSelectedInspectionToken] = useState(null);

  // Metrics summary
  const totalBookings = queueItems.length;
  const waitingCount = queueItems.filter(q => q.status === 'WAITING').length;
  const checkedInCount = queueItems.filter(q => q.status === 'CHECKED_IN').length;
  const processingCount = queueItems.filter(q => q.status === 'PROCESSING').length;
  const completedCount = queueItems.filter(q => q.status === 'COMPLETED').length;

  // Lifecycle items
  const currentProcessingItem = queueItems.find(q => q.status === 'PROCESSING');
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
              Manage gate check-ins, queue movement, counter call announcements, and log official weighbridge metrics.
            </p>
          </div>

          {/* Dynamic Operator Quick Control */}
          <div className="bg-agri-surface/10 p-4 rounded-xl border border-white/20 text-right shrink-0">
            <span className="text-[10px] text-agri-gold font-bold uppercase tracking-wider block font-mono">
              DEMO WORKFLOW TRIGGER
            </span>

            {/* If currently processing, show inspect trigger */}
            {currentProcessingItem ? (
              <button
                onClick={() => setSelectedInspectionToken(currentProcessingItem)}
                className="mt-2 bg-agri-green text-white hover:bg-agri-green-dark font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
              >
                <Scale className="w-4 h-4 text-agri-gold" />
                <span>INSPECT TOKEN ({currentProcessingItem.token})</span>
              </button>
            ) : nextCheckedInItem ? (
              /* If a farmer is checked-in, call next to counter */
              <button
                onClick={() => callNextFarmer(nextCheckedInItem.token, 'Counter 2')}
                className="mt-2 bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md animate-pulse"
              >
                <PhoneCall className="w-4 h-4 fill-agri-green-dark" />
                <span>CALL NEXT ({nextCheckedInItem.token})</span>
              </button>
            ) : nextWaitingItem ? (
              /* If farmer is waiting, prompt gate check in */
              <button
                onClick={() => checkInFarmer(nextWaitingItem.token)}
                className="mt-2 bg-agri-ivory text-agri-green-dark hover:bg-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
              >
                <UserCheck className="w-4 h-4 text-agri-green" />
                <span>CHECK IN GATE ({nextWaitingItem.token})</span>
              </button>
            ) : (
              <span className="mt-2 inline-block text-xs text-agri-ivory-muted font-medium">
                All bookings cleared for today
              </span>
            )}
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
          subtitle="At inspection counter"
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

      {/* COMPACT COUNTER 2 STATUS BAR (SECONDARY TO QUEUE TABLE) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-agri-ivory-muted shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
            currentProcessingItem 
              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}>
            <Scale className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-sm text-agri-text">
                Inspection Counter 2
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                currentProcessingItem 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {currentProcessingItem ? 'Active' : 'Available'}
              </span>
            </div>

            <p className="text-xs text-agri-text-muted mt-0.5">
              {currentProcessingItem ? (
                <span>
                  Processing Token <strong>#{currentProcessingItem.token}</strong> ({currentProcessingItem.farmerName}) • {currentProcessingItem.crop} ({currentProcessingItem.expectedQty} Qtl)
                </span>
              ) : nextCheckedInItem ? (
                <span>
                  Ready for next farmer — Token <strong>#{nextCheckedInItem.token}</strong> ({nextCheckedInItem.farmerName}) is checked in
                </span>
              ) : (
                <span>No farmer currently being processed • Yard queue clear</span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Action Button for Counter */}
        <div className="shrink-0 flex items-center space-x-2">
          {currentProcessingItem ? (
            <button
              onClick={() => setSelectedInspectionToken(currentProcessingItem)}
              className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-agri-gold" />
              <span>Log Weighment</span>
            </button>
          ) : nextCheckedInItem ? (
            <button
              onClick={() => callNextFarmer(nextCheckedInItem.token, 'Counter 2')}
              className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 animate-pulse"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-agri-green-dark" />
              <span>Call Next ({nextCheckedInItem.token})</span>
            </button>
          ) : null}
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

    </div>
  );
};
