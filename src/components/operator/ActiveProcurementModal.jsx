import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, Scale, ShieldCheck, CheckCircle2, Calculator, AlertTriangle, Building2, AlertCircle } from 'lucide-react';
import { PADDY_QUALITY_SPECIFICATIONS, validateQualityParameters } from '../../lib/qualitySpecs';

export const ActiveProcurementModal = ({ tokenItem, onClose }) => {
  const { completeProcurement } = useDemo();

  const [actualQty, setActualQty] = useState(tokenItem?.actualQty || 38.5);
  const [qualityGrade, setQualityGrade] = useState(tokenItem?.qualityGrade || 'Grade A');
  
  // 6 Official Quality Parameters State
  const [qualityReadings, setQualityReadings] = useState({
    moisturePercent: tokenItem?.qualityParameters?.moisturePercent ?? tokenItem?.moisturePercent ?? 14.2,
    foreignMatter: tokenItem?.qualityParameters?.foreignMatter ?? 1.2,
    damagedGrains: tokenItem?.qualityParameters?.damagedGrains ?? 2.4,
    chalkyGrains: tokenItem?.qualityParameters?.chalkyGrains ?? 3.0,
    admixture: tokenItem?.qualityParameters?.admixture ?? 4.0,
    immatureGrains: tokenItem?.qualityParameters?.immatureGrains ?? 1.5
  });

  const [validationError, setValidationError] = useState('');

  const ratePerQuintal = tokenItem?.ratePerQuintal || 2200;
  const calculatedTotal = Math.round(Number(actualQty || 0) * ratePerQuintal);

  // Evaluate quality parameters
  const { evaluated, failing, allPassed } = validateQualityParameters(qualityReadings);

  const handleParamChange = (id, val) => {
    setQualityReadings(prev => ({
      ...prev,
      [id]: val === '' ? '' : Number(val)
    }));
    if (validationError) setValidationError('');
  };

  const handleComplete = (e) => {
    e.preventDefault();
    if (!tokenItem) return;

    if (!allPassed) {
      const failNames = failing.map(f => `${f.name} (${qualityReadings[f.id]}% > ${f.maxLimit}%)`).join(', ');
      setValidationError(`Cannot complete procurement: The following quality parameters exceed permissible limits: ${failNames}.`);
      return;
    }

    if (!actualQty || Number(actualQty) <= 0) {
      setValidationError('Actual verified weight must be greater than 0 Quintals.');
      return;
    }
    
    completeProcurement({
      tokenStr: tokenItem.token,
      actualQty: Number(actualQty),
      moisturePercent: Number(qualityReadings.moisturePercent),
      qualityGrade,
      qualityParameters: {
        moisturePercent: Number(qualityReadings.moisturePercent),
        foreignMatter: Number(qualityReadings.foreignMatter),
        damagedGrains: Number(qualityReadings.damagedGrains),
        chalkyGrains: Number(qualityReadings.chalkyGrains),
        admixture: Number(qualityReadings.admixture),
        immatureGrains: Number(qualityReadings.immatureGrains),
        allPassed: true,
        inspectedAt: new Date().toISOString()
      }
    });
    onClose();
  };

  if (!tokenItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div 
        className="bg-[#FFFDF7] rounded-3xl max-w-2xl w-full border border-agri-ivory-muted shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-agri-green-dark text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-extrabold text-lg font-mono shadow-agri-sm">
              {tokenItem.token}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-agri-gold tracking-widest block font-mono">
                WEIGHBRIDGE & QUALITY LOG • COUNTER 2
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {tokenItem.farmerName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-agri-ivory/80 hover:text-white hover:bg-agri-green/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inspection Form */}
        <form onSubmit={handleComplete} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Booking Summary Strip */}
          <div className="bg-agri-ivory/80 p-3.5 rounded-2xl border border-agri-ivory-muted grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Crop Offered</span>
              <p className="font-bold text-agri-text mt-0.5">{tokenItem.crop}</p>
            </div>
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Expected Qty</span>
              <p className="font-bold text-agri-text mt-0.5 font-mono">{tokenItem.expectedQty} Quintals</p>
            </div>
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Assigned Station</span>
              <p className="font-bold text-agri-green mt-0.5 font-mono">{tokenItem.counter || 'Counter 2'}</p>
            </div>
          </div>

          {/* SECTION 1: WEIGHBRIDGE & GRADE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                Actual Net Weight (Quintals) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="500"
                  value={actualQty}
                  onChange={(e) => setActualQty(e.target.value)}
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-sm font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-agri-text-muted font-bold font-mono">Qtl</span>
              </div>
              <span className="text-[10px] text-agri-text-muted block mt-1">Verified on electronic weighbridge</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                Quality Grade *
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-sm font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
              >
                <option value="Grade A">Grade A (FAQ Premium — ₹2,200/Qtl)</option>
                <option value="Common">Common Grade (Standard — ₹2,183/Qtl)</option>
                <option value="Grade B">Grade B (Fair Average Quality)</option>
              </select>
              <span className="text-[10px] text-agri-text-muted block mt-1">Official DoCA categorization</span>
            </div>
          </div>

          {/* SECTION 2: OFFICIAL PADDY QUALITY PARAMETERS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-agri-text flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-agri-green" />
                  <span>Mandatory Paddy Quality Parameters (FAQ)</span>
                </h4>
                <p className="text-[11px] text-agri-text-muted">
                  Verify laboratory / moisture meter test readings against maximum permissible limits.
                </p>
              </div>

              {allPassed ? (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 font-mono inline-flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ALL PASSED</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-full border border-red-300 font-mono inline-flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>{failing.length} FAILED</span>
                </span>
              )}
            </div>

            {/* Quality Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evaluated.map((param) => {
                const isPass = param.isPass;

                return (
                  <div 
                    key={param.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isPass 
                        ? 'bg-white border-agri-ivory-muted' 
                        : 'bg-red-50/70 border-red-300 ring-1 ring-red-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-agri-text block">
                          {param.name}
                        </span>
                        <span className="text-[10px] text-agri-text-muted font-mono block">
                          Limit: &le; {param.maxLimit}%
                        </span>
                      </div>

                      {/* Pass / Fail Badge */}
                      {isPass ? (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center space-x-1 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Pass</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-300 inline-flex items-center space-x-1 font-mono">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span>Fail (&gt;{param.maxLimit}%)</span>
                        </span>
                      )}
                    </div>

                    {/* Numeric Input */}
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={qualityReadings[param.id] ?? ''}
                          onChange={(e) => handleParamChange(param.id, e.target.value)}
                          className={`w-full p-2 rounded-xl text-xs font-bold font-mono focus:ring-2 ${
                            isPass 
                              ? 'bg-agri-ivory/50 border border-agri-ivory-muted text-agri-text focus:ring-agri-green/30 focus:border-agri-green'
                              : 'bg-white border-2 border-red-500 text-red-900 focus:ring-red-200 focus:border-red-600'
                          }`}
                          required
                        />
                        <span className="absolute right-2.5 top-2 text-xs font-bold font-mono text-agri-text-muted">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAILING QUALITY PARAMETERS WARNING BANNER */}
          {!allPassed && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-1.5 animate-in fade-in duration-200">
              <div className="font-bold flex items-center space-x-1.5 text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Quality Inspection Threshold Exceeded — Cannot Approve Procurement:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-800 font-medium pl-1">
                {failing.map((f) => (
                  <li key={f.id}>
                    <strong>{f.name}</strong>: recorded {qualityReadings[f.id]}% (exceeds maximum allowed limit of {f.maxLimit}% by {f.exceededBy}%)
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-red-700 italic pt-1 border-t border-red-200">
                Please re-test sample or advise farmer to perform yard cleaning / drying before weighment.
              </p>
            </div>
          )}

          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
              {validationError}
            </div>
          )}

          {/* Transparent Live Calculation Preview */}
          <div className="p-4 bg-agri-gold-light/20 rounded-2xl border border-agri-gold/40 text-xs text-agri-text space-y-2">
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
                {actualQty || 0} Quintals × ₹{ratePerQuintal.toLocaleString()}/Qtl = ₹{calculatedTotal.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-3 border-t border-agri-ivory-muted flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-agri-text-muted hover:bg-agri-ivory transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!allPassed}
              className={`font-extrabold py-2.5 px-6 rounded-xl text-xs transition-all shadow-agri-sm flex items-center space-x-2 ${
                allPassed
                  ? 'bg-agri-green hover:bg-agri-green-dark text-white hover:scale-[1.02] cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-75'
              }`}
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
