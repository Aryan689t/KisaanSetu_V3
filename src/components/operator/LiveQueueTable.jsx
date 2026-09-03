import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { UserCheck, PhoneCall, Scale, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { ActiveProcurementModal } from './ActiveProcurementModal';

export const LiveQueueTable = () => {
  const { queueItems, checkInFarmer, callNextFarmer } = useDemo();
  const [selectedTokenForInspection, setSelectedTokenForInspection] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Dynamic counts for status filters
  const waitingCount = queueItems.filter(q => q.status === 'WAITING').length;
  const checkedInCount = queueItems.filter(q => q.status === 'CHECKED_IN').length;
  const processingCount = queueItems.filter(q => q.status === 'PROCESSING').length;
  const completedCount = queueItems.filter(q => q.status === 'COMPLETED').length;

  // Operational priority sorting: Active farmers first, completed records after
  const statusPriority = {
    PROCESSING: 1,
    CHECKED_IN: 2,
    WAITING: 3,
    COMPLETED: 4,
    CANCELLED: 5
  };

  const filteredItems = queueItems
    .filter(item => {
      if (filterStatus === 'ALL') return true;
      return item.status === filterStatus;
    })
    .sort((a, b) => {
      if (filterStatus === 'ALL') {
        const pA = statusPriority[a.status] || 99;
        const pB = statusPriority[b.status] || 99;
        if (pA !== pB) return pA - pB;
      }
      return 0;
    });

  return (
    <>
      <div className="paper-surface rounded-2xl border border-agri-ivory-muted shadow-agri-sm overflow-hidden font-sans">
        
        {/* Table Filter Header Bar */}
        <div className="p-3.5 sm:p-4 bg-agri-ivory/50 border-b border-agri-ivory-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5 w-full sm:w-auto">
            <span className="font-bold text-agri-text shrink-0 mr-1">Queue Filter:</span>
            
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                filterStatus === 'ALL' 
                  ? 'bg-agri-green text-white font-bold shadow-sm' 
                  : 'text-agri-text bg-white hover:bg-agri-ivory border border-agri-ivory-muted'
              }`}
            >
              <span>All</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {queueItems.length}
              </span>
            </button>

            <button
              onClick={() => setFilterStatus('WAITING')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                filterStatus === 'WAITING' 
                  ? 'bg-amber-600 text-white font-bold shadow-sm' 
                  : 'text-agri-text bg-white hover:bg-agri-ivory border border-agri-ivory-muted'
              }`}
            >
              <span>Waiting</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'WAITING' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 font-bold'
              }`}>
                {waitingCount}
              </span>
            </button>

            <button
              onClick={() => setFilterStatus('CHECKED_IN')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                filterStatus === 'CHECKED_IN' 
                  ? 'bg-blue-600 text-white font-bold shadow-sm' 
                  : 'text-agri-text bg-white hover:bg-agri-ivory border border-agri-ivory-muted'
              }`}
            >
              <span>Checked-In</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'CHECKED_IN' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-900 font-bold'
              }`}>
                {checkedInCount}
              </span>
            </button>

            <button
              onClick={() => setFilterStatus('PROCESSING')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                filterStatus === 'PROCESSING' 
                  ? 'bg-agri-gold text-agri-green-dark font-extrabold shadow-sm' 
                  : 'text-agri-text bg-white hover:bg-agri-ivory border border-agri-ivory-muted'
              }`}
            >
              <span>Processing</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'PROCESSING' ? 'bg-agri-green-dark text-white' : 'bg-yellow-100 text-yellow-900 font-bold'
              }`}>
                {processingCount}
              </span>
            </button>

            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                filterStatus === 'COMPLETED' 
                  ? 'bg-agri-green-dark text-white font-bold shadow-sm' 
                  : 'text-agri-text bg-white hover:bg-agri-ivory border border-agri-ivory-muted'
              }`}
            >
              <span>Completed</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'COMPLETED' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {completedCount}
              </span>
            </button>
          </div>

          <div className="text-agri-text-muted text-[11px] flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse"></span>
            <span>Sonipat Yard • <strong className="text-agri-green">Counter 2 Active</strong></span>
          </div>
        </div>

        {/* MOBILE QUEUE CARDS (< 768px) */}
        <div className="md:hidden divide-y divide-agri-ivory-muted p-3 space-y-3">
          {filteredItems.map((item) => {
            const isTargetDemo = item.token === 'SNP-014';
            const isProcessing = item.status === 'PROCESSING';
            const isCheckedIn = item.status === 'CHECKED_IN';
            const isCompleted = item.status === 'COMPLETED';

            return (
              <div
                key={item.token}
                className={`p-3.5 rounded-xl border transition-all ${
                  isProcessing
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : isCheckedIn
                    ? 'bg-blue-50/50 border-blue-200'
                    : isTargetDemo
                    ? 'bg-agri-gold-light/20 border-agri-gold'
                    : isCompleted
                    ? 'bg-white/80 border-gray-200 opacity-90'
                    : 'bg-[#FFFDF7] border-agri-ivory-muted'
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-agri-ivory-muted">
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-extrabold text-lg text-agri-green font-mono">
                      {item.token}
                    </span>
                    {isTargetDemo && (
                      <span className="text-[9px] bg-agri-gold text-agri-green-dark font-extrabold px-1.5 py-0.5 rounded font-mono">
                        DEMO TARGET
                      </span>
                    )}
                  </div>
                  <StatusBadge status={item.status} type="queue" />
                </div>

                <div className="py-2.5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Farmer:</span>
                    <span className="font-bold text-agri-text">{item.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Crop & Qty:</span>
                    <span className="font-bold text-agri-text">{item.crop} ({item.expectedQty} Qtl)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Slot Window:</span>
                    <span className="font-mono text-agri-text">{item.slotTime || '11:00 AM - 11:30 AM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Assigned Counter:</span>
                    <span className="font-mono text-agri-green font-bold">{item.counter || 'Counter 2'}</span>
                  </div>
                </div>

                {/* Mobile Operational Action Buttons */}
                <div className="pt-2.5 border-t border-agri-ivory-muted flex items-center justify-end">
                  {item.status === 'WAITING' && (
                    <button
                      onClick={() => checkInFarmer(item.token)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm touch-target"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Gate Check-In ({item.token})</span>
                    </button>
                  )}

                  {item.status === 'CHECKED_IN' && (
                    <button
                      onClick={() => callNextFarmer(item.token, 'Counter 2')}
                      className="w-full bg-agri-gold text-agri-green-dark hover:bg-agri-gold-dark font-extrabold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm animate-pulse touch-target"
                    >
                      <PhoneCall className="w-4 h-4 fill-agri-green-dark" />
                      <span>Call to Counter 2 ({item.token})</span>
                    </button>
                  )}

                  {item.status === 'PROCESSING' && (
                    <button
                      onClick={() => setSelectedTokenForInspection(item)}
                      className="w-full bg-agri-green text-white hover:bg-agri-green-dark font-extrabold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm touch-target"
                    >
                      <Scale className="w-4 h-4 text-agri-gold" />
                      <span>Enter Quality & Weighment</span>
                    </button>
                  )}

                  {item.status === 'COMPLETED' && (
                    <span className="w-full text-emerald-800 font-bold text-xs flex items-center justify-center space-x-1 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Procured ({item.actualQty || 38.5} Qtl) • Weighed</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP QUEUE TABLE (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-agri-green-dark text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="py-3.5 px-4">Token #</th>
                <th className="py-3.5 px-4">Farmer Details</th>
                <th className="py-3.5 px-4">Crop & Target</th>
                <th className="py-3.5 px-4">Slot Window</th>
                <th className="py-3.5 px-4">Counter</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Operational Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-agri-ivory-muted font-sans">
              {filteredItems.map((item) => {
                const isTargetDemo = item.token === 'SNP-014';
                const isProcessing = item.status === 'PROCESSING';
                const isCheckedIn = item.status === 'CHECKED_IN';
                const isCompleted = item.status === 'COMPLETED';

                return (
                  <tr
                    key={item.token}
                    className={`transition-colors ${
                      isProcessing
                        ? 'bg-amber-50/70 font-medium'
                        : isCheckedIn
                        ? 'bg-blue-50/40 font-medium'
                        : isTargetDemo
                        ? 'bg-agri-gold-light/20 font-medium'
                        : isCompleted
                        ? 'bg-white/60 opacity-90 hover:opacity-100 hover:bg-agri-ivory/50'
                        : 'hover:bg-agri-ivory/60'
                    }`}
                  >
                    
                    {/* Token */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-sm text-agri-green">
                      <div className="flex items-center space-x-1.5">
                        <span>{item.token}</span>
                        {isTargetDemo && (
                          <span className="text-[9px] bg-agri-gold text-agri-green-dark font-extrabold px-1.5 py-0.2 rounded font-mono">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Farmer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-agri-text">
                        {item.farmerName}
                      </div>
                      <div className="text-[10px] text-agri-text-muted font-mono flex items-center space-x-2 mt-0.5">
                        <span>{item.mobile || '+91 98765 43210'}</span>
                        <span>•</span>
                        <span>Aadhaar: ****{item.aadhaarLast4 || '4821'}</span>
                      </div>
                    </td>

                    {/* Crop */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-agri-text">{item.crop}</div>
                      <span className="text-[10px] text-agri-text-muted">Target: <strong>{item.expectedQty} Qtl</strong></span>
                    </td>

                    {/* Slot Time */}
                    <td className="py-3.5 px-4 font-medium text-agri-text font-mono">
                      {item.slotTime || '11:00 AM - 11:30 AM'}
                    </td>

                    {/* Station / Counter */}
                    <td className="py-3.5 px-4">
                      <span className="bg-agri-ivory px-2.5 py-1 rounded text-[11px] font-bold text-agri-green border border-agri-ivory-muted font-mono">
                        {item.counter || 'Counter 2'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} type="queue" />
                    </td>

                    {/* Operational Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        
                        {/* Step 1: Gate Check-In (For WAITING) */}
                        {item.status === 'WAITING' && (
                          <button
                            onClick={() => checkInFarmer(item.token)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center space-x-1.5 transition-colors shadow-sm touch-target"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Gate Check-In</span>
                          </button>
                        )}

                        {/* Step 2: Call to Counter (For CHECKED_IN) */}
                        {item.status === 'CHECKED_IN' && (
                          <button
                            onClick={() => callNextFarmer(item.token, 'Counter 2')}
                            className="bg-agri-gold text-agri-green-dark hover:bg-agri-gold-dark font-extrabold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1.5 transition-all shadow-sm animate-pulse touch-target"
                          >
                            <PhoneCall className="w-3.5 h-3.5 fill-agri-green-dark" />
                            <span>Call to Counter 2</span>
                          </button>
                        )}

                        {/* Step 3: Enter Quality & Weighment (For PROCESSING) */}
                        {item.status === 'PROCESSING' && (
                          <button
                            onClick={() => setSelectedTokenForInspection(item)}
                            className="bg-agri-green text-white hover:bg-agri-green-dark font-extrabold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1.5 transition-all shadow-sm touch-target"
                          >
                            <Scale className="w-3.5 h-3.5 text-agri-gold" />
                            <span>Log Weighment</span>
                          </button>
                        )}

                        {/* Step 4: Procurement Completed (For COMPLETED) */}
                        {item.status === 'COMPLETED' && (
                          <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Procured ({item.actualQty || 38.5} Qtl)</span>
                          </span>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Active Procurement Inspection Modal */}
      {selectedTokenForInspection && (
        <ActiveProcurementModal
          tokenItem={selectedTokenForInspection}
          onClose={() => setSelectedTokenForInspection(null)}
        />
      )}
    </>
  );
};

