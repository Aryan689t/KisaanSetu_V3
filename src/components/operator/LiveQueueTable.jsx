import React, { useState } from 'react';
import { useDemo, isWalkInBooking, isAdvanceBooking } from '../../context/DemoContext';
import { UserCheck, PhoneCall, Scale, CheckCircle2, UserX } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { ActiveProcurementModal } from './ActiveProcurementModal';

/**
 * Formats slot time or arrival/estimated processing time based on booking type
 */
export const formatQueueTime = (item) => {
  if (!item) return '—';
  const isWalkIn = isWalkInBooking(item);
  
  if (isWalkIn) {
    if (item.slotTime && item.slotTime.includes('Arrived')) {
      return item.slotTime;
    }
    const arr = item.arrivalTime ? item.arrivalTime.replace(/\s*(AM|PM)/i, '') : '09:12';
    const est = item.estTime || item.estimatedTime || '10:05';
    return `Arrived ${arr} • Est. ${est}`;
  }
  
  // Advance online scheduled appointment slot
  return item.slotTime || '09:30 AM - 09:45 AM';
};

export const LiveQueueTable = ({ readOnly = false, channel = null }) => {
  const { queueItems, operatorChannel, checkInFarmer, callNextFarmer, markFarmerNoShow } = useDemo();
  const [selectedTokenForInspection, setSelectedTokenForInspection] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const effectiveChannel = channel !== undefined && channel !== null ? channel : operatorChannel;

  // Filter items based on active operational channel
  const channelItems = queueItems.filter(item => {
    if (!effectiveChannel || effectiveChannel === 'all') return true;
    if (effectiveChannel === 'online') return isAdvanceBooking(item);
    if (effectiveChannel === 'physical') return isWalkInBooking(item);
    return true;
  });

  // Dynamic counts for status filters based on channel
  const waitingCount = channelItems.filter(q => q.status === 'WAITING').length;
  const checkedInCount = channelItems.filter(q => q.status === 'CHECKED_IN').length;
  const processingCount = channelItems.filter(q => q.status === 'PROCESSING').length;
  const completedCount = channelItems.filter(q => q.status === 'COMPLETED').length;
  const noShowCount = channelItems.filter(q => q.status === 'NO_SHOW' || q.status === 'EXPIRED').length;

  // Operational priority sorting: Active farmers first, completed records after
  const statusPriority = {
    PROCESSING: 1,
    CHECKED_IN: 2,
    WAITING: 3,
    COMPLETED: 4,
    NO_SHOW: 5,
    CANCELLED: 6
  };

  const filteredItems = channelItems
    .filter(item => {
      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'NO_SHOW') return item.status === 'NO_SHOW' || item.status === 'EXPIRED';
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
                {channelItems.length}
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

            {noShowCount > 0 && (
              <button
                onClick={() => setFilterStatus('NO_SHOW')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                  filterStatus === 'NO_SHOW' 
                    ? 'bg-rose-800 text-white font-bold shadow-sm' 
                    : 'text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <span>No-Show</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterStatus === 'NO_SHOW' ? 'bg-white/20 text-white' : 'bg-rose-200 text-rose-950 font-bold'
                }`}>
                  {noShowCount}
                </span>
              </button>
            )}
          </div>

          <div className="text-agri-text-muted text-[11px] flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse"></span>
            <span>Sonipat Yard • <strong className="text-agri-green">4 Weighbridges Online</strong></span>
          </div>
        </div>

        {/* MOBILE QUEUE CARDS (< 768px) */}
        <div className="md:hidden divide-y divide-agri-ivory-muted p-3 space-y-3">
          {filteredItems.map((item) => {
            const isTargetDemo = item.token === 'SNP-014';
            const isProcessing = item.status === 'PROCESSING';
            const isCheckedIn = item.status === 'CHECKED_IN';
            const isCompleted = item.status === 'COMPLETED';
            const isNoShow = item.status === 'NO_SHOW' || item.status === 'EXPIRED';

            return (
              <div
                key={item.token}
                className={`p-3.5 rounded-xl border transition-all ${
                  isProcessing
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : isCheckedIn
                    ? 'bg-blue-50/40 border-blue-200'
                    : isTargetDemo
                    ? 'bg-agri-gold-light/20 border-agri-gold/40'
                    : isNoShow
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-agri-ivory-muted'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-mono font-extrabold text-sm text-agri-green">
                        {item.token}
                      </span>
                      {isTargetDemo && (
                        <span className="text-[9px] bg-agri-gold text-agri-green-dark font-extrabold px-1.5 py-0.2 rounded font-mono">
                          DEMO
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-xs text-agri-text mt-1">
                      {item.farmerName}
                    </h3>
                  </div>
                  <StatusBadge status={item.status} type="queue" />
                </div>

                <div className="mt-2 text-xs space-y-1 text-agri-text-muted">
                  <p>Crop: <strong className="text-agri-text">{item.crop}</strong> ({item.expectedQty} Qtl)</p>
                  <p>Time: <span className="font-mono text-agri-text font-bold">{formatQueueTime(item)}</span></p>
                </div>

                {/* Mobile Actions / Read-Only View */}
                {readOnly ? (
                  <div className="mt-2.5 pt-2 border-t border-agri-ivory-muted flex items-center justify-between text-[11px] text-agri-text-muted font-mono">
                    <span>Queue Status:</span>
                    <strong className="text-agri-green">{item.status}</strong>
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-agri-ivory-muted space-y-2">
                    {item.status === 'WAITING' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => checkInFarmer(item.token)}
                          className="bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Check-In</span>
                        </button>
                        <button
                          onClick={() => markFarmerNoShow(item.token)}
                          className="bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700 border border-gray-200 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-500" />
                          <span>No-Show</span>
                        </button>
                      </div>
                    )}

                    {item.status === 'CHECKED_IN' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => callNextFarmer(item.token, item.counter || 'Counter 2')}
                          className="bg-agri-gold text-agri-green-dark font-extrabold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm animate-pulse"
                        >
                          <PhoneCall className="w-4 h-4 fill-agri-green-dark" />
                          <span>Call Farmer</span>
                        </button>
                        <button
                          onClick={() => markFarmerNoShow(item.token)}
                          className="bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700 border border-gray-200 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-500" />
                          <span>No-Show</span>
                        </button>
                      </div>
                    )}

                    {item.status === 'PROCESSING' && (
                      <button
                        onClick={() => setSelectedTokenForInspection(item)}
                        className="w-full bg-agri-green text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <Scale className="w-4 h-4 text-agri-gold" />
                        <span>Log Weighment</span>
                      </button>
                    )}

                    {item.status === 'COMPLETED' && (
                      <span className="w-full text-emerald-800 font-bold text-xs flex items-center justify-center space-x-1 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Procured ({item.actualQty || 38.5} Qtl)</span>
                      </span>
                    )}

                    {isNoShow && (
                      <span className="w-full text-gray-500 font-medium text-xs flex items-center justify-center space-x-1 bg-gray-100 py-2 rounded-xl">
                        <span>Missed Slot / Capacity Released</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DESKTOP QUEUE TABLE (>= 768px) - 6 Balanced Columns without Counter */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-agri-green-dark text-white uppercase text-[10px] tracking-wider font-heading">
              <tr>
                <th className="py-3.5 px-4 w-[12%]">Token #</th>
                <th className="py-3.5 px-4 w-[28%]">Farmer Details</th>
                <th className="py-3.5 px-4 w-[18%]">Crop & Target</th>
                <th className="py-3.5 px-4 w-[22%]">Slot / Est. Time</th>
                <th className="py-3.5 px-4 w-[10%]">Current Status</th>
                <th className="py-3.5 px-4 text-right">
                  {readOnly ? 'Queue Status' : 'Operational Action'}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-agri-ivory-muted font-sans">
              {filteredItems.map((item) => {
                const isTargetDemo = item.token === 'SNP-014';
                const isProcessing = item.status === 'PROCESSING';
                const isCheckedIn = item.status === 'CHECKED_IN';
                const isCompleted = item.status === 'COMPLETED';
                const isNoShow = item.status === 'NO_SHOW' || item.status === 'EXPIRED';

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
                        : isNoShow
                        ? 'bg-gray-50/80 opacity-60'
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

                    {/* Farmer Details */}
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

                    {/* Crop & Target */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-agri-text">{item.crop}</div>
                      <span className="text-[10px] text-agri-text-muted">Target: <strong>{item.expectedQty} Qtl</strong></span>
                    </td>

                    {/* Slot / Est. Time */}
                    <td className="py-3.5 px-4 font-medium text-agri-text font-mono text-xs">
                      {formatQueueTime(item)}
                    </td>

                    {/* Current Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} type="queue" />
                    </td>

                    {/* Operational Actions / Read-Only Display */}
                    <td className="py-3.5 px-4 text-right">
                      {readOnly ? (
                        <div className="flex items-center justify-end">
                          <span className="text-[11px] font-mono font-medium text-agri-text-muted bg-agri-ivory/80 px-2.5 py-1 rounded border border-agri-ivory-muted">
                            {item.status === 'COMPLETED'
                              ? '✓ Procured'
                              : item.status === 'PROCESSING'
                              ? '● At Scale'
                              : item.status === 'CHECKED_IN'
                              ? '● Checked In'
                              : 'Waiting'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          
                          {/* Step 1: Gate Check-In (For WAITING) */}
                          {item.status === 'WAITING' && (
                            <>
                              <button
                                onClick={() => checkInFarmer(item.token)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center space-x-1.5 transition-colors shadow-sm touch-target cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Gate Check-In</span>
                              </button>
                              <button
                                onClick={() => markFarmerNoShow(item.token)}
                                className="text-gray-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-gray-200 px-2 py-1.5 rounded-lg text-[11px] font-medium flex items-center space-x-1 cursor-pointer"
                                title="Mark Farmer No-Show to release queue capacity"
                              >
                                <UserX className="w-3 h-3 text-rose-500" />
                                <span>No-Show</span>
                              </button>
                            </>
                          )}

                          {/* Step 2: Call to Counter (For CHECKED_IN) */}
                          {item.status === 'CHECKED_IN' && (
                            <>
                              <button
                                onClick={() => callNextFarmer(item.token, item.counter || 'Counter 2')}
                                className="bg-agri-gold text-agri-green-dark hover:bg-agri-gold-dark font-extrabold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1.5 transition-all shadow-sm animate-pulse touch-target cursor-pointer"
                              >
                                <PhoneCall className="w-3.5 h-3.5 fill-agri-green-dark" />
                                <span>Call Farmer</span>
                              </button>
                              <button
                                onClick={() => markFarmerNoShow(item.token)}
                                className="text-gray-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-gray-200 px-2 py-1.5 rounded-lg text-[11px] font-medium flex items-center space-x-1 cursor-pointer"
                                title="Mark Farmer No-Show"
                              >
                                <UserX className="w-3 h-3 text-rose-500" />
                                <span>No-Show</span>
                              </button>
                            </>
                          )}

                          {/* Step 3: Enter Quality & Weighment (For PROCESSING) */}
                          {item.status === 'PROCESSING' && (
                            <button
                              onClick={() => setSelectedTokenForInspection(item)}
                              className="bg-agri-green text-white hover:bg-agri-green-dark font-extrabold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1.5 transition-all shadow-sm touch-target cursor-pointer"
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

                          {/* Step 5: No-Show Record */}
                          {isNoShow && (
                            <span className="text-gray-500 font-mono text-[11px] bg-gray-100 px-2 py-1 rounded">
                              No-Show • Released
                            </span>
                          )}

                        </div>
                      )}
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

