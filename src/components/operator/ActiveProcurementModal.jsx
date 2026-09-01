import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Scale, ShieldCheck, CheckCircle2, Calculator, AlertTriangle, Building2 } from 'lucide-react';

export const ActiveProcurementModal = ({ tokenItem, onClose }) => {
  const { completeProcurement } = useDemo();

  const [actualQty, setActualQty] = useState(tokenItem?.actualQty || 38.5);
  const [moisturePercent, setMoisturePercent] = useState(tokenItem?.moisturePercent || 12.4);
  const [qualityGrade, setQualityGrade] = useState(tokenItem?.qualityGrade || 'Grade A');

  const ratePerQuintal = tokenItem?.ratePerQuintal || 2200;
  const calculatedTotal = Math.round(Number(actualQty || 0) * ratePerQuintal);

  const handleComplete = (e) => {
    e.preventDefault();
    if (!tokenItem) return;
    
    completeProcurement({
      tokenStr: tokenItem.token,
      actualQty: Number(actualQty),
      moisturePercent: Number(moisturePercent),
      qualityGrade
    });
    onClose();
  };

  if (!tokenItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#FFFDF7] rounded-2xl max-w-xl w-full border border-agri-ivory-muted shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-agri-green-dark text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-extrabold text-lg font-mono shadow-agri-sm">
              {tokenItem.token}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-agri-gold tracking-widest block font-mono">
                WEIGHBRIDGE & QUALITY LOG • COUNTER 2
              </span>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                {tokenItem.farmerName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-agri-ivory/80 hover:text-white hover:bg-agri-green/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inspection Form */}
        <form onSubmit={handleComplete} className="p-6 space-y-5">
          
          {/* Booking Summary Box */}
          <div className="bg-agri-ivory/80 p-3.5 rounded-xl border border-agri-ivory-muted grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Crop Offered</span>
              <p className="font-bold text-agri-text mt-0.5">{tokenItem.crop}</p>
            </div>
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Expected Qty</span>
              <p className="font-bold text-agri-text mt-0.5">{tokenItem.expectedQty} Quintals</p>
            </div>
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Assigned Station</span>
              <p className="font-bold text-agri-green mt-0.5">{tokenItem.counter || 'Counter 2'}</p>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                Actual Weight (Qtl) *
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="200"
                value={actualQty}
                onChange={(e) => setActualQty(e.target.value)}
                className="w-full p-2.5 bg-agri-ivory border border-agri-ivory-muted rounded-xl text-sm font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                required
              />
              <span className="text-[10px] text-agri-text-muted block mt-1">Verified on weighbridge</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                Moisture Content (%) *
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="30"
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(e.target.value)}
                className="w-full p-2.5 bg-agri-ivory border border-agri-ivory-muted rounded-xl text-sm font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                required
              />
              <span className="text-[10px] text-agri-text-muted block mt-1">Target limit &le; 14%</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                Quality Grade *
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full p-2.5 bg-agri-ivory border border-agri-ivory-muted rounded-xl text-sm font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
              >
                <option value="Grade A">Grade A (FAQ Premium)</option>
                <option value="Grade B">Grade B (Standard)</option>
                <option value="Grade C">Grade C (Fair Average)</option>
              </select>
              <span className="text-[10px] text-agri-text-muted block mt-1">Visual inspection grade</span>
            </div>

          </div>

          {/* Transparent Live Calculation Preview */}
          <div className="p-4 bg-agri-gold-light/20 rounded-xl border border-agri-gold/40 text-xs text-agri-text space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-agri-gold-dark flex items-center space-x-1.5">
                <Calculator className="w-4 h-4" />
                <span>Calculated Government MSP Payout:</span>
              </span>
              <span className="font-heading text-xl font-extrabold text-agri-green-dark">
                ₹{calculatedTotal.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-agri-gold/20 font-mono text-xs text-agri-text-muted flex items-center justify-between">
              <span>Verified Formula:</span>
              <strong className="text-agri-green-dark">
                {actualQty} Quintals × ₹{ratePerQuintal.toLocaleString()}/Qtl = ₹{calculatedTotal.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-agri-ivory-muted flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-agri-text-muted hover:bg-agri-ivory transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-2.5 px-6 rounded-xl text-xs transition-all shadow-agri-sm flex items-center space-x-2 hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4 text-agri-gold" />
              <span>Submit & Complete Procurement</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
