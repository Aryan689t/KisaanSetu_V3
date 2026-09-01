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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="Scheduled today"
          icon={Users}
        />
        <MetricCard
          title="Waiting Gate"
          value={waitingCount}
          subtitle="In yard queue"
          icon={Clock}
        />
        <MetricCard
          title="Checked-In"
          value={checkedInCount}
          subtitle="Verified at entry"
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

      {/* DYNAMIC CURRENTLY PROCESSING SECTION */}
      {currentProcessingItem ? (
        <div className="paper-surface rounded-2xl p-6 border-2 border-agri-gold shadow-agri-md animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-agri-ivory-muted">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-agri-gold animate-ping"></span>
                <span className="text-[10px] font-extrabold uppercase bg-agri-gold text-agri-green-dark px-3 py-1 rounded-full">
                  CURRENTLY ACTIVE AT INSPECTION COUNTER 2
                </span>
              </div>
              
              <h2 className="font-heading text-xl font-bold text-agri-green mt-2.5 flex items-center space-x-3">
                <span>Token #{currentProcessingItem.token}</span>
                <span className="text-sm font-semibold text-agri-text font-sans">
                  ({currentProcessingItem.farmerName})
                </span>
              </h2>
              <p className="text-xs text-agri-text-muted mt-1">
                Crop Offered: <strong>{currentProcessingItem.crop}</strong> • Expected Target: <strong>{currentProcessingItem.expectedQty} Quintals</strong> • Slot: <strong>{currentProcessingItem.slotTime || '11:00 AM'}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedInspectionToken(currentProcessingItem)}
                className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-agri-sm transition-all flex items-center space-x-2 hover:scale-[1.02]"
              >
                <Scale className="w-4 h-4 text-agri-gold" />
                <span>Log Moisture & Weighment</span>
              </button>
            </div>
          </div>

          {/* Calculation Formula Preview */}
          <div className="mt-4 p-3 bg-agri-gold-light/20 rounded-xl text-xs font-mono text-agri-text flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-agri-gold/30">
            <span className="text-agri-text-muted">Target Rate: <strong>₹2,200/Quintal (MSP Grade A)</strong></span>
            <span className="text-agri-green-dark font-bold text-sm">
              Formula: {currentProcessingItem.actualQty || 38.5} Quintals × ₹2,200 = ₹{((currentProcessingItem.actualQty || 38.5) * 2200).toLocaleString()}
            </span>
          </div>
        </div>
      ) : nextCheckedInItem ? (
        /* IDLE COUNTER WITH READY FARMER PROMPT */
        <div className="paper-surface rounded-2xl p-6 border border-agri-gold/60 shadow-agri-sm bg-gradient-to-r from-agri-gold-light/10 via-[#FFFDF7] to-agri-ivory/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-agri-gold/20 text-agri-green-dark rounded-xl border border-agri-gold/40 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded">
                    GATE CHECK-IN VERIFIED
                  </span>
                  <span className="text-xs text-agri-text-muted">Counter 2 Available</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-agri-text mt-1">
                  Token #{nextCheckedInItem.token} ({nextCheckedInItem.farmerName}) is waiting at gate
                </h3>
                <p className="text-xs text-agri-text-muted mt-0.5">
                  Crop: {nextCheckedInItem.crop} • Expected: {nextCheckedInItem.expectedQty} Qtl
                </p>
              </div>
            </div>

            <button
              onClick={() => callNextFarmer(nextCheckedInItem.token, 'Counter 2')}
              className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-agri-sm shrink-0 animate-bounce"
            >
              <PhoneCall className="w-4 h-4 fill-agri-green-dark" />
              <span>Call Token {nextCheckedInItem.token} to Counter 2</span>
            </button>
          </div>
        </div>
      ) : (
        /* ALL CLEAR IDLE CARD */
        <div className="paper-surface rounded-2xl p-6 border border-agri-ivory-muted shadow-agri-sm bg-agri-ivory/30 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-agri-green-soft text-agri-green mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm text-agri-text">
            Inspection Counter 2 Ready & Available
          </h3>
          <p className="text-xs text-agri-text-muted">
            No active farmer at counter. Check in arriving farmers from the queue table below to proceed.
          </p>
        </div>
      )}

      {/* Live Queue Management Table */}
      <div className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-agri-text">
          Live Mandi Queue Operational Management
        </h2>
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
