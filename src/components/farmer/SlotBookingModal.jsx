import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  X, Calendar, Clock, Wheat, CheckCircle2, AlertTriangle, 
  MapPin, ArrowRight, ArrowLeft, RefreshCw, Ticket, ShieldCheck 
} from 'lucide-react';

export const SlotBookingModal = ({ centre: initialCentre, onClose }) => {
  const { centres, crops, timeSlots, bookSlot, setFarmerTab, lang, getRecommendedCentre } = useDemo();

  const recommendedCentre = getRecommendedCentre(centres);
  const defaultCentre = initialCentre || recommendedCentre || centres[0];

  // Steps: 1: Select Mandi, 2: Select Slot, 3: Crop & Qty, 4: Review, 5: Confirmed
  // If initialCentre was supplied (e.g. clicked from Mandi Discovery), we can start at step 2 (or allow going back to step 1)
  const [currentStep, setCurrentStep] = useState(initialCentre ? 2 : 1);
  const [selectedCentre, setSelectedCentre] = useState(defaultCentre);
  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.name || 'Paddy (Grade A)');
  const [expectedQty, setExpectedQty] = useState(40);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[4]?.time || '11:00 AM - 11:30 AM');
  const [selectedDate, setSelectedDate] = useState('Today (Aug 29, 2026)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const activeCropObj = crops.find(c => c.name === selectedCrop) || crops[0] || { mspRate: 2200 };
  const mspRate = activeCropObj.mspRate || 2200;
  const estimatedGrossPayout = Math.round(Number(expectedQty || 0) * mspRate);

  const handleMandiSelect = (centre) => {
    setSelectedCentre(centre);
    setCurrentStep(2);
  };

  const handleConfirmAndBook = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const created = await bookSlot({
        centreId: selectedCentre.id,
        cropName: selectedCrop,
        slotTime: selectedSlot,
        expectedQty: Number(expectedQty)
      });

      setConfirmedBooking(created);
      setCurrentStep(5); // Show Real Token Confirmation Screen
    } catch (err) {
      console.error('[SlotBooking Error]:', err);
      setErrorMessage(err.message || 'Unable to complete slot booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToTokenPass = () => {
    onClose();
    setFarmerTab('queue');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] rounded-3xl max-w-xl w-full border border-agri-ivory-muted shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-agri-green-dark via-agri-green to-[#1b4d31] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-agri-gold/20 text-agri-gold px-2 py-0.5 rounded border border-agri-gold/30 font-mono">
                {lang === 'hi' ? 'सरकारी खरीद स्लॉट बुकिंग' : 'MSP SLOT REGISTRY'}
              </span>
              {currentStep < 5 && (
                <span className="text-[11px] text-agri-ivory/80 font-mono">
                  {lang === 'hi' ? `चरण ${currentStep}/4` : `Step ${currentStep} of 4`}
                </span>
              )}
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-white mt-1">
              {currentStep === 1 && (lang === 'hi' ? '1. खरीद केंद्र (मंडी) चुनें' : '1. Select Mandi Yard')}
              {currentStep === 2 && (lang === 'hi' ? '2. आगमन समय स्लॉट चुनें' : '2. Select Arrival Time Slot')}
              {currentStep === 3 && (lang === 'hi' ? '3. फसल व अपेक्षित मात्रा दर्ज करें' : '3. Crop & Expected Quantity')}
              {currentStep === 4 && (lang === 'hi' ? '4. बुकिंग विवरण की समीक्षा करें' : '4. Review Booking Summary')}
              {currentStep === 5 && (lang === 'hi' ? '🎉 स्लॉट बुकिंग सफल!' : '🎉 Booking Confirmed!')}
            </h2>
            {selectedCentre && currentStep !== 1 && currentStep !== 5 && (
              <p className="text-xs text-agri-ivory/80 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-agri-gold shrink-0" />
                <span className="truncate">{selectedCentre.name} ({selectedCentre.district})</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-agri-ivory hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">

          {/* ERROR BANNER IF API FAILED */}
          {errorMessage && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-900 space-y-2 animate-in slide-in-from-top duration-200">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-rose-900">
                    {lang === 'hi' ? 'बुकिंग में त्रुटि हुई' : 'Booking Request Failed'}
                  </h4>
                  <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-semibold"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Dismiss'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndBook}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: SELECT MANDI */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-agri-text-muted">
                {lang === 'hi'
                  ? 'उस मंडी का चयन करें जहां आप अपनी फसल बेचना चाहते हैं। कम प्रतीक्षा समय वाली मंडी को प्राथमिकता दी गई है:'
                  : 'Choose the procurement centre where you wish to sell. Recommended centres with lower waiting times are listed first:'}
              </p>

              <div className="space-y-2.5">
                {centres.map((centre) => {
                  const isSelected = selectedCentre?.id === centre.id;
                  const isRec = centre.id === recommendedCentre.id;

                  return (
                    <div
                      key={centre.id}
                      onClick={() => handleMandiSelect(centre)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-agri-green bg-agri-green-soft/70 shadow-md ring-2 ring-agri-green/30'
                          : 'border-agri-ivory-muted bg-white hover:border-agri-green-border hover:bg-agri-ivory/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <h4 className="font-heading font-bold text-sm sm:text-base text-agri-text">
                              {centre.name}
                            </h4>
                            {isRec && (
                              <span className="bg-agri-gold text-agri-green-dark text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                                ⭐ {lang === 'hi' ? 'सुझाया गया' : 'RECOMMENDED'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-agri-text-muted flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-agri-green shrink-0" />
                            <span>{centre.address} • <strong>{centre.distanceKm} km away</strong></span>
                          </p>
                        </div>

                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                          centre.capacityPercent > 80
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {centre.capacityPercent > 80
                            ? (lang === 'hi' ? '🔴 अधिक भीड़' : '🔴 Congested')
                            : (lang === 'hi' ? '🟢 कम भीड़' : '🟢 Fast Line')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-agri-ivory/60 p-2.5 rounded-xl border border-agri-ivory-muted mt-3">
                        <div>
                          <span className="text-[10px] text-agri-text-muted block font-medium">
                            {lang === 'hi' ? 'अनुमानित प्रतीक्षा' : 'Est. Wait'}
                          </span>
                          <strong className="text-agri-gold-dark font-mono text-xs">~{centre.estWaitMinutes} min</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-agri-text-muted block font-medium">
                            {lang === 'hi' ? 'खुले स्लॉट' : 'Open Slots'}
                          </span>
                          <strong className="text-agri-green font-mono text-xs">{centre.availableSlots} free</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-agri-text-muted block font-medium">
                            {lang === 'hi' ? 'सक्रिय काउंटर' : 'Counters'}
                          </span>
                          <strong className="text-agri-text font-mono text-xs">{centre.activeCounters || 4} operational</strong>
                        </div>
                      </div>

                      <div className="pt-2.5 flex justify-end">
                        <span className="text-xs font-bold text-agri-green inline-flex items-center space-x-1">
                          <span>{lang === 'hi' ? 'यह मंडी चुनें' : 'Select Mandi'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATE & TIME SLOT */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Date Toggle */}
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                  {lang === 'hi' ? 'खरीद तिथि चुनें' : 'Select Procurement Date'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['Today (Aug 29, 2026)', 'Tomorrow (Aug 30, 2026)'].map((dateStr) => (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        selectedDate === dateStr
                          ? 'border-2 border-agri-green bg-agri-green-soft text-agri-green-dark shadow-sm ring-1 ring-agri-green'
                          : 'border-agri-ivory-muted bg-white text-agri-text-muted hover:bg-agri-ivory'
                      }`}
                    >
                      📅 {dateStr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-agri-text uppercase tracking-wider">
                    {lang === 'hi' ? 'उपलब्ध समय स्लॉट' : 'Available 30-Min Arrival Windows'}
                  </label>
                  <span className="text-[10px] font-bold text-agri-green">
                    ✓ {lang === 'hi' ? 'कतार गारंटी' : 'Guaranteed Yard Entry'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {timeSlots.map((slot) => {
                    const isFull = slot.status === 'FULL';
                    const isSelected = selectedSlot === slot.time;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isFull
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-2 border-agri-green bg-agri-green-soft text-agri-green-dark shadow-sm ring-1 ring-agri-green'
                            : 'border-agri-ivory-muted bg-white hover:border-agri-green-border text-agri-text'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono">{slot.time}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />}
                        </div>
                        <span className="text-[10px] block mt-1 font-semibold">
                          {isFull ? '🔒 FULL' : `🟢 ${slot.remaining} ${lang === 'hi' ? 'स्लॉट शेष' : 'slots remaining'}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CROP & EXPECTED QUANTITY */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                  {lang === 'hi' ? 'फसल व किस्म चुनें' : 'Select Crop & Variety'}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-3 bg-white border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30"
                >
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.name}>
                      {crop.name} (MSP ₹{crop.mspRate.toLocaleString()}/Qtl)
                    </option>
                  ))}
                </select>
              </div>

              {/* Expected Quantity */}
              <div>
                <label className="block text-xs font-bold text-agri-text mb-1.5 uppercase tracking-wider">
                  {lang === 'hi' ? 'अपेक्षित फसल मात्रा (क्विंटल में)' : 'Expected Harvest Quantity (Quintals)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={expectedQty}
                    onChange={(e) => setExpectedQty(e.target.value)}
                    className="w-full p-3 bg-white border border-agri-ivory-muted rounded-xl text-xs font-bold text-agri-text focus:ring-2 focus:ring-agri-green/30 pr-16"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-agri-text-muted font-bold pointer-events-none">
                    Quintals
                  </span>
                </div>
                <p className="text-[11px] text-agri-text-muted mt-1">
                  {lang === 'hi'
                    ? 'तौल के समय वास्तविक वजन अनुसार अंतिम भुगतान की गणना की जाएगी।'
                    : 'Actual weighment at the mandi yard will determine the final authorized DBT payment.'}
                </p>
              </div>

              {/* Live Formula Callout */}
              <div className="p-3.5 bg-gradient-to-r from-agri-gold-light/25 to-amber-50 rounded-2xl border border-agri-gold/40 text-xs text-agri-text space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>{lang === 'hi' ? 'अनुमानित कुल एमएसपी भुगतान:' : 'Estimated Gross MSP Payout:'}</span>
                  <span className="text-agri-green font-heading text-base font-extrabold font-mono">
                    ₹{estimatedGrossPayout.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-agri-text-muted font-mono">
                  {expectedQty} Quintals × ₹{mspRate.toLocaleString()}/Quintal = ₹{estimatedGrossPayout.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW BOOKING SUMMARY */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-agri-ivory-muted shadow-sm space-y-3">
                <h4 className="font-heading font-bold text-sm text-agri-green flex items-center space-x-1.5 pb-2 border-b border-agri-ivory-muted">
                  <ShieldCheck className="w-4 h-4 text-agri-green" />
                  <span>{lang === 'hi' ? 'सरकारी खरीद बुकिंग सारांश' : 'Official Booking Verification'}</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-agri-text-muted uppercase font-bold block">
                      {lang === 'hi' ? 'खरीद केंद्र' : 'Centre'}
                    </span>
                    <strong className="text-agri-text block mt-0.5">{selectedCentre?.name}</strong>
                    <span className="text-[11px] text-agri-text-muted">{selectedCentre?.address}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-agri-text-muted uppercase font-bold block">
                      {lang === 'hi' ? 'तारीख व समय' : 'Date & Slot'}
                    </span>
                    <strong className="text-agri-green font-mono block mt-0.5">{selectedDate}</strong>
                    <span className="text-[11px] text-agri-text font-bold font-mono">{selectedSlot}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-agri-text-muted uppercase font-bold block">
                      {lang === 'hi' ? 'फसल व किस्म' : 'Crop'}
                    </span>
                    <strong className="text-agri-text block mt-0.5">{selectedCrop}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-agri-text-muted uppercase font-bold block">
                      {lang === 'hi' ? 'अपेक्षित मात्रा' : 'Quantity'}
                    </span>
                    <strong className="text-agri-text font-mono block mt-0.5">{expectedQty} Quintals</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-agri-ivory-muted flex items-center justify-between text-xs bg-agri-ivory/50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-agri-text-muted block font-bold uppercase">
                      {lang === 'hi' ? 'अनुमानित कुल राशि' : 'Est. Total Payout'}
                    </span>
                    <span className="text-sm font-extrabold text-agri-green font-mono">
                      ₹{estimatedGrossPayout.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-agri-text-muted font-mono">
                    @ ₹{mspRate}/Qtl MSP
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <p className="leading-relaxed">
                  ℹ️ {lang === 'hi'
                    ? 'पुष्टि करने पर आपका अनुरोध केंद्रीय किसानसेतु बैकएंड को भेजा जाएगा और एक वास्तविक डिजिटल टोकन पास जारी किया जाएगा।'
                    : 'On confirmation, your booking will be submitted to the central KisanSetu backend and assigned an official token pass.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMED SCREEN (REAL TOKEN DISPLAY) */}
          {currentStep === 5 && confirmedBooking && (
            <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-agri-gold bg-agri-green px-3 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  {lang === 'hi' ? 'आधिकारिक टोकन जारी' : 'OFFICIAL TOKEN ISSUED'}
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-agri-green-dark mt-2 font-mono tracking-tight">
                  {confirmedBooking.token}
                </h3>
                <p className="text-xs text-agri-text-muted mt-1">
                  {lang === 'hi' ? 'डेटाबेस रिकॉर्ड आईडी:' : 'Database Record ID:'}{' '}
                  <span className="font-mono">{confirmedBooking.id?.slice(0, 18)}...</span>
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-white p-4 rounded-2xl border-2 border-agri-gold/50 shadow-sm text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-agri-ivory-muted pb-2">
                  <span className="text-agri-text-muted">{lang === 'hi' ? 'खरीद केंद्र:' : 'Yard Centre:'}</span>
                  <strong className="text-agri-text">{confirmedBooking.centreName}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-agri-ivory-muted pb-2">
                  <span className="text-agri-text-muted">{lang === 'hi' ? 'समय स्लॉट:' : 'Slot Window:'}</span>
                  <strong className="text-agri-green font-mono">{confirmedBooking.slotTime}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-agri-ivory-muted pb-2">
                  <span className="text-agri-text-muted">{lang === 'hi' ? 'फसल व मात्रा:' : 'Crop & Weight:'}</span>
                  <strong className="text-agri-text">{confirmedBooking.crop} ({confirmedBooking.expectedQty} Qtl)</strong>
                </div>

                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-agri-text-muted">{lang === 'hi' ? 'आवंटित काउंटर:' : 'Gate Counter:'}</span>
                  <strong className="bg-agri-gold/20 text-agri-green-dark px-2 py-0.5 rounded font-mono font-bold">
                    {confirmedBooking.counter || 'Counter 2'}
                  </strong>
                </div>
              </div>

              {/* Action Buttons on Step 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-agri-ivory hover:bg-agri-ivory-muted text-agri-text font-bold rounded-xl text-xs transition-colors border border-agri-ivory-muted"
                >
                  {lang === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}
                </button>
                <button
                  type="button"
                  onClick={handleGoToTokenPass}
                  className="py-3 px-4 bg-agri-green hover:bg-agri-green-dark text-white font-extrabold rounded-xl text-xs transition-all shadow-agri-sm flex items-center justify-center space-x-1.5"
                >
                  <Ticket className="w-4 h-4 text-agri-gold" />
                  <span>{lang === 'hi' ? 'टोकन पास देखें' : 'View in Token Pass'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Bar (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="p-4 bg-agri-ivory/60 border-t border-agri-ivory-muted flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-agri-text-muted hover:bg-agri-ivory border border-agri-ivory-muted flex items-center space-x-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'hi' ? 'पीछे' : 'Back'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-agri-text-muted hover:bg-agri-ivory transition-colors"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-agri-green hover:bg-agri-green-dark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-agri-sm flex items-center space-x-1.5"
              >
                <span>{lang === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmAndBook}
                className="bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-3 px-6 rounded-xl text-xs transition-all shadow-agri-md flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-agri-gold" />
                    <span>{lang === 'hi' ? 'रजिस्ट्री में दर्ज हो रहा है...' : 'Booking in Registry...'}</span>
                  </>
                ) : (
                  <>
                    <Wheat className="w-4 h-4 text-agri-gold" />
                    <span>{lang === 'hi' ? 'पुष्टि करें और टोकन जारी करें' : 'Confirm & Issue Real Token'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
