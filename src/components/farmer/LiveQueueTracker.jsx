import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  CheckCircle2, 
  RefreshCw, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Scale, 
  CreditCard,
  Building2
} from 'lucide-react';
import { fetchQueuePosition } from '../../lib/apiService';
import { MandiCongestionBanner } from '../ui/MandiCongestionBanner';

export const LiveQueueTracker = () => {
  const { queueItems, activeBooking, farmerBookings = [], selectActiveBooking, lang, centres } = useDemo();
  const [livePosition, setLivePosition] = useState(null);
  const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);

  const currentCentre = centres.find(c => c.id === activeBooking?.centreId) || centres[0];
  const youTokenIndex = queueItems.findIndex(q => q.token === activeBooking?.token);

  // Real backend queue position query with graceful fallback
  const loadQueuePosition = async () => {
    if (!activeBooking?.token || !currentCentre?.id) return;
    setIsRefreshingQueue(true);
    try {
      const res = await fetchQueuePosition(currentCentre.id, activeBooking.token);
      if (res?.success && res?.data) {
        setLivePosition(res.data);
      }
    } catch (err) {
      console.debug('[LiveQueueTracker] Live position API sync:', err.message);
    } finally {
      setIsRefreshingQueue(false);
    }
  };

  useEffect(() => {
    loadQueuePosition();
  }, [activeBooking?.token, currentCentre?.id, queueItems]);

  const farmersAheadCount = livePosition?.farmersAhead != null
    ? livePosition.farmersAhead
    : Math.max(0, youTokenIndex);

  const estWaitMins = livePosition?.estWaitMinutes != null
    ? livePosition.estWaitMinutes
    : Math.max(8, farmersAheadCount * 8);

  const isCompleted = activeBooking?.status === 'COMPLETED';
  const isDisbursed = activeBooking?.paymentStatus === 'DISBURSED';
  const isProcessing = activeBooking?.status === 'PROCESSING';
  const isCheckedIn = activeBooking?.status === 'CHECKED_IN';
  const isWaiting = !isCheckedIn && !isProcessing && !isCompleted;

  // Determine active step index: 0 = Booked, 1 = Checked-In, 2 = Weighed/Inspected, 3 = Payment Disbursed
  const currentStepIndex = isDisbursed || isCompleted ? 3 : isProcessing ? 2 : isCheckedIn ? 1 : 0;

  const steps = [
    {
      id: 'booked',
      title: lang === 'hi' ? 'स्लॉट बुक हुआ' : 'Slot Confirmed',
      desc: lang === 'hi' ? '30 मिनट आगमन विंडो' : '30-min arrival window',
      icon: Clock
    },
    {
      id: 'checked_in',
      title: lang === 'hi' ? 'गेट चेक-इन' : 'Gate Check-in',
      desc: lang === 'hi' ? 'सत्यापन व टोकन सक्रिय' : 'Verified at entry gate',
      icon: ShieldCheck
    },
    {
      id: 'processing',
      title: lang === 'hi' ? 'तौल व गुणवत्ता' : 'Weighment & Quality',
      desc: lang === 'hi' ? 'धर्मकांटा व नमी जांच' : 'Crop weight & moisture test',
      icon: Scale
    },
    {
      id: 'payout',
      title: lang === 'hi' ? 'डीबीटी भुगतान' : 'DBT Payment',
      desc: lang === 'hi' ? 'सीधे बैंक खाते में' : 'Direct bank credit',
      icon: CreditCard
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* COMPACT CONGESTION ADVISORY BANNER */}
      <MandiCongestionBanner />

      {/* MULTIPLE BOOKINGS SELECTOR (IF THIS FARMER HAS > 1 BOOKING) */}
      {farmerBookings.length > 1 && (
        <div className="bg-white p-3.5 rounded-2xl border border-agri-ivory-muted shadow-sm flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-agri-text">
            {lang === 'hi' ? 'आपके टोकन पास:' : 'Your Active Token Passes:'}
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {farmerBookings.map((b) => {
              const isActive = b.token === activeBooking?.token;
              return (
                <button
                  key={b.token}
                  onClick={() => selectActiveBooking(b.token)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-agri-green text-white shadow-sm ring-2 ring-agri-gold'
                      : 'bg-agri-ivory text-agri-text hover:bg-agri-ivory-muted border border-agri-ivory-muted'
                  }`}
                >
                  <span>{b.token}</span>
                  <span className="text-[10px] opacity-90">({b.crop?.split(' ')[0] || 'Crop'} • {b.status})</span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-agri-gold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. PRIMARY FARMER TOKEN PASS CARD */}
      <div className="bg-[#17432A] text-white rounded-3xl p-5 sm:p-7 shadow-agri-md relative space-y-5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold text-agri-gold bg-agri-gold/20 px-2.5 py-0.5 rounded-full border border-agri-gold/30 font-mono tracking-wider uppercase">
                {lang === 'hi' ? 'आधिकारिक टोकन पास' : 'OFFICIAL TOKEN PASS'}
              </span>
              {livePosition && (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  Live Sync
                </span>
              )}
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
              {lang === 'hi' ? 'आपका कतार टोकन' : 'Your Mandi Token'}
            </h1>
          </div>

          <div className="text-right flex items-center space-x-3">
            <div>
              <span className="text-[10px] text-agri-ivory/70 block uppercase tracking-wider font-bold">
                {lang === 'hi' ? 'टोकन नंबर' : 'Token ID'}
              </span>
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-agri-gold font-mono tracking-tight">
                {activeBooking?.token || 'SNP-014'}
              </span>
            </div>
            <button
              onClick={loadQueuePosition}
              disabled={isRefreshingQueue}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-agri-ivory transition-all self-end touch-target"
              title="Refresh queue telemetry"
              aria-label="Refresh live queue status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingQueue ? 'animate-spin text-agri-gold' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Queue Status & Waiting Telemetry */}
        <div className="bg-[#102e1c] p-4 sm:p-5 rounded-2xl border border-agri-gold/30 space-y-4 font-sans">
          
          {/* WAITING State */}
          {isWaiting && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-200">
                  {lang === 'hi' ? 'अपनी बारी का इंतज़ार करें' : 'In Mandi Arrival Queue'}
                </span>
                <span className="text-[11px] font-bold text-agri-gold bg-agri-gold/20 px-2.5 py-0.5 rounded-full border border-agri-gold/30 font-mono">
                  {activeBooking?.counter || 'Counter 2'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#17432A] p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-agri-ivory/80 block font-medium">
                    {lang === 'hi' ? 'आगे किसान' : 'Farmers Ahead'}
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-white font-mono mt-0.5">
                    {farmersAheadCount}
                  </p>
                </div>
                <div className="bg-[#17432A] p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-agri-ivory/80 block font-medium">
                    {lang === 'hi' ? 'अनुमानित प्रतीक्षा' : 'Estimated Wait'}
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-agri-gold font-mono mt-0.5">
                    ~{estWaitMins} min
                  </p>
                </div>
              </div>

              <p className="text-xs text-agri-ivory/80 text-center">
                {lang === 'hi'
                  ? 'कृपया गेट सत्यापन के लिए तैयार रहें। टोकन बुलाए जाने पर काउंटर पर पहुंचें।'
                  : 'Please stay ready near the mandi yard. You will be called to the counter shortly.'}
              </p>
            </div>
          )}

          {/* CHECKED_IN State */}
          {isCheckedIn && (
            <div className="space-y-2 text-blue-100">
              <div className="flex items-center justify-between">
                <strong className="font-bold text-base text-white">
                  {lang === 'hi' ? 'गेट चेक-इन सत्यापित हुआ' : 'Gate Check-in Verified'}
                </strong>
                <span className="text-[11px] font-bold text-blue-200 bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-400/30 font-mono">
                  {activeBooking?.counter || 'Counter 2'}
                </span>
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                {lang === 'hi'
                  ? 'आपका गेट प्रवेश सत्यापित हो गया है। कृपया धर्मकांटा काउंटर 2 के पास अपनी गाड़ी कतार में रखें।'
                  : 'Your vehicle entry is verified. Please proceed to weighbridge inspection lane at Counter 2.'}
              </p>
            </div>
          )}

          {/* PROCESSING State */}
          {isProcessing && (
            <div className="space-y-2 text-agri-green-dark bg-agri-gold p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <strong className="font-extrabold text-base">
                  {lang === 'hi' ? 'आपकी बारी आ गई है!' : 'YOUR TURN HAS ARRIVED!'}
                </strong>
                <span className="text-xs font-bold text-agri-green-dark bg-white/60 px-2.5 py-0.5 rounded-full font-mono">
                  {activeBooking?.counter || 'Counter 2'}
                </span>
              </div>
              <p className="text-xs font-semibold text-agri-green-dark leading-relaxed">
                {lang === 'hi'
                  ? `टोकन ${activeBooking?.token || 'SNP-014'}: कृपया अपनी फसल की तौल और गुणवत्ता जांच के लिए काउंटर 2 पर पहुंचें।`
                  : `Token ${activeBooking?.token || 'SNP-014'}: Please proceed immediately to Counter 2 for weighment and moisture inspection.`}
              </p>
            </div>
          )}

          {/* COMPLETED State */}
          {isCompleted && (
            <div className="space-y-2 text-emerald-100">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <strong className="font-bold text-base text-white">
                  {lang === 'hi' ? 'सरकारी खरीद पूर्ण हुई' : 'Procurement Completed'}
                </strong>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {lang === 'hi'
                  ? `सत्यापित वजन: ${activeBooking?.actualQty || 38.5} क्विंटल। बैंक DBT भुगतान प्रक्रिया में है।`
                  : `Verified weighment: ${activeBooking?.actualQty || 38.5} Quintals. Direct bank DBT payout has been initiated.`}
              </p>
            </div>
          )}

        </div>

        {/* Mandi Yard & Directions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-agri-ivory/90 space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-agri-gold shrink-0" />
              <strong className="text-white text-sm">{currentCentre.name}</strong>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-agri-ivory/70 pl-5">
              <span>{lang === 'hi' ? 'स्लॉट समय:' : 'Slot Window:'} <strong className="text-white font-mono">{activeBooking?.slotTime || '11:00 AM – 11:30 AM'}</strong></span>
              <span>•</span>
              <span>{currentCentre.address}</span>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${currentCentre.lat},${currentCentre.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-1.5 transition-all shadow-sm touch-target shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'रास्ता देखें (Google Maps)' : 'Get Directions'}</span>
          </a>
        </div>

      </div>

      {/* 2. QUEUE PROGRESS & PROCUREMENT MILESTONES (FOCUSED ON CURRENT FARMER ONLY) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-agri-ivory-muted shadow-sm space-y-5 font-sans">
        
        <div className="flex items-center justify-between pb-3 border-b border-agri-ivory-muted">
          <div>
            <h2 className="font-heading text-base sm:text-lg font-bold text-agri-text">
              {lang === 'hi' ? 'प्रगति व सत्यापन स्थिति' : 'Procurement Milestone Progress'}
            </h2>
            <p className="text-xs text-agri-text-muted mt-0.5">
              {lang === 'hi' 
                ? 'आपके टोकन की चरणबद्ध सरकारी खरीद स्थिति'
                : 'Step-by-step clearance tracker for your token pass'}
            </p>
          </div>

          <span className="text-[11px] font-bold text-agri-green bg-agri-green-soft px-3 py-1 rounded-full border border-agri-green-border font-mono">
            {lang === 'hi' ? 'लाइव स्थिति' : 'Live Status'}
          </span>
        </div>

        {/* 4-Step Progress Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isStepDone = currentStepIndex >= idx;
            const isStepActive = currentStepIndex === idx;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isStepActive
                    ? 'border-2 border-agri-gold bg-agri-green-soft/50 shadow-sm'
                    : isStepDone
                    ? 'border-emerald-200 bg-emerald-50/40 text-agri-text'
                    : 'border-agri-ivory-muted bg-agri-ivory/30 text-agri-text-muted opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isStepDone
                      ? 'bg-emerald-100 text-emerald-700 font-bold'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isStepDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-agri-text-muted">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xs sm:text-sm text-agri-text">
                  {step.title}
                </h3>
                <p className="text-[11px] text-agri-text-muted mt-0.5 leading-snug">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Booking Details Summary Box */}
        <div className="pt-4 border-t border-agri-ivory-muted">
          <div className="bg-agri-ivory/50 rounded-2xl p-4 border border-agri-ivory-muted grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-agri-text-muted block font-medium">
                {lang === 'hi' ? 'फसल व किस्म' : 'Crop'}
              </span>
              <strong className="text-agri-text font-bold block mt-0.5">
                {activeBooking?.crop || 'Paddy (Grade A)'}
              </strong>
            </div>

            <div>
              <span className="text-[11px] text-agri-text-muted block font-medium">
                {lang === 'hi' ? 'अपेक्षित मात्रा' : 'Expected Quantity'}
              </span>
              <strong className="text-agri-text font-mono font-bold block mt-0.5">
                {activeBooking?.expectedQty || 40} Quintals
              </strong>
            </div>

            <div>
              <span className="text-[11px] text-agri-text-muted block font-medium">
                {lang === 'hi' ? 'एमएसपी दर (MSP)' : 'MSP Rate'}
              </span>
              <strong className="text-agri-green font-mono font-bold block mt-0.5">
                ₹{Number(activeBooking?.ratePerQuintal || 2200).toLocaleString()}/Qtl
              </strong>
            </div>

            <div>
              <span className="text-[11px] text-agri-text-muted block font-medium">
                {lang === 'hi' ? 'अनुमानित कुल राशि' : 'Est. Total Payout'}
              </span>
              <strong className="text-agri-green font-mono font-extrabold text-sm block mt-0.5">
                ₹{((activeBooking?.actualQty || activeBooking?.expectedQty || 40) * (activeBooking?.ratePerQuintal || 2200)).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

