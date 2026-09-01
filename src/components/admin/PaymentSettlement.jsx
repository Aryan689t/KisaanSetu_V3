import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { ShieldCheck, CheckCircle2, Calculator, Building, FileCheck } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const PaymentSettlement = () => {
  const { queueItems, disbursePayment } = useDemo();

  // Filter items that are completed or pending disbursal
  const pendingDisbursalItems = queueItems.filter(
    q => q.status === 'COMPLETED' || q.paymentStatus === 'PENDING_DISBURSAL' || q.token === 'SNP-014'
  );

  return (
    <div className="paper-surface rounded-2xl border border-agri-ivory-muted shadow-agri-sm overflow-hidden space-y-0">
      
      {/* Header Banner */}
      <div className="p-4 bg-agri-green-dark text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-agri-green/30">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-agri-gold shrink-0" />
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white">
              Pending Settlements & Direct Benefit Transfer (DBT) Audit Trail
            </h3>
            <p className="text-xs text-agri-ivory/80">
              Supervisory tracking & MSP payout settlement authorization across state procurement yards
            </p>
          </div>
        </div>
        <span className="text-[10px] text-agri-gold font-mono uppercase tracking-wider bg-agri-green/60 px-2.5 py-1 rounded border border-agri-gold/30 shrink-0">
          PFMS Grid Sync
        </span>
      </div>

      {/* Verification Formula Standard Bar */}
      <div className="p-3.5 bg-agri-gold-light/20 border-b border-agri-gold/30 text-xs text-agri-text flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-agri-gold-dark shrink-0" />
          <span>
            <strong>Required Audit Standard:</strong> Settlement authorization requires verified net weighment formula (<code className="font-mono bg-agri-gold/10 px-1 py-0.5 rounded text-agri-green-dark font-bold">Quintals × MSP Rate = Total Payout</code>).
          </span>
        </div>
      </div>

      {/* MOBILE SETTLEMENT CARDS (< 768px) */}
      <div className="md:hidden divide-y divide-agri-ivory-muted p-3 space-y-3">
        {pendingDisbursalItems.map((item) => {
          const isDisbursed = item.paymentStatus === 'DISBURSED';
          const isTargetDemo = item.token === 'SNP-014';
          const qty = item.actualQty || 38.5;
          const rate = item.ratePerQuintal || 2200;
          const totalAmount = item.totalAmount || Math.round(qty * rate);

          return (
            <div
              key={item.token}
              className={`p-3.5 rounded-xl border space-y-2.5 ${
                isTargetDemo ? 'bg-agri-gold-light/10 border-agri-gold' : 'bg-[#FFFDF7] border-agri-ivory-muted'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-agri-ivory-muted">
                <div>
                  <span className="font-mono font-extrabold text-base text-agri-green">{item.token}</span>
                  <p className="font-bold text-xs text-agri-text">{item.farmerName}</p>
                </div>
                <StatusBadge status={item.paymentStatus} type="payment" />
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-agri-text-muted">Formula:</span>
                  <span className="font-mono font-bold text-agri-green">{qty} qtl × ₹{rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-agri-text-muted">Total Disbursed:</span>
                  <span className="font-mono font-extrabold text-agri-text text-sm">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-agri-text-muted">DBT Bank:</span>
                  <span className="font-mono text-agri-text">SBI ****4092</span>
                </div>
              </div>

              <div className="pt-2 border-t border-agri-ivory-muted">
                {!isDisbursed ? (
                  <button
                    onClick={() => disbursePayment(item.token)}
                    className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm touch-target"
                  >
                    <FileCheck className="w-4 h-4 text-agri-gold" />
                    <span>Authorize Settlement</span>
                  </button>
                ) : (
                  <span className="w-full text-agri-status-success font-bold text-xs flex items-center justify-center space-x-1 bg-agri-green-soft py-2 rounded-lg border border-agri-green-border">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Settlement Disbursed</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP SETTLEMENTS TABLE (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-agri-ivory border-b border-agri-ivory-muted uppercase text-[10px] text-agri-text-muted font-heading tracking-wider">
            <tr>
              <th className="py-3 px-4">Token / Farmer</th>
              <th className="py-3 px-4">Mandi Station</th>
              <th className="py-3 px-4">Quality & Moisture</th>
              <th className="py-3 px-4">Verified Payout Formula</th>
              <th className="py-3 px-4">Bank DBT Account</th>
              <th className="py-3 px-4">Settlement Status</th>
              <th className="py-3 px-4 text-right">Supervisory Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-agri-ivory-muted font-sans">
            {pendingDisbursalItems.map((item) => {
              const isDisbursed = item.paymentStatus === 'DISBURSED';
              const isTargetDemo = item.token === 'SNP-014';
              const qty = item.actualQty || 38.5;
              const rate = item.ratePerQuintal || 2200;
              const totalAmount = item.totalAmount || Math.round(qty * rate);

              return (
                <tr
                  key={item.token}
                  className={`hover:bg-agri-ivory/50 transition-colors ${
                    isTargetDemo ? 'bg-agri-gold-light/10 font-medium' : ''
                  }`}
                >
                  
                  {/* Token & Farmer */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-extrabold text-sm text-agri-green">
                      {item.token}
                    </div>
                    <div className="font-bold text-agri-text mt-0.5">
                      {item.farmerName}
                    </div>
                  </td>

                  {/* Mandi Station */}
                  <td className="py-3.5 px-4 text-agri-text-muted">
                    <strong className="text-agri-text block">Sonipat Yard</strong>
                    Counter 2
                  </td>

                  {/* Quality & Moisture Inspection */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-agri-text">
                      {item.qualityGrade || 'Grade A'}
                    </div>
                    <span className="text-[10px] text-agri-text-muted font-mono">
                      Moisture: {item.moisturePercent || 12.4}%
                    </span>
                  </td>

                  {/* Formula Calculation */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-agri-green">
                      {qty} qtl × ₹{rate.toLocaleString()} = ₹{totalAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-agri-text-muted block">Verified Net Weight</span>
                  </td>

                  {/* Bank Account */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-agri-text flex items-center space-x-1 font-mono">
                      <Building className="w-3.5 h-3.5 text-agri-green" />
                      <span>SBI ****4092</span>
                    </div>
                    <span className="text-[10px] text-agri-text-muted">Aadhaar Linked DBT</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.paymentStatus} type="payment" />
                  </td>

                  {/* Supervisory Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    {!isDisbursed ? (
                      <button
                        onClick={() => disbursePayment(item.token)}
                        className="bg-agri-green hover:bg-agri-green-dark text-white font-bold px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center space-x-1.5 transition-all shadow-agri-sm hover:scale-[1.02] touch-target"
                        title="Authorize payout settlement for this completed procurement"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-agri-gold" />
                        <span>Authorize Settlement</span>
                      </button>
                    ) : (
                      <span className="text-agri-status-success font-bold text-[11px] inline-flex items-center space-x-1 bg-agri-green-soft px-2.5 py-1 rounded border border-agri-green-border">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Settlement Authorized & Disbursed</span>
                      </span>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Audit Trail Lifecycle Visualizer */}
      <div className="p-4 bg-agri-ivory/40 border-t border-agri-ivory-muted space-y-3">
        <h4 className="font-heading text-xs font-bold text-agri-text uppercase tracking-wider">
          Supervisory Payment Audit Trail Lifecycle
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-[#FFFDF7] rounded-lg border border-agri-ivory-muted flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-agri-green text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
              1
            </div>
            <div>
              <strong className="block text-agri-text text-[11px]">Procurement Weighment</strong>
              <span className="text-[10px] text-agri-text-muted">Operator completes weight & moisture test</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#FFFDF7] rounded-lg border border-agri-ivory-muted flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-agri-gold-dark text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
              2
            </div>
            <div>
              <strong className="block text-agri-text text-[11px]">Settlement Pending</strong>
              <span className="text-[10px] text-agri-text-muted">Net formula auto-verified against MSP</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#FFFDF7] rounded-lg border border-agri-ivory-muted flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-agri-green text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
              3
            </div>
            <div>
              <strong className="block text-agri-text text-[11px]">DoCA Authorization</strong>
              <span className="text-[10px] text-agri-text-muted">Admin authorizes payout release</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#FFFDF7] rounded-lg border border-agri-ivory-muted flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-agri-status-success text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
              4
            </div>
            <div>
              <strong className="block text-agri-text text-[11px]">DBT Account Credit</strong>
              <span className="text-[10px] text-agri-text-muted">PFMS transfers MSP directly to bank</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

