import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  X, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  AlertCircle,
  Sun,
  Loader2,
  Cpu,
  Check,
  Wheat,
  Info
} from 'lucide-react';
import { validateQualityParameters } from '../../lib/qualitySpecs';

export const ActiveProcurementModal = ({ tokenItem, onClose }) => {
  const { completeProcurement, sendToDryingYard } = useDemo();

  // Digital Weighbridge Fetch State (Starts strictly un-fetched / empty)
  const [isFetchingIot, setIsFetchingIot] = useState(false);
  const [iotFetched, setIotFetched] = useState(false);
  const [fetchTimestamp, setFetchTimestamp] = useState(null);

  // Read-Only Measured Net Weight & Crop Grade (null before fetch)
  const [actualQty, setActualQty] = useState(null);
  const [qualityGrade, setQualityGrade] = useState(tokenItem?.qualityGrade || 'Grade A');
  
  // Quality Readings (All null / empty before fetch)
  const [qualityReadings, setQualityReadings] = useState({
    moisturePercent: null,
    inorganicDust: null,
    organicChaff: null,
    foreignMatter: null,
    damagedGrains: null,
    immatureGrains: null,
    admixture: null,
    weevilledGrains: null
  });

  const [validationError, setValidationError] = useState('');

  const ratePerQuintal = tokenItem?.ratePerQuintal || 2200;
  const calculatedTotal = (iotFetched && actualQty) ? Math.round(Number(actualQty) * ratePerQuintal) : 0;

  // Evaluate quality parameters only when fetched
  const isMoistureFailed = iotFetched && qualityReadings.moisturePercent != null && qualityReadings.moisturePercent > 17.0;

  // Simulated 2-Second Hardware Telemetry Fetch
  const handleFetchFromWeighbridge = () => {
    setIsFetchingIot(true);
    setValidationError('');

    setTimeout(() => {
      const simulatedWeight = tokenItem?.expectedQty ? Number(tokenItem.expectedQty).toFixed(2) : '40.00';
      const simulatedMoisture = tokenItem?.moisturePercent ?? 14.5;

      setActualQty(simulatedWeight);
      setQualityReadings({
        moisturePercent: simulatedMoisture,
        inorganicDust: 1.2,
        organicChaff: 0.6,
        foreignMatter: 1.8,
        damagedGrains: 0.8,
        immatureGrains: 1.1,
        admixture: 0.5,
        weevilledGrains: 0.2
      });
      setIsFetchingIot(false);
      setIotFetched(true);
      setFetchTimestamp('Just now');
    }, 2000);
  };

  // Holding Yard / Sun Drying Dispatch Handler (Moisture > 17%)
  const handleSendToDryingYard = () => {
    if (!tokenItem || !iotFetched) return;
    sendToDryingYard(tokenItem.token, qualityReadings.moisturePercent);
    onClose();
  };

  // Complete Procurement Submission Handler
  const handleComplete = (e) => {
    e.preventDefault();
    if (!tokenItem) return;

    if (!iotFetched) {
      setValidationError('Please fetch telemetry from the Digital Weighbridge before approving procurement.');
      return;
    }

    if (isMoistureFailed) {
      setValidationError(`Moisture level (${qualityReadings.moisturePercent}%) exceeds 17.0% maximum limit. Produce must be transferred to the Drying Yard.`);
      return;
    }

    if (!actualQty || Number(actualQty) <= 0) {
      setValidationError('Verified weight must be greater than 0 Quintals.');
      return;
    }
    
    completeProcurement({
      tokenStr: tokenItem.token,
      actualQty: Number(actualQty),
      moisturePercent: Number(qualityReadings.moisturePercent),
      qualityGrade,
      qualityParameters: {
        ...qualityReadings,
        allPassed: !isMoistureFailed,
        inspectedAt: new Date().toISOString()
      }
    });
    onClose();
  };

  if (!tokenItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div 
        className="bg-[#FFFDF7] rounded-3xl max-w-2xl w-full border border-agri-ivory-muted shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-agri-green-dark text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-extrabold text-lg font-mono shadow-agri-sm">
              {tokenItem.token}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold text-agri-gold tracking-widest block font-mono">
                  MANDI PROCUREMENT DESK
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                  {tokenItem.counter || 'Counter 2'} • Active
                </span>
              </div>
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

        {/* Inspection Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* Booking Summary Strip */}
          <div className="bg-agri-ivory/80 p-3 rounded-2xl border border-agri-ivory-muted grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Crop Offered</span>
              <p className="font-bold text-agri-text mt-0.5">{tokenItem.crop}</p>
            </div>
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Declared Tonnage</span>
              <p className="font-bold text-agri-text mt-0.5 font-mono">{tokenItem.expectedQty} Qtl</p>
            </div>
            <div>
              <span className="text-[10px] text-agri-text-muted uppercase font-bold block">Assigned Scale</span>
              <p className="font-bold text-agri-green mt-0.5 font-mono">{tokenItem.counter || 'Scale 02'}</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* UNIFIED SECTION: PROCUREMENT QUALITY ASSESSMENT                           */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-agri-ivory-muted p-4 sm:p-5 shadow-sm space-y-4">
            
            {/* Top Bar: Section Title & Fetch Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-agri-ivory-muted">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-agri-green-dark flex items-center space-x-1.5 font-mono">
                  <Scale className="w-4 h-4 text-agri-gold" />
                  <span>PROCUREMENT QUALITY ASSESSMENT</span>
                </h4>
                <p className="text-[11px] text-agri-text-muted mt-0.5">
                  Automated digital weighment & physical grain quality evaluation
                </p>
              </div>

              {/* Action: Fetch from Digital Weighbridge */}
              <button
                type="button"
                onClick={handleFetchFromWeighbridge}
                disabled={isFetchingIot}
                className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 shrink-0 disabled:opacity-60 cursor-pointer self-start sm:self-auto hover:scale-[1.02]"
              >
                {isFetchingIot ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-agri-green-dark" />
                    <span>Fetching Digital Weighbridge...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>📡 Fetch from Digital Weighbridge</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated Loading Indicator */}
            {isFetchingIot && (
              <div className="p-3 bg-agri-ivory/60 rounded-xl border border-agri-gold/30 text-xs text-agri-green-dark font-mono flex items-center space-x-2 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-agri-gold shrink-0" />
                <span>Synchronizing hardware telemetry with Digital Weighbridge Scale #02...</span>
              </div>
            )}

            {/* 1. Digital Measurements (Weight & Moisture) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-agri-text uppercase tracking-wider">
                  Digital Measurements
                </span>
                {iotFetched && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-in fade-in duration-300">
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    <span>✓ Digital Weighbridge • {fetchTimestamp}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Read-Only Weight Display */}
                <div className="p-3 bg-agri-ivory/60 rounded-xl border border-agri-ivory-muted space-y-1">
                  <span className="text-[10px] font-bold text-agri-text-muted uppercase block">
                    Weight
                  </span>
                  <div className="font-mono text-xl font-extrabold text-agri-text">
                    {isFetchingIot ? (
                      <span className="text-sm font-sans font-medium text-agri-text-muted flex items-center space-x-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-agri-gold" />
                        <span>Reading...</span>
                      </span>
                    ) : iotFetched ? (
                      `${Number(actualQty).toFixed(2)} Qtl`
                    ) : (
                      '— — — Qtl'
                    )}
                  </div>
                  {iotFetched ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block font-mono animate-in fade-in">
                      ✓ Digital Reading
                    </span>
                  ) : (
                    <span className="text-[10px] text-agri-text-muted block">
                      Awaiting digital weighbridge reading
                    </span>
                  )}
                </div>

                {/* Read-Only Moisture Display */}
                <div className={`p-3 rounded-xl border space-y-1 transition-all ${
                  isMoistureFailed
                    ? 'bg-rose-50/80 border-rose-300'
                    : 'bg-agri-ivory/60 border-agri-ivory-muted'
                }`}>
                  <span className="text-[10px] font-bold text-agri-text-muted uppercase block">
                    Moisture
                  </span>
                  <div className={`font-mono text-xl font-extrabold ${
                    isMoistureFailed ? 'text-rose-700' : 'text-agri-text'
                  }`}>
                    {isFetchingIot ? (
                      <span className="text-sm font-sans font-medium text-agri-text-muted flex items-center space-x-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-agri-gold" />
                        <span>Reading...</span>
                      </span>
                    ) : iotFetched ? (
                      `${qualityReadings.moisturePercent}%`
                    ) : (
                      '— — — %'
                    )}
                  </div>
                  {iotFetched ? (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border inline-block font-mono animate-in fade-in ${
                      isMoistureFailed
                        ? 'text-rose-900 bg-rose-100 border-rose-300'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}>
                      {isMoistureFailed ? '🔴 Above 17% Limit' : '✓ Within Limit'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-agri-text-muted block">
                      Awaiting moisture sensor reading
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* 2. Physical Quality Parameters */}
            <div className="space-y-2 pt-2 border-t border-agri-ivory-muted">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-agri-text uppercase tracking-wider flex items-center space-x-1.5">
                  <Wheat className="w-3.5 h-3.5 text-agri-green" />
                  <span>Physical Quality Parameters</span>
                </span>
                <span className="text-[10px] text-agri-text-muted font-mono font-bold">
                  DoCA FAQ Standard
                </span>
              </div>

              <div className="bg-agri-ivory/40 rounded-xl border border-agri-ivory-muted divide-y divide-agri-ivory-muted text-xs">
                
                {/* Foreign Matter */}
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-agri-text block">Foreign Matter</span>
                    <span className="text-[10px] text-agri-text-muted">
                      {iotFetched ? `Inorganic / Dust: ${qualityReadings.inorganicDust}% • Organic / Chaff: ${qualityReadings.organicChaff}%` : 'Inorganic / Dust & Organic / Chaff'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-agri-text text-xs">
                      {iotFetched ? `${qualityReadings.foreignMatter}%` : '— — — %'}
                    </span>
                    <span className="text-[10px] text-agri-text-muted block">(Max ≤ 2.0%)</span>
                  </div>
                </div>

                {/* Damaged and Discoloured Grains */}
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-agri-text block">Damaged and Discoloured Grains</span>
                    <span className="text-[10px] text-agri-text-muted">Heat-damaged & discoloured kernels</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-agri-text text-xs">
                      {iotFetched ? `${qualityReadings.damagedGrains}%` : '— — — %'}
                    </span>
                    <span className="text-[10px] text-agri-text-muted block">(Max ≤ 3.0%)</span>
                  </div>
                </div>

                {/* Shrivelled and Immature Grains */}
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-agri-text block">Shrivelled and Immature Grains</span>
                    <span className="text-[10px] text-agri-text-muted">Immature & underdeveloped kernels</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-agri-text text-xs">
                      {iotFetched ? `${qualityReadings.immatureGrains}%` : '— — — %'}
                    </span>
                    <span className="text-[10px] text-agri-text-muted block">(Max ≤ 3.0%)</span>
                  </div>
                </div>

                {/* Admixture */}
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-agri-text block">Admixture</span>
                    <span className="text-[10px] text-agri-text-muted">Presence of lower-grade crop varieties</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-agri-text text-xs">
                      {iotFetched ? `${qualityReadings.admixture}%` : '— — — %'}
                    </span>
                    <span className="text-[10px] text-agri-text-muted block">(Max ≤ 5.0%)</span>
                  </div>
                </div>

                {/* Weevilled Grains */}
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-agri-text block">Weevilled Grains</span>
                    <span className="text-[10px] text-agri-text-muted">Insect-damaged grains</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-agri-text text-xs">
                      {iotFetched ? `${qualityReadings.weevilledGrains}%` : '— — — %'}
                    </span>
                    <span className="text-[10px] text-agri-text-muted block">(Max ≤ 1.0%)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Overall Quality Assessment Decision */}
            <div className="pt-2 border-t border-agri-ivory-muted">
              {!iotFetched ? (
                <div className="p-3 bg-agri-ivory/50 border border-agri-ivory-muted rounded-xl text-xs flex items-center space-x-2 text-agri-text-muted">
                  <Info className="w-4 h-4 text-agri-text-muted shrink-0" />
                  <span>Awaiting digital measurement from weighbridge and moisture sensor.</span>
                </div>
              ) : isMoistureFailed ? (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2 text-rose-800 font-extrabold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>🔴 Quality Assessment: Procurement Suspended</span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-normal">
                    Moisture measured at <strong>{qualityReadings.moisturePercent}%</strong> exceeds the 17.0% maximum permissible limit. Grains must be aerated in the Mandi Drying Yard before purchase can proceed.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>🟢 Quality Assessment: Acceptable (Moisture {qualityReadings.moisturePercent}% ≤ 17.0%)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Ready to Approve
                  </span>
                </div>
              )}
            </div>

          </div>

          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Government MSP Payout Preview */}
          <div className="p-3.5 bg-agri-gold-light/20 rounded-2xl border border-agri-gold/40 text-xs text-agri-text flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-agri-gold-dark flex items-center space-x-1 font-mono text-[11px] uppercase">
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculated Government MSP Payout</span>
              </span>
              <span className="text-[11px] text-agri-text-muted font-mono block">
                {iotFetched ? `${actualQty} Qtl × ₹${ratePerQuintal.toLocaleString()}/Qtl` : 'Awaiting verified net weight'}
              </span>
            </div>
            <span className="font-heading text-xl font-extrabold text-agri-green-dark font-mono">
              {iotFetched ? `₹${calculatedTotal.toLocaleString()}` : '— — —'}
            </span>
          </div>

          {/* Actions Footer */}
          <div className="pt-2 border-t border-agri-ivory-muted flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-agri-text-muted hover:bg-agri-ivory transition-colors text-center"
            >
              Cancel
            </button>

            {/* If not fetched yet */}
            {!iotFetched ? (
              <button
                type="button"
                disabled
                className="bg-gray-200 text-gray-400 font-bold py-2.5 px-5 rounded-xl text-xs cursor-not-allowed opacity-75 flex items-center justify-center space-x-1"
                title="Awaiting digital weighbridge reading"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Procurement</span>
              </button>
            ) : isMoistureFailed ? (
              /* If Moisture exceeds 17%, disable approve button and reveal Send to Drying Yard button */
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="bg-gray-200 text-gray-400 font-bold py-2.5 px-4 rounded-xl text-xs cursor-not-allowed opacity-60 flex items-center justify-center space-x-1"
                  title="Disabled: Moisture exceeds 17.0% maximum threshold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Procurement (Disabled)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToDryingYard}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer hover:scale-[1.02]"
                >
                  <Sun className="w-4 h-4 text-amber-950" />
                  <span>☀️ Send to Drying Yard</span>
                </button>
              </div>
            ) : (
              /* Normal approval flow */
              <button
                type="button"
                onClick={handleComplete}
                className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-2.5 px-5 rounded-xl text-xs transition-all shadow-agri-sm flex items-center justify-center space-x-1.5 hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-agri-gold" />
                <span>Approve Procurement</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};



