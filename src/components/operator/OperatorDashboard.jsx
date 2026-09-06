import React, { useState } from 'react';
import { useDemo, isWalkInBooking, isAdvanceBooking } from '../../context/DemoContext';
import { 
  Users, 
  Scale, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  ShieldCheck, 
  UserCheck, 
  UserPlus,
  Zap
} from 'lucide-react';
import { LiveQueueTable } from './LiveQueueTable';
import { ActiveProcurementModal } from './ActiveProcurementModal';
import { AssistedBookingModal } from './AssistedBookingModal';

export const OperatorDashboard = () => {
  const { 
    queueItems, 
    checkInFarmer, 
    callNextFarmer, 
    operatorChannel
  } = useDemo();
  
  const [selectedInspectionToken, setSelectedInspectionToken] = useState(null);
  const [isAssistedModalOpen, setIsAssistedModalOpen] = useState(false);

  const isOnlineChannel = operatorChannel === 'online';

  // Filter queue items specific to this operator's channel
  const channelQueueItems = queueItems.filter(item => {
    return isOnlineChannel ? isAdvanceBooking(item) : isWalkInBooking(item);
  });

  // Channel-specific metrics
  const waitingCount = channelQueueItems.filter(q => q.status === 'WAITING').length;
  const checkedInCount = channelQueueItems.filter(q => q.status === 'CHECKED_IN').length;
  const processingCount = channelQueueItems.filter(q => q.status === 'PROCESSING').length;
  const completedCount = channelQueueItems.filter(q => q.status === 'COMPLETED').length;

  const nextCheckedInItem = channelQueueItems.find(q => q.status === 'CHECKED_IN');
  const nextWaitingItem = channelQueueItems.find(q => q.status === 'WAITING');

  return (
    <div className="space-y-4 animate-in fade-in duration-300 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. OPERATOR IDENTITY / COMPACT HEADER                                     */}
      {/* ========================================================================= */}
      <div className={`rounded-2xl p-4 sm:p-5 text-white shadow-sm border transition-all ${
        isOnlineChannel
          ? 'bg-gradient-to-r from-[#113822] via-[#0e2f1c] to-[#15462a] border-emerald-500/40'
          : 'bg-gradient-to-r from-[#3b2707] via-[#2a1b05] to-[#452e09] border-amber-500/40'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                isOnlineChannel
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-amber-400 text-amber-950'
              }`}>
                {isOnlineChannel ? 'Online Operator 01' : 'Physical Operator 01'}
              </span>
              <span className="text-xs text-agri-ivory/80 font-mono">
                {isOnlineChannel ? '3 Operators • Low Queue Load' : '2 Operators • High Queue Load'}
              </span>
            </div>

            <h1 className="font-heading text-lg sm:text-xl font-black tracking-tight text-white">
              {isOnlineChannel 
                ? 'Online Operator Desk 01 — Advance Booking Intake' 
                : 'Physical Operator Desk 01 — Walk-in Channel Intake'}
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsAssistedModalOpen(true)}
              className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Issue Spot Token</span>
            </button>

            {nextCheckedInItem ? (
              <button
                onClick={() => callNextFarmer(nextCheckedInItem.token, isOnlineChannel ? 'Counter 2 (Express)' : 'Counter 3 (General)')}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-white/30 transition-all cursor-pointer active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 text-agri-gold" />
                <span>Call Next ({nextCheckedInItem.token})</span>
              </button>
            ) : nextWaitingItem ? (
              <button
                onClick={() => checkInFarmer(nextWaitingItem.token)}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-white/30 transition-all cursor-pointer active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-agri-gold" />
                <span>Check In ({nextWaitingItem.token})</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SMALL KPI STRIP                                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        
        {/* Waiting */}
        <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
          waitingCount > 0 
            ? (isOnlineChannel ? 'bg-emerald-50/80 border-emerald-300' : 'bg-amber-50/80 border-amber-300')
            : 'bg-white border-agri-ivory-muted'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              waitingCount > 0 
                ? (isOnlineChannel ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')
                : 'bg-gray-100 text-gray-500'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Waiting</span>
              <span className="text-sm font-black text-agri-text font-mono">{waitingCount} in queue</span>
            </div>
          </div>
        </div>

        {/* Checked-In */}
        <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
          checkedInCount > 0 ? 'bg-blue-50/80 border-blue-300' : 'bg-white border-agri-ivory-muted'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              checkedInCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Checked-In</span>
              <span className="text-sm font-black text-agri-text font-mono">{checkedInCount} at gate</span>
            </div>
          </div>
        </div>

        {/* Processing / At Scales */}
        <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
          processingCount > 0 ? 'bg-amber-50/80 border-amber-300' : 'bg-white border-agri-ivory-muted'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              processingCount > 0 ? 'bg-amber-200 text-amber-900' : 'bg-gray-100 text-gray-500'
            }`}>
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">At Scales</span>
              <span className="text-sm font-black text-agri-text font-mono">{processingCount} testing</span>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="p-3 rounded-xl border bg-white border-agri-ivory-muted flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Completed</span>
              <span className="text-sm font-black text-agri-text font-mono">{completedCount} today</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. QUEUE TABLE DIRECTLY UNDERNEATH                                        */}
      {/* ========================================================================= */}
      <div className="pt-1">
        <LiveQueueTable channel={operatorChannel} />
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS (WEIGHMENT & QC / SPOT TOKEN)                                   */}
      {/* ========================================================================= */}
      {selectedInspectionToken && (
        <ActiveProcurementModal
          tokenItem={selectedInspectionToken}
          onClose={() => setSelectedInspectionToken(null)}
        />
      )}

      {isAssistedModalOpen && (
        <AssistedBookingModal
          onClose={() => setIsAssistedModalOpen(false)}
        />
      )}

    </div>
  );
};
