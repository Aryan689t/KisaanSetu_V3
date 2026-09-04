import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  X, UserPlus, Phone, MapPin, Wheat, Scale, 
  CheckCircle2, Printer, MessageSquare, Ticket, AlertCircle, ShieldCheck
} from 'lucide-react';
import { sanitizePersonName, isValidPersonName, sanitizeMobile, isValidMobile, sanitizeAadhaarLast4, isValidAadhaarLast4 } from '../../lib/validation';

export const AssistedBookingModal = ({ onClose }) => {
  const { centres, crops, timeSlots, bookSlot, queueItems } = useDemo();

  const [farmerName, setFarmerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('5921');
  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.name || 'Paddy (Grade A)');
  const [expectedQty, setExpectedQty] = useState(40);
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0]?.id || 'cnt-sonipat');
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]?.time || '08:00 AM - 08:30 AM');
  const [assignedCounter, setAssignedCounter] = useState('Counter 2');
  const [bookingType, setBookingType] = useState('WALK_IN'); // WALK_IN or ASSISTED
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedToken, setConfirmedToken] = useState(null);
  const [smsSimulated, setSmsSimulated] = useState(false);
  const [printSimulated, setPrintSimulated] = useState(false);

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const activeCropObj = crops.find(c => c.name === selectedCrop) || crops[0] || { mspRate: 2200 };
  const estimatedPayout = Math.round(Number(expectedQty || 0) * (activeCropObj.mspRate || 2200));

  const handleCreateAssistedBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidPersonName(farmerName)) {
      setErrorMsg('Please enter a valid farmer name (letters and spaces only, 2-60 characters).');
      return;
    }

    if (mobile && !isValidMobile(mobile)) {
      setErrorMsg('Please enter a valid 10-digit mobile number (starting with 6-9).');
      return;
    }

    if (aadhaarLast4 && !isValidAadhaarLast4(aadhaarLast4)) {
      setErrorMsg('Please enter valid 4 digits of Aadhaar.');
      return;
    }

    if (!expectedQty || Number(expectedQty) <= 0) {
      setErrorMsg('Please enter a valid crop quantity.');
      return;
    }

    setIsSubmitting(true);

    try {
      const slotTimeCombined = `Today (Spot Entry) • ${selectedSlot}`;
      const result = await bookSlot({
        centreId: selectedCentreId,
        farmerName: farmerName.trim(),
        mobile: mobile.trim() || '+91 98000 00000',
        aadhaarLast4: aadhaarLast4.trim() || '4821',
        cropName: selectedCrop,
        expectedQty: Number(expectedQty),
        slotTime: slotTimeCombined,
        bookingType,
        status: 'CHECKED_IN', // Walk-in farmers at gate are checked in immediately
        counter: assignedCounter
      });

      setConfirmedToken(result);
    } catch (err) {
      console.error('[AssistedBooking Error]:', err);
      setErrorMsg(err.message || 'Failed to issue spot token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateSms = () => {
    setSmsSimulated(true);
  };

  const handleSimulatePrint = () => {
    setPrintSimulated(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-200">
      <div 
        className="bg-[#FFFDF7] rounded-3xl max-w-xl w-full border border-agri-ivory-muted shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-agri-green-dark to-[#18492c] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-agri-gold tracking-widest block font-mono">
                OPERATOR DESK • ASSISTED / WALK-IN REGISTRATION
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                Issue On-Spot Gate Token
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-agri-ivory/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Confirmation View */}
        {!confirmedToken ? (
          <form onSubmit={handleCreateAssistedBooking} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {/* Quick Context Advisory */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>Assisted Token Mode:</strong> Use this desk flow to register walk-in farmers without smartphones. The generated token instantly enters the live procurement queue.
              </p>
            </div>

            {/* Farmer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                  Farmer Full Name (Letters only) *
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={farmerName}
                  onChange={(e) => {
                    setFarmerName(sanitizePersonName(e.target.value));
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. Gurdeep Singh"
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-sm font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                  Mobile Number (10 digits, Optional)
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(sanitizeMobile(e.target.value));
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="9812345678"
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-sm font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                />
                <span className="text-[10px] text-agri-text-muted block mt-0.5">Used for SMS gate token dispatch</span>
              </div>
            </div>

            {/* Crop & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                  Crop *
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                >
                  {crops.map(c => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                  Est. Quantity (Qtl) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="500"
                  value={expectedQty}
                  onChange={(e) => setExpectedQty(e.target.value)}
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-xs font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                  Aadhaar Last 4
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={4}
                  value={aadhaarLast4}
                  onChange={(e) => {
                    setAadhaarLast4(sanitizeAadhaarLast4(e.target.value));
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-xs font-bold font-mono text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                />
              </div>
            </div>

            {/* Centre & Counter Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                  Procurement Mandi Yard *
                </label>
                <select
                  value={selectedCentreId}
                  onChange={(e) => setSelectedCentreId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-agri-text mb-1 uppercase tracking-wider">
                  Assign Inspection Counter *
                </label>
                <select
                  value={assignedCounter}
                  onChange={(e) => setAssignedCounter(e.target.value)}
                  className="w-full p-2.5 bg-white border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green font-mono"
                >
                  <option value="Counter 1">Counter 1 (Weighbridge North)</option>
                  <option value="Counter 2">Counter 2 (Weighbridge Main)</option>
                  <option value="Counter 3">Counter 3 (Weighbridge East)</option>
                  <option value="Counter 4">Counter 4 (Weighbridge Express)</option>
                </select>
              </div>
            </div>

            {/* Registration Source Tag */}
            <div className="p-3 bg-agri-ivory/60 rounded-2xl border border-agri-ivory-muted flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-agri-green" />
                <span className="font-bold text-agri-text">Token Source:</span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold text-[10px] font-mono border border-amber-300">
                  WALK_IN (Assisted Gate Desk)
                </span>
              </div>
              <span className="font-mono text-agri-green font-extrabold text-xs">
                Est. Payout: ₹{estimatedPayout.toLocaleString()}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold">
                {errorMsg}
              </div>
            )}

            {/* Actions */}
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
                disabled={isSubmitting}
                className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-2.5 px-6 rounded-xl text-xs transition-all shadow-agri-sm flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4 text-agri-gold" />
                <span>{isSubmitting ? 'Generating Token...' : 'Generate & Issue Spot Token'}</span>
              </button>
            </div>

          </form>
        ) : (
          /* Token Confirmation & Gate Slip Preview */
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            
            <div className="text-center space-y-1">
              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 font-mono inline-block">
                ✓ SPOT TOKEN ISSUED & CHECKED-IN
              </span>
              <h3 className="font-heading text-xl font-bold text-agri-text">
                Gate Pass Generated for {confirmedToken.farmerName || farmerName}
              </h3>
            </div>

            {/* Official Printable Slip Card */}
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-agri-green-border shadow-sm space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-sans">Official Token Pass</span>
                  <span className="text-2xl font-extrabold text-agri-green-dark">
                    {confirmedToken.token}
                  </span>
                </div>
                <div className="text-right font-sans">
                  <span className="text-[10px] text-gray-400 block">Status</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {confirmedToken.status || 'CHECKED_IN'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                <div>
                  <span className="text-gray-400 block text-[10px]">Farmer</span>
                  <strong>{confirmedToken.farmerName || farmerName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Mobile</span>
                  <strong>{confirmedToken.mobile || mobile || '+91 98000 00000'}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Centre</span>
                  <strong>{selectedCentre.name}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Assigned Station</span>
                  <strong className="text-agri-green-dark font-mono">{confirmedToken.counter || assignedCounter}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Crop & Quantity</span>
                  <strong>{confirmedToken.crop || selectedCrop} • {confirmedToken.expectedQty || expectedQty} Qtl</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Source</span>
                  <strong className="text-amber-800">Walk-In (Assisted Desk)</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>BARCODE: ||| | |||| | ||||| | |||</span>
                <span>DoCA APMC REGISTRY</span>
              </div>
            </div>

            {/* Interactive Demonstration Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleSimulatePrint}
                className="p-3 bg-agri-ivory hover:bg-agri-ivory-muted text-agri-green-dark font-bold rounded-2xl border border-agri-ivory-muted flex items-center justify-center space-x-2 text-xs transition-colors"
              >
                <Printer className="w-4 h-4 text-agri-green" />
                <span>{printSimulated ? '✓ Gate Slip Printed' : 'Print Physical Gate Slip'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateSms}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-2xl border border-amber-300 flex items-center justify-center space-x-2 text-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-amber-700" />
                <span>{smsSimulated ? '✓ SMS Dispatched' : 'Simulate Send SMS Token'}</span>
              </button>
            </div>

            {/* Simulated SMS Toast Preview */}
            {smsSimulated && (
              <div className="p-3 bg-gray-900 text-gray-100 rounded-2xl text-xs space-y-1 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>📱 SMS GATEWAY DISPATCH</span>
                  <span>DELIVERED NOW</span>
                </div>
                <p className="font-mono text-[11px] text-emerald-300">
                  "KisanSetu: Token {confirmedToken.token} issued for {farmerName}. Yard: {selectedCentre.name.split(' ')[0]}. Station: {confirmedToken.counter || assignedCounter}. Gate entry verified. Payout via DBT post-weighment."
                </p>
              </div>
            )}

            {/* Done Action */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-2.5 px-6 rounded-xl text-xs transition-all shadow-agri-sm"
              >
                Done • Return to Live Queue
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
