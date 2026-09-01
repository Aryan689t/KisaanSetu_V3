import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { UserCheck, PhoneCall, Scale, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { ActiveProcurementModal } from './ActiveProcurementModal';

export const LiveQueueTable = () => {
  const { queueItems, checkInFarmer, callNextFarmer } = useDemo();
  const [selectedTokenForInspection, setSelectedTokenForInspection] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredItems = queueItems.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  return (
    <>
      <div className="paper-surface rounded-2xl border border-agri-ivory-muted shadow-agri-sm overflow-hidden">
        
        {/* Table Filter Header */}
        <div className="p-3.5 sm:p-4 bg-agri-ivory/50 border-b border-agri-ivory-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5 w-full sm:w-auto">
            <span className="font-bold text-agri-text shrink-0 mr-1">Filter:</span>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterStatus === 'ALL' ? 'bg-agri-green text-white font-bold shadow-sm' : 'text-agri-text-muted hover:bg-agri-ivory'}`}
            >
              All ({queueItems.length})
            </button>
            <button
              onClick={() => setFilterStatus('WAITING')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterStatus === 'WAITING' ? 'bg-amber-600 text-white font-bold shadow-sm' : 'text-agri-text-muted hover:bg-agri-ivory'}`}
            >
              Waiting
            </button>
            <button
              onClick={() => setFilterStatus('CHECKED_IN')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterStatus === 'CHECKED_IN' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-agri-text-muted hover:bg-agri-ivory'}`}
            >
              Checked In
            </button>
            <button
              onClick={() => setFilterStatus('PROCESSING')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterStatus === 'PROCESSING' ? 'bg-agri-gold text-agri-green-dark font-bold shadow-sm' : 'text-agri-text-muted hover:bg-agri-ivory'}`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterStatus === 'COMPLETED' ? 'bg-agri-green-dark text-white font-bold shadow-sm' : 'text-agri-text-muted hover:bg-agri-ivory'}`}
            >
              Completed
            </button>
          </div>

          <div className="text-agri-text-muted text-[11px] flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-agri-green animate-pulse"></span>
            <span>Sonipat Yard • <strong className="text-agri-green">Counter 2</strong></span>
          </div>
        </div>

        {/* MOBILE QUEUE CARDS (< 768px) */}
        <div className="md:hidden divide-y divide-agri-ivory-muted p-3 space-y-3">
          {filteredItems.map((item) => {
            const isTargetDemo = item.token === 'SNP-014';

            return (
              <div
                key={item.token}
                className={`p-3.5 rounded-xl border transition-all ${
                  isTargetDemo
                    ? 'bg-agri-gold-light/20 border-agri-gold'
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

                <div className="py-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Farmer:</span>
                    <span className="font-bold text-agri-text">{item.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Crop:</span>
                    <span className="font-bold text-agri-text">{item.crop} ({item.expectedQty} Qtl)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Slot Time:</span>
                    <span className="font-mono text-agri-text">{item.slotTime || '11:00 AM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-agri-text-muted">Station:</span>
                    <span className="font-mono text-agri-green font-bold">{item.counter || 'Counter 2'}</span>
                  </div>
                </div>

                {/* Mobile Operational Action Buttons */}
                <div className="pt-2 border-t border-agri-ivory-muted flex items-center justify-end">
                  {item.status === 'WAITING' && (
                    <button
                      onClick={() => checkInFarmer(item.token)}
                      className="w-full bg-agri-green-soft text-agri-green-dark hover:bg-agri-green hover:text-white px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-agri-green-border touch-target"
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
                    <span className="text-agri-status-success font-bold text-xs inline-flex items-center space-x-1 bg-agri-green-soft px-3 py-1.5 rounded-lg border border-agri-green-border">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Procured ({item.actualQty || 38.5} Qtl)</span>
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
                <th className="py-3.5 px-4">Slot Time</th>
                <th className="py-3.5 px-4">Station / Counter</th>
                <th className="py-3.5 px-4">Queue Status</th>
                <th className="py-3.5 px-4 text-right">Operational Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-agri-ivory-muted font-sans">
              {filteredItems.map((item) => {
                const isTargetDemo = item.token === 'SNP-014';

                return (
                  <tr
                    key={item.token}
                    className={`hover:bg-agri-ivory/50 transition-colors ${
                      isTargetDemo ? 'bg-agri-gold-light/20 font-medium' : ''
                    }`}
                  >
                    
                    {/* Token */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-sm text-agri-green">
                      {item.token}
                    </td>

                    {/* Farmer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-agri-text flex items-center space-x-1.5">
                        <span>{item.farmerName}</span>
                        {isTargetDemo && (
                          <span className="text-[9px] bg-agri-gold text-agri-green-dark font-extrabold px-1.5 py-0.5 rounded font-mono">
                            TARGET DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-agri-text-muted font-mono">Aadhaar: ****{item.aadhaarLast4 || '4821'}</span>
                    </td>

                    {/* Crop */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-agri-text">{item.crop}</div>
                      <span className="text-[10px] text-agri-text-muted">Expected: {item.expectedQty} Qtl</span>
                    </td>

                    {/* Slot Time */}
                    <td className="py-3.5 px-4 font-medium text-agri-text font-mono">
                      {item.slotTime || '11:00 AM'}
                    </td>

                    {/* Station / Counter */}
                    <td className="py-3.5 px-4">
                      <span className="bg-agri-ivory px-2.5 py-1 rounded text-[11px] font-bold text-agri-green border border-agri-ivory-muted font-mono">
                        {item.counter || 'Unassigned'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} type="queue" />
                    </td>

                    {/* Operational Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        
                        {/* Step 1: Check In Gate (For WAITING) */}
                        {item.status === 'WAITING' && (
                          <button
                            onClick={() => checkInFarmer(item.token)}
                            className="bg-agri-green-soft text-agri-green-dark hover:bg-agri-green hover:text-white px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center space-x-1.5 transition-colors border border-agri-green-border shadow-agri-sm touch-target"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Gate Check-In</span>
                          </button>
                        )}

                        {/* Step 2: Call to Counter (For CHECKED_IN) */}
                        {item.status === 'CHECKED_IN' && (
                          <button
                            onClick={() => callNextFarmer(item.token, 'Counter 2')}
                            className="bg-agri-gold text-agri-green-dark hover:bg-agri-gold-dark font-extrabold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1.5 transition-all shadow-agri-sm animate-pulse touch-target"
                          >
                            <PhoneCall className="w-3.5 h-3.5 fill-agri-green-dark" />
                            <span>Call to Counter 2</span>
                          </button>
                        )}

                        {/* Step 3: Enter Quality & Weighment (For PROCESSING) */}
                        {item.status === 'PROCESSING' && (
                          <button
                            onClick={() => setSelectedTokenForInspection(item)}
                            className="bg-agri-green text-white hover:bg-agri-green-dark font-extrabold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1.5 transition-all shadow-agri-sm touch-target"
                          >
                            <Scale className="w-3.5 h-3.5 text-agri-gold" />
                            <span>Log Weighment</span>
                          </button>
                        )}

                        {/* Step 4: Procurement Completed (For COMPLETED) */}
                        {item.status === 'COMPLETED' && (
                          <span className="text-agri-status-success font-bold text-[11px] inline-flex items-center space-x-1 bg-agri-green-soft px-2.5 py-1 rounded border border-agri-green-border">
                            <CheckCircle2 className="w-3.5 h-3.5" />
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

